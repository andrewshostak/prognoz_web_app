import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { catchError, map, share } from 'rxjs/operators';
import { environment } from '@env';
import { ErrorHandlerService } from '@services/error-handler.service';
import { HeadersWithToken } from '@services/headers-with-token.service';
import { Observable } from 'rxjs';
import { User } from '@models/user.model';
import { UtilsService } from '@services/utils.service';

@Injectable()
export class AuthService {
    constructor(
        private errorHandlerService: ErrorHandlerService,
        private headersWithToken: HeadersWithToken,
        private httpClient: HttpClient,
        private router: Router
    ) {
        this.getUser = new Observable(observer => {
            this.userObserver = observer;
        }).pipe(share());
    }

    private authUrl = environment.apiUrl + 'auth/';
    public getUser: Observable<any>;
    private userObserver: any;

    /**
     * Authenticated user has role
     * @param {string} role
     * @returns {boolean}
     */
    hasRole(role: string): boolean {
        const userRoles = UtilsService.getItemFromLocalStorage('roles');
        if (userRoles && userRoles.length) {
            if (userRoles.includes(role)) {
                return true;
            }
        }
        return false;
    }

    // todo: use this method in all guards
    canActivate(roles: string[]): boolean {
        if (!!localStorage.getItem('roles') && !!localStorage.getItem('auth_token')) {
            const userRoles = JSON.parse(localStorage.getItem('roles'));
            for (const role in userRoles) {
                if (roles.indexOf(userRoles[role]) > -1) {
                    return true;
                }
            }
        }

        this.router.navigate(['/403']);
        return false;
    }

    /**
     * Update user data if token and old user data is present in localStorage.
     * If response error happens, it will clear user data and roles.
     */
    initializeUser() {
        if (this.isUserAndTokenInLocalStorage()) {
            this.refresh().subscribe(
                response => {
                    this.updateItemInLocalStorage('user', response.user);
                    this.updateItemInLocalStorage('roles', response.roles);
                    this.userObserver.next(response.user);
                },
                () => {
                    this.updateItemInLocalStorage('user');
                    this.updateItemInLocalStorage('roles');
                    this.updateItemInLocalStorage('auth_token');
                }
            );
        }
    }

    /**
     * Check if token and user data exists in localStorage
     * @returns {boolean}
     */
    isUserAndTokenInLocalStorage() {
        return !!localStorage.getItem('auth_token') && !!localStorage.getItem('user');
    }

    /**
     * Sign in request
     * @param name
     * @param password
     * @returns {Observable<any>}
     */
    signIn(name, password): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.httpClient.post(this.authUrl + 'signin', { name, password }, { headers: headers }).pipe(
            map(response => {
                if (response['token']) {
                    this.setTokenToLocalStorage(response['token']);
                    this.updateItemInLocalStorage('user', response['user']);
                    this.updateItemInLocalStorage('roles', response['roles']);
                    this.userObserver.next(response['user']);
                }
                return response['user'];
            }),
            catchError(this.errorHandlerService.handle)
        );
    }

    /**
     * Sends registration request
     * @param user
     * @returns {Observable<any>}
     */
    signUp(user: User): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.httpClient.post(this.authUrl + 'signup', user, { headers: headers }).pipe(
            map(response => {
                if (response['token']) {
                    this.setTokenToLocalStorage(response['token']);
                    this.updateItemInLocalStorage('user', response['user']);
                    this.userObserver.next(response['user']);
                }
                return response['user'];
            }),
            catchError(this.errorHandlerService.handle)
        );
    }

    /**
     * Sends unvalidate token request
     * @returns {Observable<any>}
     */
    logout(): Observable<any> {
        this.userObserver.next(null);
        return this.headersWithToken.post(this.authUrl + 'logout', {}).pipe(catchError(this.errorHandlerService.handle));
    }

    /**
     * Sends recovery request
     * @param email
     * @returns {Observable<any>}
     */
    recovery(email: string): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.httpClient
            .post(this.authUrl + 'recovery', { email: email }, { headers: headers })
            .pipe(catchError(this.errorHandlerService.handle));
    }

    /**
     * Sends reset password request
     * @param user
     * @returns {Observable<any>}
     */
    reset(user: User): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.httpClient.post(this.authUrl + 'reset', user, { headers: headers }).pipe(catchError(this.errorHandlerService.handle));
    }

    /**
     * Refresh user data request (by token)
     * @returns {Observable<any>}
     */
    private refresh(): Observable<any> {
        return this.headersWithToken.get(this.authUrl + 'refresh').pipe(catchError(this.errorHandlerService.handle));
    }

    private updateItemInLocalStorage(key: string, value?: any): void {
        if (!!value) {
            localStorage.setItem(key, JSON.stringify(value));
        } else {
            localStorage.removeItem(key);
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
