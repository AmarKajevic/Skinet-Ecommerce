import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Address, User } from '../../shared/models/user';
import { catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  currentUser = signal<User | null>(null);

  login(values: any) {
    let params = new HttpParams();
    params = params.append('useCookies', true);
    return this.http.post<User>(this.baseUrl + 'login', values, {params});
  }
  register(values: any){
    return this.http.post<User>(this.baseUrl + 'account/register', values);
  }


  getUserInfo() {
  return this.http.get<User>(this.baseUrl + 'account/user-info').pipe(
    map(user => {
      if (user) {
        this.currentUser.set(user);
        return user;
      } else {
        throw new Error('No user data received');
      }
    }),
    catchError(error => {
      console.error('Error fetching user info:', error);
      return throwError(() => new Error('Failed to get user info: ' + error.message));
    })
  );
}

  logout(){
    return this.http.post(this.baseUrl + 'account/logout', {});
  }
  updateAddress(address: Address){
    return this.http.put(this.baseUrl + 'account/address', address);
  }

  getAuthState(){
    return this.http.get<{IsAuthenticated: boolean}>(this.baseUrl + 'account/auth-status');
  }

}
