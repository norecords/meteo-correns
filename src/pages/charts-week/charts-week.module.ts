import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChartsWeekPage } from './charts-week';
// API:
import { ApiProvider } from '../../providers/api/api' // Import our provider
import { HttpModule } from '@angular/http'; // Import HttpModule

@NgModule({
  declarations: [
    ChartsWeekPage,
  ],
  imports: [
    HttpModule, // Import HttpModule
    IonicPageModule.forChild(ChartsWeekPage),
  ],
  providers: [
    ApiProvider // Import our provider
  ],
})
export class ChartsWeekPageModule {}

