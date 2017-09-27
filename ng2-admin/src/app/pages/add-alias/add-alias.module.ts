import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';

import { AddAliasComponent } from './add-alias.component';
import { routing }       from './add-alias.routing';

import { BasicForm } from './basicForm/basicForm.component';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppTranslationModule,
    NgaModule,
    routing,
    NguiAutoCompleteModule,
    ReactiveFormsModule,
  ],
  declarations: [
    AddAliasComponent,
    BasicForm,
  ],
  providers: [
  ]
})
export class AddAliasModule {}
