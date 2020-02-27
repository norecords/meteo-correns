import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';
import { SettingsProvider } from "../providers/settings/settings";
import { ApiProvider } from '../providers/api/api';
import * as moment from 'moment';
import 'moment/locale/fr';
import * as HighStock from 'highcharts/highstock';
import { faCompass, faChartLine, faSun, faMeteor, faLifeRing, faAdjust, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

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
      ],
      rangeSelectorZoom: ''
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
  current: string = 'day';
  selectedTheme: String;
  selectedMode: String;
  weather = []; // json array
  header = [];
  public isToggled: boolean = false;
  iconLive = faCompass;
  iconChart = faChartLine;
  iconForecast = faSun;
  iconAlmanac = faMeteor;
  iconAbout = faLifeRing;
  iconDarkmode = faAdjust;
  iconExit = faSignOutAlt;

  rootPage: any = 'HomePage'; //#### LAZY LOADING: LOAD ALL PAGES AS STRING ####

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              public events: Events,
              public network: Network,
              private settings: SettingsProvider,
              private apiProvider: ApiProvider) {
    this.initializeApp();
    this.settings.getActiveTheme().subscribe(val => this.selectedTheme = val);
    this.settings.getActiveMode().subscribe(val => this.selectedMode = val);
  }
  // Check if it's night or day and automaticly change the theme on each view init
  ngAfterViewInit() {
    this.nav.viewDidEnter.subscribe((data) => {
      if (this.selectedMode === 'auto') {
        this.checkSunrise();
        setInterval(() => {
          this.checkSunrise();
          console.log('check Sunrise')
        }, 1000 * 60 * 10); // 10 minutes
        console.log('check Sunrise')
      }
    });
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

checkSunrise() {
  let currDate;
  currDate =  moment.unix(Math.round(new Date().getTime()/1000)).format('HH');
  console.log(currDate)
  this.apiProvider.getJsonSunrise().subscribe(data => { 
    this.weather = data;
      // if between sunrise and sunset
      if (currDate >= this.weather['srh'] // Sunrise hour
       && currDate < this.weather['ssth']) { // Sunset hour
        this.current = 'day'; // set daylight
        if (this.selectedTheme === 'dark-theme') {
          this.autoTheme();
        }
      } else { // this is night time
        this.current = 'night';
        if (this.selectedTheme === 'light-theme') {
          this.autoTheme();
        }
      }
      console.log(this.current + currDate + this.weather['srh'] + this.weather['ssth']);
    });
}

autoTheme() {
  if (this.selectedTheme === 'light-theme') {
    this.settings.setActiveTheme('dark-theme');
    this.isToggled = true;
    this.header['button'] = { 'background-color': 'transparent', 'color': 'white' };
    this.header['backgd'] = { 'background-color': '#333333' };
  } else {
    this.settings.setActiveTheme('light-theme');
    this.isToggled = false;
    this.header['button'] = { 'background-color': 'transparent' };
    this.header['backgd'] = { 'background-color': '#FFFFFF' };
  }
}

  toggleAppTheme() {
    if (this.selectedTheme === 'light-theme') {
      this.settings.setActiveTheme('dark-theme');
      if (this.current === 'day') {
      this.settings.setActiveMode('manual');
      } else {
        this.settings.setActiveMode('auto');
      }
      this.header['button'] = { 'background-color': 'transparent', 'color': 'white' };
      this.header['backgd'] = { 'background-color': '#333333' };
    } else {
      this.settings.setActiveTheme('light-theme');
      if (this.current === 'night') {
      this.settings.setActiveMode('manual');
      } else {
        this.settings.setActiveMode('auto');
      }
      this.header['button'] = { 'background-color': 'transparent' };
      this.header['backgd'] = { 'background-color': '#FFFFFF' };
    }
    console.log(this.selectedMode)
  }

  exitApp() {
    navigator['app'].exitApp();
  }

}