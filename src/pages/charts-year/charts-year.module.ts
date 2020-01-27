import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChartsYearPage } from './charts-year';
// API:
import { ApiProvider } from '../../providers/api/api' // Import our provider
import { HttpModule } from '@angular/http'; // Import HttpModule

@NgModule({
  declarations: [
    ChartsYearPage,
  ],
  imports: [
    HttpModule, // Import HttpModule
    IonicPageModule.forChild(ChartsYearPage),
  ],
  providers: [
    ApiProvider // Import our provider
  ],
})
export class ChartsYearPageModule {}