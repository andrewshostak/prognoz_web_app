import { Injectable } from '@angular/core';

import { environment } from '@env';

declare const Pusher: any;

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
        const pusher = new Pusher(environment.pusher.apiKey, {
            cluster: 'eu',
            encrypted: false,
            authEndpoint: environment.apiUrl + 'auth/pusher',
            auth: {
                headers: {
                    Authorization: 'Bearer {' + localStorage.getItem('auth_token') + '}'
                }
            }
        });

        return pusher;
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
