import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';
import {SettingsProvider} from "../providers/settings/settings";
import * as HighStock from 'highcharts/highstock';

HighStock.setOptions({
  lang: {
    months: [
        'Janvier', 'Février', 'Mars', 'Avril',
        'Mai', 'Juin', 'Juillet', 'Août',
        'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ],
    weekdays: [
        'Dimanche', 'Lundi', 'Mardi', 'Mercredi',
        'Jeudi', 'Vendredi', 'Samedi'
    ],
    shortMonths : [
      "Jan", "Fev", "Mar", "Avr", "Mai", "Juin", "Juil", "Août",
       "Sep", "Oct", "Nov", "Dec"
      ]
  },
  time: {
    useUTC: false
}
});

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  selectedTheme: String;

  rootPage: any = 'HomePage'; //#### LAZY LOADING: LOAD ALL PAGES AS STRING ####

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public events: Events, public network: Network, private settings: SettingsProvider,) {
    this.initializeApp();
    this.settings.getActiveTheme().subscribe(val => this.selectedTheme = val);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.statusBar.overlaysWebView(true);
      this.statusBar.backgroundColorByHexString('#2d7d9a');
      this.statusBar.show();
    });
  }
  


  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page);
  }

  toggleAppTheme() {
    if (this.selectedTheme === 'light-theme') {
      this.settings.setActiveTheme('dark-theme');
    } else {
      this.settings.setActiveTheme('light-theme');
    }
  }

}

