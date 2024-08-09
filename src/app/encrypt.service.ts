import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
const CLIENT_SECRET = 'HNHGGBHGHBHG7VVGVWH';

@Injectable({
  providedIn: 'root'
})
export class EncryptService {

  constructor() { }

 encryptData = (data:any) => {
  const encrypt = CryptoJS.AES.encrypt(JSON.stringify(data), CLIENT_SECRET).toString();
  return encrypt.replaceAll('+', '-').replaceAll('/', '_');
 };
 
 decryptData = (data:any) => {
  if (data) {
    const decrypt = data.replaceAll('-', '+').replaceAll('_', '/');
    const bytes = CryptoJS.AES.decrypt(decrypt, CLIENT_SECRET);
    if (bytes.toString()) {
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }
  }
  return data;
};
}
