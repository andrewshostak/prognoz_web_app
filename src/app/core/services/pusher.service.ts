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

   createInstance(): Pusher {
      return new Pusher(environment.pusherApiKey, {
         cluster: 'eu',
         authEndpoint: environment.apiBaseUrl + '/v2/auth/pusher',
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
   subscribeToChannel(instance: Pusher, channelName: string) {
      return instance.subscribe(channelName);
   }

   /**
    * Unsubscribe from channel
    * @param instance
    * @param {string} channelName
    */
   unsubscribeFromChannel(instance: Pusher, channelName: string) {
      return instance.unsubscribe(channelName);
   }
}
