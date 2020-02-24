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
  almanac = [];
  current: string;
  selectedTheme: String;
  selectedMode: String;
  iconLive = faCompass;
  iconChart = faChartLine;
  iconForecast = faSun;
  iconAlmanac = faMeteor;
  iconAbout = faLifeRing;
  iconDarkmode = faAdjust;
  iconExit = faSignOutAlt;
  weather = []; // json array
  header = []
  public isToggled: boolean;

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
    this.isToggled = false;
  }

  ngAfterViewInit() {
    this.nav.viewDidEnter.subscribe((data) => {
      if (this.selectedMode === 'auto') {
        this.checkSunrise();
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
    //this.almanac['datetime'] = moment.unix(this.weather['current']['datetime_raw']).format('HH');
    this.almanac['sunrise'] = this.weather['almanac']['sunrise_hour'];
    this.almanac['sunset'] = this.weather['almanac']['sunset_hour'];
  
      if (currDate >= this.almanac['sunrise']
       && currDate < this.almanac['sunset']) { 
         this.current = 'day';
        if (this.selectedTheme === 'dark-theme') {
          this.autoTheme()
          this.current = 'day' 
        }
      } else {
        if (this.selectedTheme === 'light-theme') {
          this.autoTheme()
          this.current = 'night'
        }
      }
      console.log(this.current + currDate + this.almanac['sunrise'] + this.almanac['sunset'])
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
      console.log(this.selectedMode)
    } else {
      this.settings.setActiveTheme('light-theme');
      if (this.current === 'night') {
      this.settings.setActiveMode('manual');
      } else {
        this.settings.setActiveMode('auto');
      }
      this.header['button'] = { 'background-color': 'transparent' };
      this.header['backgd'] = { 'background-color': '#FFFFFF' };
      console.log(this.selectedMode)
    }

  }

  exitApp() {
    navigator['app'].exitApp()
  }

}