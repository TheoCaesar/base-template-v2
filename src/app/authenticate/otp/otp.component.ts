import { Component, OnInit, OnDestroy, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subject, interval, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

// ── Config types ────────────────────────────────────────────────────────────────
export interface OtpConfig {
  codeLength: number;
  timerSeconds: number;
  maskedPhone: string;
  supportPhone: string;
}

// ── Icons (Lucide SVGs) ──────────────────────────────────────────────────────────
const ICONS: Record<string, string> = {
  chevronLeft: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`,
  phone:       `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
};

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
})
export class OtpComponent implements OnInit, OnDestroy {

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  // ── Config ─────────────────────────────────────────────────────────────────────
  config: OtpConfig = {
    codeLength:  6,
    timerSeconds: 147,
    maskedPhone: '+233 24 ••• 4521',
    supportPhone: '+233 30 274 0900',
  };

  // ── State ──────────────────────────────────────────────────────────────────────
  otpForm!: FormGroup;
  otpDigits: FormControl[] = [];
  timeRemaining = this.config.timerSeconds;
  canResend = false;
  isSubmitting = false;
  icons: Record<string, SafeHtml> = {};

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.initializeIcons();
    this.startTimer();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    const group: { [key: string]: FormControl } = {};
    for (let i = 0; i < this.config.codeLength; i++) {
      group[`digit${i}`] = new FormControl('', [
        Validators.required,
        Validators.maxLength(1),
        Validators.pattern(/^[0-9]$/),
      ]);
      this.otpDigits.push(group[`digit${i}`]);
    }
    this.otpForm = this.fb.group(group);
  }

  private initializeIcons(): void {
    for (const [key, svg] of Object.entries(ICONS)) {
      this.icons[key] = this.sanitizer.bypassSecurityTrustHtml(svg);
    }
  }

  private startTimer(): void {
    interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.timeRemaining--;
        if (this.timeRemaining <= 0) {
          this.canResend = true;
          this.timeRemaining = 0;
        }
      });
  }

  getFormattedTime(): string {
    const mins = Math.floor(this.timeRemaining / 60);
    const secs = this.timeRemaining % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  onResend(): void {
    this.canResend = false;
    this.timeRemaining = this.config.timerSeconds;
    this.otpForm.reset();
    this.otpInputs.first.nativeElement.focus();
    this.startTimer();
  }

  onOtpInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (!/^[0-9]?$/.test(value)) {
      input.value = '';
      return;
    }

    if (value && index < this.config.codeLength - 1) {
      this.otpInputs.toArray()[index + 1].nativeElement.focus();
    }
  }

  onOtpKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.otpDigits[index].value && index > 0) {
      this.otpInputs.toArray()[index - 1].nativeElement.focus();
    } else if (event.key === 'ArrowLeft' && index > 0) {
      this.otpInputs.toArray()[index - 1].nativeElement.focus();
    } else if (event.key === 'ArrowRight' && index < this.config.codeLength - 1) {
      this.otpInputs.toArray()[index + 1].nativeElement.focus();
    }
  }

  onOtpPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text') || '';
    const digits = pastedData.replace(/\D/g, '').slice(0, this.config.codeLength);

    if (digits.length === this.config.codeLength) {
      digits.split('').forEach((digit, i) => {
        this.otpDigits[i].setValue(digit);
      });
      this.otpInputs.last.nativeElement.focus();
    }
  }

  getOtpCode(): string {
    return this.otpDigits.map(c => c.value).join('');
  }

  onSubmit(): void {
    if (!this.isFormValid()) {
      return;
    }

    this.isSubmitting = true;
    const otpCode = this.getOtpCode();
    console.log('OTP verification →', otpCode);
  }

  private isFormValid(): boolean {
    return this.otpDigits.every(control => control.valid && control.value);
  }

  goBack(): void {
    this.router.navigate(['/authenticate/sign-in']);
  }
}
