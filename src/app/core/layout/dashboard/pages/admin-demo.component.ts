import { Component, TemplateRef, ViewChild } from '@angular/core';
import { DataTableConfig, DataTableColumn, TableAction } from '../../../../shared/components/data-table/data-table.types';
import { CellStyle } from '../../../../shared/components/data-table/data-table.types';

// ─── Admin Users table (mirrors table1/table2 images) ─────────────────────────

const ADMIN_ACTIONS: TableAction[] = [
  { key: 'edit',    icon: 'edit',    title: 'Edit' },
  {
    key:     'delete',
    icon:    'delete',
    title:   'Remove',
    visible: (row: any) => row.status !== 'Deactivated',
    class:   'dt-action-btn--danger',
  },
  {
    key:     'restore',
    icon:    'restore',
    title:   'Restore',
    visible: (row: any) => row.status === 'Deactivated',
  },
];

const BADGE_MAP = {
  Active:       { bg: '#F0FDF4', border: '#BBF7D0', text: '#16A34A' },
  Deactivated:  { bg: '#F9FAFB', border: '#E5E7EB', text: '#6B7280' },
  New:          { bg: '#FFF7ED', border: '#FED7AA', text: '#EA580C' },
};

// ─── FI Accounts table (mirrors table3 image) ──────────────────────────────────

const FI_ACTIONS: TableAction[] = [
  { key: 'pin',    icon: 'pin',    title: 'Pin' },
  { key: 'file',   icon: 'file',   title: 'View document' },
  { key: 'edit',   icon: 'edit',   title: 'Edit' },
  { key: 'delete', icon: 'delete', title: 'Remove', class: 'dt-action-btn--danger' },
];

const FI_CHIP_MAP = {
  Bank:      { bg: '#F3F4F6', border: '#E5E7EB', text: '#374151' },
  'Non-Bank':{ bg: '#F3F4F6', border: '#E5E7EB', text: '#374151' },
};

@Component({
  selector: 'app-admin-demo',
  template: `
    <div style="padding: 28px; background: #F8FAFC; min-height: 100%;">

      <!-- ════════════════════════════════════════════════════════
           EXAMPLE 1 — Admin Users  (tables 1 & 2)
      ═══════════════════════════════════════════════════════════ -->
      <section>
<!--        <h2 class="demo-heading">Admin Users</h2>-->

        <app-data-table
          [config]="adminConfig"
          [data]="adminData"
          [totalItems]="adminData.length"
          [currentPage]="adminPage"
          [cellStyles]="adminCellStyles"
          (searchChange)="onSearch('admin', $event)"
          (filterChange)="onFilter('admin', $event)"
          (actionClick)="onAction($event)"
          (pageChange)="adminPage = $event">
        </app-data-table>
      </section>

      <!-- ════════════════════════════════════════════════════════
           EXAMPLE 2 — FI Accounts  (table 3)
      ═══════════════════════════════════════════════════════════ -->
      <section style="margin-top: 32px;">
        <app-data-table
          [config]="fiConfig"
          [data]="fiData"
          [totalItems]="fiData.length"
          [currentPage]="fiPage"
          (searchChange)="onSearch('fi', $event)"
          (filterChange)="onFilter('fi', $event)"
          (actionClick)="onAction($event)"
          (exportClick)="onExport()"
          (createClick)="onCreate()"
          (pageChange)="fiPage = $event">

        </app-data-table>
      </section>

    </div>
  `,
  styles: [`
    .demo-card {
      background: #fff;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0,0,0,.07);
    }
    .demo-heading {
      font-size: 15px;
      font-weight: 600;
      color: #111827;
      margin: 0 0 20px;
    }
  `],
})
export class AdminDemoComponent {

  // ─── Admin Users ───────────────────────────────────────────────────────────

  adminPage = 1;

  adminConfig: DataTableConfig = {
    // Toolbar
    showSearch:    true,
    searchPlaceholder: 'Search by name, email, mobile…',
    showFilters:   true,
    filters: [
      { key: 'status',     label: 'Status',     icon: 'filter'   },
      { key: 'dateRange',  label: 'Date range',  icon: 'calendar' },
    ],
    showSortLabel: true,
    sortLabel:     'Sorted by latest',
    showExportBtn: false,
    showCreateBtn: false,

    // Footer
    showFooterCount: true,
    showPagination:  true,
    pageSize: 10,

    // Columns
    columns: [
      {
        key:         'firstName',
        label:       'First Name',
        type:        'avatar-text',
        initialsKey: 'initials',          // row.initials → avatar letters
        avatarColorKey: 'avatarBg',       // row.avatarBg → circle colour
        avatarShape: 'circle',
        minWidth:    '140px',
      },
      {
        key:      'lastName',
        label:    'Last Name',
        type:     'text',
        minWidth: '120px',
        // Example: mute text for deactivated rows
        cellStyle: (_val: any, row: any): { [k: string]: string } =>
          row.status === 'Deactivated' ? { color: '#9CA3AF' } : {},
      },
      {
        key:      'email',
        label:    'Email',
        type:     'email',
        minWidth: '200px',
      },
      {
        key:      'mobile',
        label:    'Mobile',
        type:     'phone',
        minWidth: '150px',
      },
      {
        key:      'createdBy',
        label:    'Created By',
        type:     'link',
        minWidth: '120px',
      },
      {
        key:      'createdDate',
        label:    'Created Date',
        type:     'date',
        minWidth: '120px',
      },
      {
        key:      'status',
        label:    'Status',
        type:     'badge',
        badgeMap: BADGE_MAP,
        minWidth: '110px',
      },
      {
        key:     'actions',
        label:   'Actions',
        type:    'actions',
        align:   'right',
        width:   '100px',
        actions: ADMIN_ACTIONS,
      },
    ],
  };

  adminData = [
    { initials:'YM', avatarBg:'#16A34A', firstName:'Yaa',     lastName:'Mensimah', email:'y.mensimah@elevate.gh', mobile:'+233 24 821 4612', createdBy:'Kwesi Asare', createdDate:'08 May 2026', status:'Active'       },
    { initials:'NB', avatarBg:'#22C55E', firstName:'Nana Akua',lastName:'Boateng',  email:'n.boateng@elevate.gh',  mobile:'+233 24 712 9088', createdBy:'Kwesi Asare', createdDate:'04 May 2026', status:'Active'       },
    { initials:'KO', avatarBg:'#16A34A', firstName:'Kwabena',  lastName:'Owusu',    email:'k.owusu@elevate.gh',    mobile:'+233 50 113 2845', createdBy:'Kwesi Asare', createdDate:'18 Apr 2026', status:'Active'       },
    { initials:'AS', avatarBg:'#22C55E', firstName:'Akosua',   lastName:'Sarpong',  email:'a.sarpong@elevate.gh',  mobile:'+233 27 902 1175', createdBy:'Kwesi Asare', createdDate:'02 Apr 2026', status:'Active'       },
    { initials:'KA', avatarBg:'#15803D', firstName:'Kofi',     lastName:'Anane',    email:'k.anane@elevate.gh',    mobile:'+233 55 671 4220', createdBy:'Kwesi Asare', createdDate:'12 Mar 2026', status:'Deactivated'  },
    { initials:'AP', avatarBg:'#22C55E', firstName:'Ama',      lastName:'Pokuaa',   email:'a.pokuaa@elevate.gh',   mobile:'+233 24 588 0099', createdBy:'Kwesi Asare', createdDate:'28 Feb 2026', status:'Active'       },
    { initials:'JA', avatarBg:'#16A34A', firstName:'Joseph',   lastName:'Addo',     email:'j.addo@elevate.gh',     mobile:'+233 24 477 1290', createdBy:'Kwesi Asare', createdDate:'18 May 2026', status:'New'          },
  ];

  /**
   * External cell-style overrides — applied ON TOP of anything the column
   * config already specifies.  The programmer injects these from the parent.
   */
  adminCellStyles: { [k: string]: CellStyle } = {
    // Make "New" status rows' email column italic  ← external override from parent
    email: (_val: any, row: any): { [k: string]: string } =>
      row.status === 'New' ? { fontStyle: 'italic' } : {},
  };

  // ─── FI Accounts ───────────────────────────────────────────────────────────

  fiPage = 1;

  fiConfig: DataTableConfig = {
    showSearch:    true,
    searchPlaceholder: 'Search FI name, code, contact…',
    showFilters:   true,
    filters: [
      { key: 'fiType', label: 'FI type', icon: 'filter' },
      { key: 'status', label: 'Status',  icon: 'filter' },
    ],
    showSortLabel: true,
    showExportBtn: true,
    exportBtnLabel: 'Export',
    showCreateBtn: true,
    createBtnLabel: '+ Create New FI',

    showFooterCount: true,
    showPagination:  true,
    pageSize: 10,

    columns: [
      {
        key:            'name',
        label:          'FI Name',
        type:           'avatar-text',
        initialsKey:    'code3',          // 3-letter abbreviation
        avatarColorKey: 'avatarBg',
        avatarShape:    'square',
        minWidth:       '180px',
      },
      {
        key:      'short',
        label:    'Short',
        type:     'text',
        minWidth: '70px',
        cellStyle: { color: '#9CA3AF' },  // static muted style
      },
      {
        key:      'code',
        label:    'Code',
        type:     'text',
        minWidth: '100px',
        cellStyle: { fontWeight: '600' },
      },
      {
        key:      'type',
        label:    'Type',
        type:     'chip',
        chipMap:  FI_CHIP_MAP,
        minWidth: '90px',
      },
      {
        key:             'contact',
        label:           'Contact',
        type:            'contact',
        contactNameKey:  'contactName',
        contactEmailKey: 'contactEmail',
        minWidth:        '200px',
      },
      {
        key:      'createdDate',
        label:    'Created Date',
        type:     'date',
        minWidth: '120px',
      },
      {
        key:      'status',
        label:    'Status',
        type:     'badge',
        badgeMap: BADGE_MAP,
        minWidth: '100px',
      },
      {
        key:     'actions',
        label:   'Actions',
        type:    'actions',
        align:   'right',
        width:   '130px',
        actions: FI_ACTIONS,
      },
    ],
  };

  fiData = [
    { code3:'STB', avatarBg:'#1D4ED8', name:'Stanbic Bank Ghana',    short:'STB', code:'B-STB-001', type:'Bank',     contactName:'Charles Twum-Boateng', contactEmail:'c.twum@stanbicbank.com.gh', createdDate:'14 Jan 2024', status:'Active' },
    { code3:'GCB', avatarBg:'#2563EB', name:'GCB Bank',              short:'GCB', code:'B-GCB-001', type:'Bank',     contactName:'Naa Adoma Quartey',    contactEmail:'n.quartey@gcb.com.gh',      createdDate:'22 Feb 2024', status:'Active' },
    { code3:'ECO', avatarBg:'#0891B2', name:'Ecobank Ghana',         short:'ECO', code:'B-ECO-001', type:'Bank',     contactName:'Kojo Asante',          contactEmail:'kasante@ecobank.com',       createdDate:'08 Mar 2024', status:'Active' },
    { code3:'FID', avatarBg:'#2563EB', name:'Fidelity Bank',         short:'FID', code:'B-FID-001', type:'Bank',     contactName:'Adwoa Acheampong',     contactEmail:'a.acheampong@fidelitybank.com.gh', createdDate:'15 Apr 2024', status:'Active' },
    { code3:'ABS', avatarBg:'#1D4ED8', name:'Absa Bank Ghana',       short:'ABS', code:'B-ABS-001', type:'Bank',     contactName:'Eric Larbi',           contactEmail:'e.larbi@absa.africa',       createdDate:'02 Jun 2024', status:'Active' },
    { code3:'AKW', avatarBg:'#92400E', name:'Atwima Kwanwoma RCB',   short:'AKW', code:'N-AKW-001', type:'Non-Bank', contactName:'Ato Boateng',          contactEmail:'a.boateng@akrcb.com.gh',    createdDate:'18 Aug 2024', status:'Active' },
    { code3:'AKR', avatarBg:'#78350F', name:'Akuapem RCB',           short:'AKR', code:'N-AKR-001', type:'Non-Bank', contactName:'Yaa Akuffo',           contactEmail:'y.akuffo@akuapemrcb.com.gh',createdDate:'04 Oct 2024', status:'Active' },
    { code3:'RPB', avatarBg:'#7C3AED', name:'Republic Bank',         short:'RPB', code:'B-RPB-001', type:'Bank',     contactName:'Yaa Aboagye',          contactEmail:'y.aboagye@republicghana.com',createdDate:'20 May 2026', status:'New'    },
  ];

  // ─── Handlers ──────────────────────────────────────────────────────────────

  onSearch(table: string, value: string) {
    console.log(`[${table}] search →`, value);
  }

  onFilter(table: string, event: any) {
    console.log(`[${table}] filter →`, event);
  }

  onAction(event: { action: string; row: any }) {
    console.log('action →', event.action, event.row);
  }

  onExport() { console.log('export clicked'); }
  onCreate() { console.log('create clicked'); }
}
