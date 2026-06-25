import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { DataTableComponent } from './components/data-table/data-table.component';

@NgModule({
  declarations: [
    DataTableComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
  ],
  exports: [
    CommonModule,
    RouterOutlet,
    DataTableComponent,
  ],
})
export class SharedModule {}
