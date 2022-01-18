import { Injectable } from '@angular/core';

import { environment } from '@env';
import Pusher from 'pusher-js';

@Injectable()
export class PusherService {
   /**
    * Bind event to channel
    * @param subscription
    * @param {string} eventName
    * @param callback
    */
   bindEvent(subscription, eventName: string, callback) {
      return subscription.bind(eventName, callback);
   }

   /**
    * Create Pusher instance
    * @returns {any}
    */
   createInstance() {
      return new Pusher(environment.pusher.apiKey, {
         cluster: 'eu',
         authEndpoint: environment.apiUrl + 'v2/auth/pusher',
         auth: {
            params: {},
            headers: {
               Authorization: 'Bearer {' + localStorage.getItem('auth_token') + '}'
            }
         }
      });
   }

   /**
    * Subscribe to channel
    * @param instance
    * @param {string} channelName
    */
   subscribeToChannel(instance, channelName: string) {
      return instance.subscribe(channelName);
   }

   /**
    * Unsubscribe from channel
    * @param instance
    * @param {string} channelName
    */
   unsubscribeFromChannel(instance, channelName: string) {
      return instance.unsubscribe(channelName);
   }
}
