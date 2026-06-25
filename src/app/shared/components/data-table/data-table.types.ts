import { TemplateRef } from '@angular/core';

// ---------------------------------------------------------------------------
// Style / class helpers
// ---------------------------------------------------------------------------

export type CellStyle<T = any> =
  | { [prop: string]: string }
  | ((value: any, row: T) => { [prop: string]: string });

export type CellClass<T = any> =
  | string
  | ((value: any, row: T) => string);

// ---------------------------------------------------------------------------
// Badge & Chip
// ---------------------------------------------------------------------------

export interface BadgeConfig {
  bg?: string;
  border?: string;
  text?: string;
}

export type BadgeMap = Record<string, BadgeConfig>;

export interface ChipConfig {
  bg?: string;
  border?: string;
  text?: string;
}

export type ChipMap = Record<string, ChipConfig>;

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

export interface TableAction {
  key: string;
  icon: string;                          // key into the component icons map
  title?: string;
  visible?: (row: any) => boolean;       // conditional visibility
  class?: CellClass;
  style?: CellStyle;
}

// ---------------------------------------------------------------------------
// Filters (toolbar)
// ---------------------------------------------------------------------------

export interface TableFilter {
  key: string;
  label: string;
  icon?: string;                         // icon key: 'filter' | 'calendar' | …
  value?: any;
}

// ---------------------------------------------------------------------------
// Column definition
// ---------------------------------------------------------------------------

export type AvatarShape = 'circle' | 'square';

export type ColumnType =
  | 'text'
  | 'email'
  | 'phone'
  | 'link'
  | 'date'
  | 'badge'
  | 'chip'
  | 'avatar-text'
  | 'contact'
  | 'actions'
  | 'custom';

export interface DataTableColumn<T = any> {
  key: string;
  label: string;
  type?: ColumnType;

  // Layout
  width?: string;
  minWidth?: string;
  align?: 'left' | 'center' | 'right';
  hidden?: boolean;

  // Per-cell style / class overrides (defined in the column config)
  cellStyle?: CellStyle<T>;
  cellClass?: CellClass<T>;
  headerStyle?: { [prop: string]: string };
  headerClass?: string;

  // --- avatar-text options ---
  initialsKey?: string;      // row key holding the initials string
  avatarColorKey?: string;   // row key holding the avatar bg colour
  avatarShape?: AvatarShape; // 'circle' (default) | 'square'
  subtextKey?: string;       // optional second line below the main text

  // --- badge options ---
  badgeMap?: BadgeMap;

  // --- chip options ---
  chipMap?: ChipMap;

  // --- contact options (name + email stacked) ---
  contactNameKey?: string;
  contactEmailKey?: string;

  // --- custom template ---
  template?: TemplateRef<{ $implicit: T; value: any }>;

  // --- actions ---
  actions?: TableAction[];
}

// ---------------------------------------------------------------------------
// Top-level config
// ---------------------------------------------------------------------------

export interface DataTableConfig<T = any> {
  columns: DataTableColumn<T>[];

  // ── Toolbar toggles ──────────────────────────────────────────────────────
  showSearch?: boolean;           // default true
  searchPlaceholder?: string;

  showFilters?: boolean;          // default true
  filters?: TableFilter[];

  showSortLabel?: boolean;        // default false
  sortLabel?: string;             // e.g. 'Sorted by latest'

  showExportBtn?: boolean;        // default false
  exportBtnLabel?: string;        // default 'Export'

  showCreateBtn?: boolean;        // default false
  createBtnLabel?: string;        // e.g. '+ Create New FI'

  // ── Table ────────────────────────────────────────────────────────────────
  emptyMessage?: string;
  trackBy?: (index: number, row: T) => any;

  // ── Footer toggles ───────────────────────────────────────────────────────
  showFooterCount?: boolean;      // default true
  showPagination?: boolean;       // default true
  pageSize?: number;              // default 10
}
