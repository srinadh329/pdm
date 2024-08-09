import { Injectable } from '@angular/core';
import { EncryptService } from 'src/app/encrypt.service';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor(private encryptService: EncryptService) { }

  getItem(key) {
    const data = this.getFromLocal();
   
    return data[key];
  }

  setItem(key, value) {
    const data = this.getFromLocal();
    data[key] = value;
    this.setToLocal(data);
  }

  removeItem(key) {
    const data = this.getFromLocal();
    if (key && data[key]) {
      delete data[key];
    }
    this.setToLocal(data);
  }

  logoutLocal() {
    const data = this.getFromLocal();
    Object.keys(data).map((item) => {
      if (item === 'rememberme_data') {
      } else {
        delete data[item];
      }
    });
    this.setToLocal(data);
  }

  clear() {
    this.setToLocal({});
  }
  set_session_rememberMe(data) {
    localStorage.setItem('rememberMe', data);
  }
  get_session_rememberMe() {
      return localStorage.getItem('rememberMe');
  }
  clear_session_rememberMe() {
      localStorage.removeItem('rememberMe');
  }

  setToLocal(obj) {
    localStorage.setItem('app_data', this.encryptService.encryptData(obj));
  }

  getFromLocal() {
    if (this.encryptService.decryptData(localStorage.getItem('app_data'))) {
      return this.encryptService.decryptData(localStorage.getItem('app_data'));
    } else { return {}; }
  }
}
