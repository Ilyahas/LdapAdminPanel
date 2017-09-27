import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';

import { EditHiddenUserComponent } from './edit-hidden-user.component';
import { routing }       from './edit-hidden-user.routing';

import { BasicForm } from './basicForm/basicForm.component'


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppTranslationModule,
    NgaModule,
    routing
  ],
  declarations: [
    EditHiddenUserComponent,
    BasicForm
  ],
  providers: [
  ]
})
export class EditHiddenUserModule {}
