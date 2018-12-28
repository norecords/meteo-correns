import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChartsPage } from './charts';
// API:
import { ApiProvider } from '../../providers/api/api' // Import our provider
import { HttpModule } from '@angular/http'; // Import HttpModule

@NgModule({
  declarations: [
    ChartsPage,
  ],
  imports: [
    HttpModule, // Import HttpModule
    IonicPageModule.forChild(ChartsPage),
  ],
  providers: [
    ApiProvider // Import our provider
  ],
})
export class ChartsPageModule {}

