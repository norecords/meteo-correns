import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
// API:
import { ApiProvider } from '../../providers/api/api' // Import our provider
import { HttpModule } from '@angular/http'; // Import HttpModule
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    HomePage,
  ],
  imports: [
    HttpModule, // Import HttpModule,
    FontAwesomeModule,
    IonicPageModule.forChild(HomePage),
  ],
  providers: [
    ApiProvider // Import our provider
  ],
})
export class HomePageModule {}
