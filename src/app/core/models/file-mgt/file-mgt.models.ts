export type FILE_OPTIONS = 'BUSINESS_CERTIFICATE' | "CONSENT_FORM";

export interface PresignedUrlRequest {
    type: FILE_OPTIONS;
}

export interface PresignedUrlResponse {
    url: string;
    key: string;
}