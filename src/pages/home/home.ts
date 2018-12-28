import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})

export class HomePage {
  weather = []; /* declare live as array */
  loading: any;
  symbol: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, private apiProvider: ApiProvider) { }

  load(refresher) {
    setTimeout(() => {
      // console.log('Async operation has ended');
      refresher.complete();
    }, 20000);
    this.apiProvider.getLive().subscribe(data => { 
      this.weather = data 
      refresher.complete()
    });

  }

  ionViewDidLoad() {
    let loader = this.loadingCtrl.create({
      content: '<h2>Chargement des données</h2>Téléchargement en cours...'
    });

    loader.present()

    setTimeout(() => {
      loader.dismiss();
    }, 20000);

    this.apiProvider.getLive().subscribe(data => { 
      this.weather = data 
      this.symbol = '<img class="yricon" src="assets/imgs/yr/' + this.weather['icon'] + '.png">'
      loader.dismiss()
    });

    console.log('ionViewDidLoad HomePage');
  }

}
