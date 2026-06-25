import { computed, Injectable, signal } from '@angular/core';
import { AuthenticatedUserDetails, AuthToken } from '../models/auth/auth.models';
import { AuthDetailsbyIdentifier, } from '../models/auth/auth-response';
import { EncryptionService } from './encryption/encryption.service';
import { StorageService } from './storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _authToken = signal<string | null>(null);
  readonly authToken = this._authToken.asReadonly();
  isAuthenticated = computed(()=>!!(this._authToken()));
  
  constructor( private encryptionService: EncryptionService, private storageService: StorageService ) { }
  clearAuthToken(){
    this._authToken.set(null);
  }

  userDetailsBuilder(userDetails: AuthDetailsbyIdentifier){
    this.encodeAuthDetails(userDetails);
  }

  getAuthenticatedDetails(): AuthDetailsbyIdentifier{
    return this.decodeAuthDetails();
  }

  private encodeAuthDetails(authDetails: AuthDetailsbyIdentifier) {
    const codedDetails = `${authDetails.accessToken}|${authDetails.expiresIn}|${authDetails.firstLogin}|${authDetails.refreshToken}|${authDetails.temporalIdentifier}`;
    try {
      const encryptedUsr_d = this.encryptionService.encrypt(codedDetails)
      console.log(codedDetails);
      
      this.storageService.setItem('usr-d', encryptedUsr_d.replace('/', '*'));
    } catch {}
  }

  private decodeAuthDetails(): AuthDetailsbyIdentifier {
    let authDetails: AuthDetailsbyIdentifier = {accessToken: '', expiresIn: '', refreshToken: '', firstLogin: false, temporalIdentifier:''};
    try {
      const codedAuthDetails: any = (this.storageService.getItem<string>('usr-d') ?? '').replace('*', '/');
      const decryptedUsr_d: any = JSON.parse(this.encryptionService.decrypt(codedAuthDetails))
      if (decryptedUsr_d) {
        const decodedAuthDetails = decryptedUsr_d.split('|');
        authDetails = {
          accessToken: decodedAuthDetails[0],
          expiresIn: decodedAuthDetails[1],
          refreshToken: decodedAuthDetails[2],
          firstLogin: decodedAuthDetails[3],
          temporalIdentifier: decodedAuthDetails[4],
        }
        this._authToken.set(authDetails.accessToken)
        return authDetails;
      }
    } catch {}
    return authDetails
  }
}
