import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { SettingsProvider } from '../../providers/settings/settings';

@IonicPage()
@Component({
  selector: 'page-almanac',
  templateUrl: 'almanac.html',
})
export class AlmanacPage {

  @ViewChild(Content) content: Content;

  scrollToTop() {
    this.content.scrollToTop();
  }

  weather = []; 
  sun = [];
  moon = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private settings: SettingsProvider
              ) {}

  ionViewDidLoad() {
     this.settings.getAlmanacData().subscribe(data => {
       this.weather = data; });
    

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

    console.log('ionViewDidLoad AlmanacPage');
  }

}
