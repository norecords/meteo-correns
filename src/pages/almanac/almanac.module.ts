import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AlmanacPage } from './almanac';
// API:
import { ApiProvider } from '../../providers/api/api' // Import our provider
import { HttpModule } from '@angular/http'; // Import HttpModule

@NgModule({
  declarations: [
    AlmanacPage,
  ],
  imports: [
    HttpModule, // Import HttpModule
    IonicPageModule.forChild(AlmanacPage),
  ],
  providers: [
    ApiProvider // Import our provider
  ],
})
export class AlmanacPageModule {}
