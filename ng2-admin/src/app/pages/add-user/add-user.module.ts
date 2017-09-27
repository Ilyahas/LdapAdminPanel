import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';

import { AddUserComponent } from './add-user.component';
import { routing }       from './add-user.routing';

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
    AddUserComponent,
    BasicForm
  ],
  providers: [
  ]
})
export class AddUserModule {}
