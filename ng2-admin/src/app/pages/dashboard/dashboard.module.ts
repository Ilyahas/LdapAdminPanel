import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';

import { Dashboard } from './dashboard.component';
import { routing } from './dashboard.routing';

import { ResponsiveTable } from './responsiveTable/index';
import { ResponsiveTableHidden } from './responsiveTableHidden/index';
import { ResponsiveTableDeleted } from './responsiveTableDeleted/index';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppTranslationModule,
    NgaModule,
    routing,
  ],
  declarations: [
    Dashboard,
    ResponsiveTable,
    ResponsiveTableHidden,
    ResponsiveTableDeleted,
  ],
  providers: []
})
export class DashboardModule {}
