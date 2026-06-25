import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

// ── Config types ────────────────────────────────────────────────────────────────
export interface LoginTab {
  id: string;
  label: string;
}

export interface StatItem {
  value: string;
  label: string;
}

// ── Icons (Lucide SVGs — no external library needed) ────────────────────────────
const ICONS: Record<string, string> = {
  mail:       `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  lock:       `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  eye:        `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
  eyeOff:     `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>`,
  infoCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
  arrowRight: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  // ── Data-driven config ────────────────────────────────────────────────────────

  /** Authentication method tabs — add / reorder / rename here, not in the template */
  tabs: LoginTab[] = [
    { id: 'administrator', label: 'Administrator' },
    { id: 'fi-user',       label: 'FI User' },
  ];

  /** Left-panel stats block — edit values and labels here */
  stats: StatItem[] = [
    { value: '$48M',  label: 'Disbursed funds'  },
    { value: '2,184', label: 'Active accounts'  },
    { value: '11',    label: 'FI partners'      },
  ];

  // ── State ─────────────────────────────────────────────────────────────────────
  activeTab    = 'administrator';
  showPassword = false;
  loginForm!: FormGroup;
  icons: Record<string, SafeHtml> = {};
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email:          ['', [Validators.required, Validators.email]],
      password:       ['', [Validators.required, Validators.minLength(6)]],
      rememberDevice: [false],
    });

    for (const [key, svg] of Object.entries(ICONS)) {
      this.icons[key] = this.sanitizer.bypassSecurityTrustHtml(svg);
    }
  }

  // ── Methods ───────────────────────────────────────────────────────────────────

  setTab(id: string): void {
    this.activeTab = id;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    // Hand off to your auth service here
    console.log('Login payload →', this.loginForm.value);
  }

  // ── Form field getters (for template validation messages) ─────────────────────
  get email()    { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}
