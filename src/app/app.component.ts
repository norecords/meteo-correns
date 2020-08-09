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
  sunriseLoad: any;
  forecastRecTime : number;

  rootPage: any = 'HomePage'; //#### LAZY LOADING: LOAD ALL PAGES AS STRING ####

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              public events: Events,
              public network: Network,
              private settings: SettingsProvider,
              private apiProvider: ApiProvider) {    
   
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.apiProvider.getJsonSunrise().subscribe(data => {
        this.sunriseLoad = data;
        this.checkSunrise();
      });
      this.statusBar.styleDefault();
      this.statusBar.overlaysWebView(true);
      this.statusBar.backgroundColorByHexString('#2d7d9a');
      this.statusBar.show();
      //
      this.apiProvider.getForecast().subscribe(data => { 
        this.settings.updateForecastData(data);
        console.log('Forecast data are in settings')
      });
      //
      this.apiProvider.getJsonAlmanach().subscribe(data => { 
        this.settings.updateAlmanacData(data)
        console.log('Almanac data are in settings')
      });


      this.settings.getActiveTheme().subscribe(val => this.selectedTheme = val);
      this.settings.getActiveMode().subscribe(val => this.selectedMode = val);
      this.settings.getForecastData().subscribe(data => this.forecastRecTime = data['recTime']);

      // interval to check for new content
      setInterval(() => {
        this.checkSunrise();
        //console.log('check Sunrise')
        this.checkNewForecast();
        //console.log('check new Forecast')
      }, 1000 * 60 * 1); // 5 minutes

    });
  
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page);
  }

checkSunrise() {
  let currDate = moment.unix(Math.round(new Date().getTime()/1000)).format('HH');
  //console.log(currDate)
        // if between sunrise and sunset
        if (currDate >= this.sunriseLoad['srh'] // Sunrise hour
         && currDate < this.sunriseLoad['ssth']) { // Sunset hour
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
        console.log('check daylight state')
        //console.log(this.current + ' current hour: ' + currDate + ' sunrise: ' + this.sunriseLoad['srh'] + ' sunset: '+ this.sunriseLoad['ssth']);
}

autoTheme() {
  if (this.selectedTheme === 'light-theme' && this.selectedMode != 'manual') {
    this.settings.setActiveTheme('dark-theme');
    console.log('its night turn to dark theme')
    this.isToggled = true;
    this.header['button'] = { 'background-color': 'transparent', 'color': 'white' };
    this.header['backgd'] = { 'background-color': '#333333' };
    console.log('isToggled ' + this.isToggled)
  } 
  if (this.selectedTheme === 'dark-theme' && this.selectedMode != 'manual'){
    this.settings.setActiveTheme('light-theme');
    console.log('its daylight turn to light theme')
    this.isToggled = false;
    this.header['button'] = { 'background-color': 'transparent' };
    this.header['backgd'] = { 'background-color': '#FFFFFF' };
    console.log('isToggled ' + this.isToggled)
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

  checkNewForecast(){
    let currDate = moment.unix(Math.round(new Date().getTime()/1000)).format('HH');
    let diffDate = moment.unix(this.forecastRecTime).format('HH');
    //console.log('currDate', currDate)
    //console.log('diffDate', diffDate)
    if (currDate != diffDate) { 
      this.apiProvider.getForecast().subscribe(data => { 
        this.settings.updateForecastData(data);
        console.log('its time to get new forecast')
      });
    }
  }

  exitApp() {
    navigator['app'].exitApp();
  }

    // Check if it's night or day and automaticly change the theme on each view init
    ngAfterViewInit() {
      this.nav.viewDidEnter.subscribe((data) => {
       if (this.selectedMode === 'auto' && this.sunriseLoad != null) {
            this.checkSunrise();
        }
      });
      console.log('after view init')
    }

}