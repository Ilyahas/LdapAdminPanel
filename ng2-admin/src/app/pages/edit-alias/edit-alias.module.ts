import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';

import { EditAliasComponent } from './edit-alias.component';
import { routing }       from './edit-alias.routing';

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
    EditAliasComponent,
    BasicForm,
  ],
  providers: [
  ]
})
export class EditAliasModule {}
