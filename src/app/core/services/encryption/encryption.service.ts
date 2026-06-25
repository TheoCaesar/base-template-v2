import { Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment.development'
import * as CryptoJS from 'crypto-js'

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  constructor() { }
  encrypt(data: any) {
    let _key = CryptoJS.enc.Utf8.parse(environment.ENC_DEC_KEY);
    let _iv = CryptoJS.enc.Utf8.parse(environment.ENC_DEC_KEY);
    let encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(data), _key, {
      keySize: 16,
      iv: _iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  }

  decrypt(data: any) {
    let _key = CryptoJS.enc.Utf8.parse(environment.ENC_DEC_KEY);
    let _iv = CryptoJS.enc.Utf8.parse(environment.ENC_DEC_KEY);

    let decrypted = CryptoJS.AES.decrypt(
      data, _key, {
      keySize: 16,
      iv: _iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8)
  }
}
