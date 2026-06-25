import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  DataTableConfig,
  DataTableColumn,
  TableAction,
  TableFilter,
  CellStyle,
  CellClass,
  BadgeConfig,
  ChipConfig,
} from './data-table.types';

// ---------------------------------------------------------------------------
// Internal icon map (Lucide SVGs – no external library needed)
// ---------------------------------------------------------------------------
const DT_ICONS: Record<string, string> = {
  search:       `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`,
  filter:       `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`,
  calendar:     `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  edit:         `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  delete:       `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  restore:      `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`,
  pin:          `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="17" x2="12" y2="22"/><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/></svg>`,
  file:         `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>`,
  download:     `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  plus:         `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`,
  chevronLeft:  `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`,
  chevronRight: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`,
};

// Deterministic colour pool for auto-generated avatars
const AVATAR_COLORS = [
  '#16A34A', '#2563EB', '#9333EA', '#EA580C',
  '#0891B2', '#DC2626', '#CA8A04', '#0D9488',
  '#7C3AED', '#BE185D',
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent implements OnChanges {
  // ── Inputs ──────────────────────────────────────────────────────────────
  @Input() config!: DataTableConfig;
  @Input() data: any[] = [];
  @Input() totalItems = 0;
  @Input() currentPage = 1;
  @Input() loading = false;

  /**
   * External per-column cell style overrides.
   * Key = column.key, value = style object or (value, row) => style object.
   *
   * @example
   * cellStyles = {
   *   email: { fontStyle: 'italic' },
   *   status: (val, row) => ({ fontWeight: row.isPrimary ? '700' : '400' })
   * }
   */
  @Input() cellStyles: { [columnKey: string]: CellStyle } = {};

  /**
   * External per-column cell class overrides.
   * Key = column.key, value = class string or (value, row) => class string.
   */
  @Input() cellClasses: { [columnKey: string]: CellClass } = {};

  // ── Outputs ─────────────────────────────────────────────────────────────
  @Output() searchChange  = new EventEmitter<string>();
  @Output() filterChange  = new EventEmitter<{ key: string; value: any }>();
  @Output() pageChange    = new EventEmitter<number>();
  @Output() exportClick   = new EventEmitter<void>();
  @Output() createClick   = new EventEmitter<void>();
  @Output() actionClick   = new EventEmitter<{ action: string; row: any }>();
  @Output() rowClick      = new EventEmitter<any>();

  // ── Internal state ───────────────────────────────────────────────────────
  icons: Record<string, SafeHtml> = {};
  searchValue = '';

  constructor(private sanitizer: DomSanitizer) {
    for (const [key, svg] of Object.entries(DT_ICONS)) {
      this.icons[key] = this.sanitizer.bypassSecurityTrustHtml(svg);
    }
  }

  ngOnChanges(_changes: SimpleChanges): void {}

  // ── Computed ─────────────────────────────────────────────────────────────
  get visibleColumns(): DataTableColumn[] {
    return (this.config?.columns ?? []).filter(c => !c.hidden);
  }

  get pageSize(): number {
    return this.config?.pageSize ?? 10;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }

  get pages(): number[] {
    const total = this.totalPages;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const start = Math.max(1, this.currentPage - 2);
    const end   = Math.min(total, start + 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  get countStart(): number {
    if (this.totalItems === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get countEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }

  get showToolbar(): boolean {
    const c = this.config;
    if (!c) return false;
    return (
      c.showSearch !== false ||
      (c.showFilters !== false && (c.filters?.length ?? 0) > 0) ||
      !!c.showSortLabel ||
      !!c.showExportBtn ||
      !!c.showCreateBtn
    );
  }

  get showFooter(): boolean {
    const c = this.config;
    if (!c) return false;
    return c.showFooterCount !== false || c.showPagination !== false;
  }

  // ── Cell helpers ─────────────────────────────────────────────────────────

  getCellValue(row: any, col: DataTableColumn): any {
    // Supports dot-notation keys: 'address.city'
    return col.key.split('.').reduce((obj, k) => obj?.[k], row);
  }

  getCellStyle(col: DataTableColumn, row: any): { [key: string]: string } {
    const value = this.getCellValue(row, col);

    const colStyle = typeof col.cellStyle === 'function'
      ? col.cellStyle(value, row)
      : (col.cellStyle ?? {});

    const ext = this.cellStyles[col.key];
    const extStyle = ext
      ? (typeof ext === 'function' ? ext(value, row) : ext)
      : {};

    return { ...colStyle, ...extStyle };
  }

  getCellClass(col: DataTableColumn, row: any): string {
    const value = this.getCellValue(row, col);

    const colClass = typeof col.cellClass === 'function'
      ? col.cellClass(value, row)
      : (col.cellClass ?? '');

    const ext = this.cellClasses[col.key];
    const extClass = ext
      ? (typeof ext === 'function' ? ext(value, row) : ext)
      : '';

    return [colClass, extClass].filter(Boolean).join(' ');
  }

  // ── Avatar ────────────────────────────────────────────────────────────────

  getAvatarBg(col: DataTableColumn, row: any): string {
    if (col.avatarColorKey && row[col.avatarColorKey]) {
      return row[col.avatarColorKey];
    }
    // Deterministic colour from first char of initials
    const str = col.initialsKey ? (row[col.initialsKey] ?? '') : this.getCellValue(row, col) ?? '';
    const code = String(str).charCodeAt(0) || 0;
    return AVATAR_COLORS[code % AVATAR_COLORS.length];
  }

  getInitials(col: DataTableColumn, row: any): string {
    if (col.initialsKey) return String(row[col.initialsKey] ?? '').slice(0, 3).toUpperCase();
    const val = this.getCellValue(row, col);
    return typeof val === 'string' ? val.slice(0, 2).toUpperCase() : '';
  }

  // ── Badge / Chip ──────────────────────────────────────────────────────────

  getBadgeConfig(col: DataTableColumn, row: any): BadgeConfig {
    const value = this.getCellValue(row, col);
    return col.badgeMap?.[value] ?? { bg: '#F9FAFB', border: '#E5E7EB', text: '#6B7280' };
  }

  getChipConfig(col: DataTableColumn, row: any): ChipConfig {
    const value = this.getCellValue(row, col);
    return col.chipMap?.[value] ?? { bg: '#F3F4F6', border: '#E5E7EB', text: '#374151' };
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  isActionVisible(action: TableAction, row: any): boolean {
    return action.visible ? action.visible(row) : true;
  }

  getActionClass(action: TableAction, row: any): string {
    if (!action.class) return '';
    return typeof action.class === 'function' ? action.class(undefined, row) : action.class;
  }

  // ── Event handlers ────────────────────────────────────────────────────────

  onSearch(value: string): void {
    this.searchValue = value;
    this.searchChange.emit(value);
  }

  onFilterClick(filter: TableFilter): void {
    this.filterChange.emit({ key: filter.key, value: filter.value });
  }

  onAction(key: string, row: any, event: Event): void {
    event.stopPropagation();
    this.actionClick.emit({ action: key, row });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }

  prevPage(): void { this.goToPage(this.currentPage - 1); }
  nextPage(): void { this.goToPage(this.currentPage + 1); }

  trackByFn(index: number, row: any): any {
    return this.config?.trackBy ? this.config.trackBy(index, row) : index;
  }

  getFilterIcon(filter: TableFilter): SafeHtml {
    const key = filter.icon ?? 'filter';
    return this.icons[key] ?? this.icons['filter'];
  }
}
