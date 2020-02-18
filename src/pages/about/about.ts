import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController} from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {

  weather = [];
  loading: any;

  constructor(public navCtrl: NavController,
             public navParams: NavParams,
             public loadingCtrl: LoadingController,
             private apiProvider: ApiProvider) {}

  ionViewDidLoad() {
    let loader = this.loadingCtrl.create({
      content: '<h2>Chargement des données</h2>Téléchargement en cours...',
      duration : 20000,
      cssClass: 'custom-loader-class'
    });
    loader.present()

    this.apiProvider.getJsonAbout().subscribe(data => { 
      this.weather = data 
      setTimeout(() => {
        loader.dismiss();
      }, 500);  
    });
    console.log('ionViewDidLoad AboutPage');
  }

}
