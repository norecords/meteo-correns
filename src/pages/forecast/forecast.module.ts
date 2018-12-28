import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ForecastPage } from './forecast';
// API:
import { ApiProvider } from '../../providers/api/api' // Import our provider
import { HttpModule } from '@angular/http'; // Import HttpModule

@NgModule({
  declarations: [
    ForecastPage,
  ],
  imports: [
    HttpModule, // Import HttpModule
    IonicPageModule.forChild(ForecastPage),
  ],
  providers: [
    ApiProvider // Import our provider
  ],
})
export class ForecastPageModule {}
