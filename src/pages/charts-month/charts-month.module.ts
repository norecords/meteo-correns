import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChartsMonthPage } from './charts-month';
// API:
import { ApiProvider } from '../../providers/api/api' // Import our provider
import { HttpModule } from '@angular/http'; // Import HttpModule

@NgModule({
  declarations: [
    ChartsMonthPage,
  ],
  imports: [
    HttpModule, // Import HttpModule
    IonicPageModule.forChild(ChartsMonthPage),
  ],
  providers: [
    ApiProvider // Import our provider
  ],
})
export class ChartsMonthPageModule {}
