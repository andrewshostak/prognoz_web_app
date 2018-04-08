import { Injectable }               from '@angular/core';
import { HttpClient, HttpHeaders }  from '@angular/common/http';
import { Observable }               from 'rxjs/Observable';

import { environment }          from '../../environments/environment';
import { ErrorHandlerService }  from './error-handler.service';
import { HeadersWithToken }     from './headers-with-token.service';
import { User }                 from '../shared/models/user.model';

@Injectable()
export class AuthService {

    constructor(
        private errorHandlerService: ErrorHandlerService,
        private headersWithToken: HeadersWithToken,
        private httpClient: HttpClient
    ) {
        this.getUser = new Observable(observer => {
            this.userObserver = observer;
        }).share();
    }

    private authUrl = environment.apiUrl + 'auth/';
    public getUser: Observable<any>;
    private userObserver: any;

    /**
     * Update user data if token and old user data is present in localStorage.
     * If response error happens, it will clear user data and roles.
     */
    initializeUser() {
        if (this.isUserAndTokenInLocalStorage()) {
                this.refresh().subscribe(
                    response => {
                        this.updateUserInLocalStorage(response.user);
                        this.updateRolesInLocalStorage(response.roles);
                        this.userObserver.next(response.user);
                    },
                    error => {
                        this.updateUserInLocalStorage();
                        this.updateRolesInLocalStorage();
                    }
                );
        }
    }

    /**
     * Sign in request
     * @param name
     * @param password
     * @returns {Observable<any>}
     */
    signIn(name, password): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.httpClient
            .post(this.authUrl + 'signin', {name, password}, {headers: headers})
            .map(response => {
                if (response['token']) {
                    this.setTokenToLocalStorage(response['token']);
                    this.updateUserInLocalStorage(response['user']);
                    this.updateRolesInLocalStorage(response['roles']);
                    this.userObserver.next(response['user']);
                }
                return response['user'];
            })
            .catch(this.errorHandlerService.handle);
    }

    /**
     * Sends unvalidate token request
     * @returns {Observable<any>}
     */
    logout(): Observable<any> {
        return this.headersWithToken
            .post(this.authUrl + 'logout', {})
            .map(response => {
                localStorage.clear();
                this.userObserver.next(null);
                return response;
            })
            .catch(this.errorHandlerService.handle);
    }

    /**
     * Sends registration request
     * @param user
     * @returns {Observable<any>}
     */
    signUp(user: User): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.httpClient
            .post(this.authUrl + 'signup', user, {headers: headers})
            .map(response => {
                if (response['token']) {
                    this.setTokenToLocalStorage(response['token']);
                    this.updateUserInLocalStorage(response['user']);
                    this.userObserver.next(response['user']);
                }
                return response['user'];
            })
            .catch(this.errorHandlerService.handle);
    }

    /**
     * Sends recovery request
     * @param email
     * @returns {Observable<any>}
     */
    recovery(email: string): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.httpClient
            .post(this.authUrl + 'recovery', {email: email}, {headers: headers})
            .catch(this.errorHandlerService.handle);
    }

    /**
     * Sends reset password request
     * @param user
     * @returns {Observable<any>}
     */
    reset(user: User): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.httpClient
            .post(this.authUrl + 'reset', user, {headers: headers})
            .catch(this.errorHandlerService.handle);
    }

    /**
     * Refresh user data request (by token)
     * @returns {Observable<any>}
     */
    private refresh(): Observable<any> {
        return this.headersWithToken.get(this.authUrl + 'refresh')
            .catch(this.errorHandlerService.handle);
    }

    /**
     * Check if token and user data exists in localStorage
     * @returns {boolean}
     */
    isUserAndTokenInLocalStorage() {
        return !!localStorage.getItem('auth_token') && !!localStorage.getItem('user');
    }

    /**
     * Update user data in localStorage
     * or remove it if function has no arguments
     * @param user
     */
    private updateUserInLocalStorage(user?: any) {
        if (!!user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }

    /**
     * Update roles array in localStorage
     * or remove it if function has no arguments
     * @param roles
     */
    private updateRolesInLocalStorage(roles?: Array<string>) {
        if (!!roles) {
            localStorage.setItem('roles', JSON.stringify(roles));
        } else {
            localStorage.removeItem('roles');
        }
    }

    /**
     * Set token to localStorage
     * @param token
     */
    private setTokenToLocalStorage(token) {
        localStorage.setItem('auth_token', token);
    }
}
