import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { environment } from '@env';
import { ErrorHandlerService } from '@services/error-handler.service';
import { HeadersWithToken } from '@services/headers-with-token.service';
import { User } from '@models/user.model';

@Injectable()
export class UserService {
    constructor(
        private errorHandlerService: ErrorHandlerService,
        private headersWithToken: HeadersWithToken,
        private httpClient: HttpClient
    ) {}

    private usersUrl = environment.apiUrl + 'users';

    /**
     * Get users
     * @param order
     * @param limit
     * @param sequence
     * @returns {Observable<any>}
     */
    getUsers(limit?: number, order?: string, sequence?: 'asc' | 'desc'): Observable<any> {
        let params: HttpParams = new HttpParams();
        if (limit) {
            params = params.append('limit', limit.toString());
        }
        if (order) {
            params = params.append('order', order);
        }
        if (sequence) {
            params = params.append('sequence', sequence);
        }
        return this.httpClient.get(this.usersUrl, { params: params }).catch(this.errorHandlerService.handle);
    }

    /**
     * Get user by id
     * @param id
     * @returns {Observable<User>}
     */
    getUser(id: number): Observable<User> {
        return this.httpClient
            .get(`${this.usersUrl}/${id}`)
            .map(response => response['user'])
            .catch(this.errorHandlerService.handle);
    }

    /**
     * Update user profile data
     * @param user
     * @returns {Observable<User>}
     */
    updateUser(user: User): Observable<User> {
        return this.headersWithToken.put(`${this.usersUrl}/${user.id}`, user).catch(this.errorHandlerService.handle);
    }
}
