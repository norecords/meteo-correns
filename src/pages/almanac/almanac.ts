import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api'; // API provider

@IonicPage()
@Component({
  selector: 'page-almanac',
  templateUrl: 'almanac.html',
})
export class AlmanacPage {

  weather = []; 
  sun = [];
  moon = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, private apiProvider: ApiProvider) {}

  ionViewDidLoad() {

    let loader = this.loadingCtrl.create({
      content: '<h2>Chargement des données</h2>Téléchargement en cours...'
    });

    loader.present()

    setTimeout(() => {
      loader.dismiss();
    }, 20000);

    this.apiProvider.getJsonAlmanach().subscribe(data => { 
      this.weather = data;
      this.sun['startCivilTwilight'] = this.weather['sun']['startCivilTwilight']
      this.sun['sunrise'] = this.weather['sun']['sunrise']
      this.sun['transit'] = this.weather['sun']['transit']
      this.sun['sunset'] = this.weather['sun']['sunset']
      this.sun['endCivilTwilight'] = this.weather['sun']['endCivilTwilight']
      this.sun['azimuth'] = this.weather['sun']['azimuth']
      this.sun['altitude'] = this.weather['sun']['altitude']
      this.sun['rightAscension'] = this.weather['sun']['rightAscension']
      this.sun['declination'] = this.weather['sun']['declination']
      this.sun['equinox'] = this.weather['sun']['equinox']
      this.sun['solstice'] = this.weather['sun']['solstice']

      this.moon['rise'] = this.weather['moon']['rise']
      this.moon['transit'] = this.weather['moon']['transit']
      this.moon['set'] = this.weather['moon']['set']
      this.moon['azimuth'] = this.weather['moon']['azimuth']
      this.moon['altitude'] = this.weather['moon']['altitude']
      this.moon['rightAscension'] = this.weather['moon']['rightAscension']
      this.moon['declination'] = this.weather['moon']['declination']
      this.moon['fullMoon'] = this.weather['moon']['fullMoon']
      this.moon['newMoon'] = this.weather['moon']['newMoon']
      this.moon['phase'] = this.weather['moon']['phase']
      this.moon['fullness'] = this.weather['moon']['fullness']
      loader.dismiss()
    }); // Loading the Data

    console.log('ionViewDidLoad AlmanacPage');
  }

}
