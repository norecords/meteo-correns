import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Title } from '@angular/platform-browser';

/**
 * Generated class for the AboutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {

  constructor(private _title: Title, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidEnter() {
    this._title.setTitle('À propos ... - Météo Correns');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutPage');
  }

}
