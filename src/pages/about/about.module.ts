import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AboutPage } from './about';
// API:
import { ApiProvider } from '../../providers/api/api' // Import our provider
import { HttpModule } from '@angular/http'; // Import HttpModule

@NgModule({
  declarations: [
    AboutPage,
  ],
  imports: [
    HttpModule, // Import HttpModule
    IonicPageModule.forChild(AboutPage),
  ],
  providers: [
    ApiProvider // Import our provider
  ],
})
export class AboutPageModule {}
