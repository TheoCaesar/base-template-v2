import { Injectable } from '@angular/core';
import { EncryptionService } from '../encryption/encryption.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor( private encryptionService: EncryptionService) { }
  setItem<T>( key: string,  value: T): void {
    const encrypted = this.encryptionService.encrypt(value);
    sessionStorage.setItem( key, JSON.stringify(encrypted));
  }

  getItem<T>( key: string ): T | null {
    const value = sessionStorage.getItem(key);
    if (!value)
      return null;

    const decrypted = this.encryptionService.decrypt(value);

    return JSON.parse( decrypted ) as T;
  }

  removeItem(key: string ): void {
    sessionStorage.removeItem(key);
  }

  clear(): void {
    sessionStorage.clear();
  }
}
