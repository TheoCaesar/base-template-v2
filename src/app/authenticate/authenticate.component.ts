import { Component } from '@angular/core';
import {FormGroup} from '@angular/forms';
import {SafeHtml} from '@angular/platform-browser';
import {StatItem} from './login/login.component';

@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrl: './authenticate.component.scss'
})
export class AuthenticateComponent {
  stats: StatItem[] = [
    { value: '$48M',  label: 'Disbursed funds'  },
    { value: '2,184', label: 'Active accounts'  },
    { value: '11',    label: 'FI partners'      },
  ];

  icons: Record<string, SafeHtml> = {};

}
