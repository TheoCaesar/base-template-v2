import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { PresignedUrlRequest, PresignedUrlResponse } from '../../models/file-mgt/file-mgt.models';

@Injectable({
  providedIn: 'root'
})
export class FileMgtService {
  private readonly SERVICE_PATH = environment.SERVICES.FILE;
  private readonly FILE_MANAGEMENT_ENDPOINTS = {
    PRESIGNED_URL: `${this.SERVICE_PATH}/file-uploads/onboarding/sign-url`,
  }
  constructor(private apiService: ApiService  ) { }
  
  uploadOnboardingDocsAWS(document: File, url: string){
    const context =this.apiService.buildContext(['contentTypeFile'])
    return this.apiService.uploadFile(url, document);
  }

  generatePreSignedUrl(payload: PresignedUrlRequest): Observable<PresignedUrlResponse>{
    const context = this.apiService.buildContext(['apiKey'])
    return this.apiService.post(this.FILE_MANAGEMENT_ENDPOINTS.PRESIGNED_URL, payload, context);
  }
}
