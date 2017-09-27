import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';

import { EditUserComponent } from './edit-user.component';
import { routing }       from './edit-user.routing';

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
    EditUserComponent,
    BasicForm
  ],
  providers: [
  ]
})
export class EditUserModule {}
