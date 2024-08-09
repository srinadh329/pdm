import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  errorData: {};

  constructor(private http: HttpClient, private ls: LocalStorageService) {
   
  }
  redirectUrl: string;
  private messageSource = new Subject<boolean>();
  currentMessage = this.messageSource.asObservable();
  changeMessage(message: boolean) {
    this.messageSource.next(message);
  }


  doLogin(user: any) {
    return this.http.post<any>(environment.endPoint + 'getToken', user);
  }
  socialLogin(user:any) {
    return this.http.post<any>(environment.endPoint + 'loginByGoogle', user);
  }
  doSignup(user: any) {
    const qparam = user;
  
    return this.http.post<any>(environment.endPoint + 'signup', qparam);
  }
  sendResetLink(email: any){
    return this.http.get<any>(environment.endPoint + 'forgotPassword?email=' + email);
  }
  fbLogin(user: any) {
    return this.http.post<any>(environment.endPoint + 'connect', user);
  }
  fbSignup(user: any){
    let qparam = '';
    if (user.promotionCode !== undefined && user.promotionCode != null){
      qparam += '?loyaltyPromotionCode=' + user.promotionCode;
    }
    return this.http.post<any>(environment.endPoint + 'connect' + qparam, user);
  }
  loggedIn() {
    return !!this.ls.getItem('userId');
  }

  getProfileInfo(val: any) {
    return this.ls.getItem(val);
  }
  resetPassword(val: any){
    return this.http.post<any>(environment.endPoint + 'password/email', val);
  }
  setPassword(val: any){
    return this.http.post<any>(environment.endPoint + 'password/reset', val);
  }
  logout(){
    this.ls.clear();
  }
  getExternalUser(){
    return this.http.get<any>(environment.endPoint + 'getExternalUser');
  }
}
