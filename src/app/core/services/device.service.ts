import { Injectable } from '@angular/core';

import { Device } from '@models/device.model';

declare const Fingerprint2: any;
declare const UAParser: any;

type RequestIdleCallbackHandle = any;
// tslint:disable-next-line:interface-over-type-literal
type RequestIdleCallbackOptions = {
   timeout: number;
};
// tslint:disable-next-line:interface-over-type-literal
type RequestIdleCallbackDeadline = {
   readonly didTimeout: boolean;
   timeRemaining: () => number;
};

declare global {
   // tslint:disable-next-line:interface-name
   interface Window {
      requestIdleCallback: (
         callback: (deadline: RequestIdleCallbackDeadline) => void,
         opts?: RequestIdleCallbackOptions
      ) => RequestIdleCallbackHandle;
   }
}

@Injectable()
export class DeviceService {
   public static readonly emptyDevice: Device = { fingerprint: 'unknown', info: {} };

   public getDevice(): Promise<Device> {
      return new Promise((resolve, reject) => {
         async function getHash() {
            const options = {
               excludes: {
                  plugins: true,
                  localStorage: true,
                  adBlock: true,
                  screenResolution: true,
                  availableScreenResolution: true,
                  enumerateDevices: true,
                  pixelRatio: true,
                  doNotTrack: true
               },
               preprocessor: (key, value) => {
                  if (key === 'userAgent') {
                     const parser = new UAParser(value);
                     // return customized user agent (without browser version)
                     return `${parser.getOS().name} :: ${parser.getBrowser().name} :: ${parser.getEngine().name}`;
                  }
                  return value;
               }
            };

            try {
               const components = await Fingerprint2.getPromise(options);
               const values = components.map(component => component.value);

               const omittedKeys = ['canvas', 'webgl'];
               const info = components.reduce((acc, item) => {
                  if (omittedKeys.includes(item.key)) {
                     return acc;
                  }
                  return { ...acc, [item.key]: item.value };
               }, {});

               return { fingerprint: String(Fingerprint2.x64hash128(values.join(''), 31)), info };
            } catch (e) {
               reject(e);
            }
         }

         if (window.requestIdleCallback) {
            window.requestIdleCallback(async () => resolve(await getHash()));
         } else {
            setTimeout(async () => resolve(await getHash()), 500);
         }
      });
   }
}
