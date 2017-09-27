import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';

import { Aliases } from './aliases.component';
import { routing } from './aliases.routing';

import { ResponsiveTable } from './responsiveTable/index';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppTranslationModule,
    NgaModule,
    routing,
  ],
  declarations: [
    Aliases,
    ResponsiveTable,
  ],
  providers: []
})
export class AliasesModule {}
