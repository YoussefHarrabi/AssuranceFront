import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatetimeDisplayComponent } from './components/datetime-display/datetime-display.component';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { NewlinePipe } from './pipes/newline.pipe';



@NgModule({
  declarations: [
    NewlinePipe,
    DatetimeDisplayComponent,
    UserInfoComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    NewlinePipe,
    DatetimeDisplayComponent,
    UserInfoComponent
  ]
})
export class SharedModule { }