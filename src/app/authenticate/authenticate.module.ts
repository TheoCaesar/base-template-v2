import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { OtpComponent } from './otp/otp.component';
import { AuthenticateComponent } from './authenticate.component';
import { SharedModule } from '../shared/shared.module';

const route: Routes = [
  { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
  { path: 'sign-in', component: LoginComponent },
  { path: 'verify-otp', component: OtpComponent },

  // {path: "forgot-password", component: ForgotPasswordComponent},
  // { path: "reset-password/:cp", component: ResetPasswordComponent},
];

@NgModule({
  declarations: [
    LoginComponent,
    OtpComponent,
    AuthenticateComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(route),
    SharedModule
  ],
  exports: [
    LoginComponent,
    RouterModule
  ],
})
export class AuthenticateModule {}
