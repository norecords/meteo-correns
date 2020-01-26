import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs/Subscription'
import * as moment from 'moment';
import 'moment/locale/fr';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})

export class HomePage {
  showOnline: boolean = false;
  showOffline: boolean = true;
  connectStatus : string = "Connection en cours...";
  loop = [];
  dateTime : any;
  outTemp_C : string;
  outTempColor: string;
  appTemp_C : string;
  windSpeed_kph : string;
  windDir : string;
  windGust_kph  : string;
  barometer_mbar : string;
  cloudbase_meter : string;
  dewpoint_C : string;
  outHumidity : string;
  dayRain_cm : string;
  rainRate_cm_per_hour : string;
  UV: string;
  symbol: string ;
  weather = [];
  loading: any;
  summary: string;
  windCompass: string;
  windArrow: string;
  visibility: string;
  cloudbase: string;
  dayOutTempMax: string;
  dayOutTempMin: string;
  dayWindAvg: string;
  dayWindMax: string;
  dayRainSum: string;
  dayRainRateMax: string;
  monthRainRateMax: string;
  monthOutTempMax: string;
  monthOutTempMin: string;
  monthWindAvg: string;
  monthWindMax: string;
  monthRainSum: string;
  dateToday: string;
  dateMonth: string;

  private subs : Subscription;   // MQTT sub

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, private apiProvider: ApiProvider, private mqttService: MqttService) { 

    this.mqttService.onConnect.subscribe((e) => {
      console.log('onConnect', e);
      if(e['cmd'] == 'connack') {
        this.connectStatus = "Connecté. En attente de données...";
        this.showOffline = false;
        this.showOnline = false;
        console.log('MQTT Connected');
      }
    });
    this.mqttService.onError.subscribe((e) => {
        console.log('onError', e);
        this.connectStatus = "Erreur de connection..."
        this.showOffline = true;
        this.showOnline = false;
    });
    this.mqttService.onClose.subscribe(() => {
        console.log('onClose');
        this.connectStatus = "Connection fermée."
        this.showOffline = true;
        this.showOnline = false;
    });
    this.mqttService.onReconnect.subscribe(() => {
        console.log('onReconnect');
        this.connectStatus = "Nouvelle tentative de connection."
        this.showOffline = false;
        this.showOnline = false;
    });

  } // end of constructor
  
  // Transform mqtt value windDir degree in cardinal point
  private wind_cardinals(deg) {
    var directions = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSO','SO','OSO','O','ONO','NO','NNO','N2']
    var cardinal = directions[Math.round(deg / 22.5)];
    if (cardinal == 'N2') cardinal = 'N';
    return cardinal;
  }

  // Replace unit . by ,
  private replace_point(str) {
    var re = '.'; 
    var newstr = str.replace(re, ','); 
    return newstr;
  }

  // Capitalize moment first letter
  private capitalizeFirstLetter(str) {
    var newstr = str.substring(0, 1).toUpperCase() + str.substring(1);
    return newstr;
  }

  // colorize outTemp class span
  private temp_colorize(temp) {
    if ( temp <= 0 ) {
        var color = "#1278c8";
    } else if ( temp <= -3.8 ) {
      color = "#30bfef";
    } else if ( temp <= 0 ) {
      color = "#1fafdd";
    } else if ( temp <= 4.4 ) {
      color = "rgba(0,172,223,1)";
    } else if ( temp <= 10 ) {
      color = "#71bc3c";
    } else if ( temp <= 12.7 ) {
      color = "rgba(90,179,41,0.8)";
    } else if ( temp <= 18.3 ) {
      color = "rgba(131,173,45,1)";
    } else if ( temp <= 21.1 ) {
      color = "rgba(206,184,98,1)";
    } else if ( temp <= 23.8 ) {
      color = "rgba(255,174,0,0.9)";
    } else if ( temp <= 26.6 ) {
      color = "rgba(255,153,0,0.9)";
    } else if ( temp <= 29.4 ) {
      color = "rgba(255,127,0,1)";
    } else if ( temp <= 32.2 ) {
      color = "rgba(255,79,0,0.9)";
    } else if ( temp <= 35 ) {
      color = "rgba(255,69,69,1)";
    } else if ( temp <= 43.3 ) {
      color = "rgba(255,104,104,1)";
    } else if ( temp >= 43.4 ) {
      color = "rgba(218,113,113,1)";
    }
    return color;
  }

  // load main Json
  private loadJson() {
    let loader = this.loadingCtrl.create({
      content: '<h2>Chargement des données</h2>Téléchargement en cours...'
    });

    loader.present()
    // timeout if loading json file failed or too long to load..
    setTimeout(() => {
      loader.dismiss();
    }, 20000);

    this.apiProvider.getLive().subscribe(data => { 
      this.weather = data;
      this.symbol = '<img src="assets/imgs/darksky/' + this.weather['current']['icon'] + '.png">';
      this.summary = this.weather['current']['summary'];
      var dateRaw = this.weather['current']['datetime_raw'];
      this.dateTime = moment.unix(dateRaw).format('dddd Do MMMM YYYY LTS');
      this.dateToday = this.capitalizeFirstLetter(moment.unix(dateRaw).format('dddd Do MMMM YYYY'));
      this.dateMonth = this.capitalizeFirstLetter(moment.unix(dateRaw).format('MMMM YYYY'));
      this.outTemp_C = this.weather['current']['outTemp_formatted'] + "<sup class='outtempunitlabelsuper'>°C</sup>";
      this.outTempColor = this.temp_colorize(parseFloat(this.weather['current']['outTemp_formatted']));
      this.appTemp_C = 'Ressenti: ' + this.weather['current']['appTemp'];
      this.windSpeed_kph = this.weather['current']['windSpeed'];
      this.windCompass = this.weather['current']['windCompass'];
      this.windDir = this.weather['current']['windDir'];
      this.windArrow =  "rotate(" + this.weather['current']['winddir_formatted'] + 'deg)';
      this.windGust_kph  = this.weather['current']['windGust'];
      this.barometer_mbar = this.weather['current']['barometer'];
      this.dewpoint_C = this.weather['current']['dewpoint'];
      this.outHumidity = this.weather['current']['outHumidity'];
      this.dayRain_cm = this.weather['current']['rain'];
      this.rainRate_cm_per_hour = this.weather['current']['rainRate'];
      this.UV = this.weather['current']['uv'];
      this.visibility = this.weather['current']['visibility'];
      this.cloudbase = this.weather['current']['cloudbase'];
      this.dayOutTempMax = this.weather['day']['outTempMax'];
      this.dayOutTempMin = this.weather['day']['outTempMin'];
      this.dayWindAvg = this.weather['day']['windAvg'];
      this.dayWindMax = this.weather['day']['windMax'];
      this.dayRainSum = this.weather['day']['rainSum'];
      this.dayRainRateMax = this.weather['day']['rainRateMax'];
      this.monthOutTempMax = this.weather['month']['outTempMax'];
      this.monthOutTempMin = this.weather['month']['outTempMin'];
      this.monthWindAvg = this.weather['month']['windAvg'];
      this.monthWindMax = this.weather['month']['windMax'];
      this.monthRainSum = this.weather['month']['rainSum'];
      this.monthRainRateMax = this.weather['month']['rainRateMax'];

      // Dismiss loader
      if (this.weather['current']['datetime_raw'] =! null) loader.dismiss();
    });   
  }

  // Reload summaries every 5 minutes
  private reloadJson() {
    setInterval(() => {
      this.apiProvider.getLive().subscribe(data => { 
        this.weather = data;
        if (this.weather['current']['datetime_raw'] =! null) {
          this.symbol = '<img src="assets/imgs/darksky/' + this.weather['current']['icon'] + '.png">';
          this.summary = this.weather['current']['summary'];
          this.dayOutTempMax = this.weather['day']['outTempMax'];
          this.dayOutTempMin = this.weather['day']['outTempMin'];
          this.dayWindAvg = this.weather['day']['windAvg'];
          this.dayWindMax = this.weather['day']['windMax'];
          this.dayRainSum = this.weather['day']['rainSum'];
          this.dayRainRateMax = this.weather['day']['rainRateMax'];
          this.monthOutTempMax = this.weather['month']['outTempMax'];
          this.monthOutTempMin = this.weather['month']['outTempMin'];
          this.monthWindAvg = this.weather['month']['windAvg'];
          this.monthWindMax = this.weather['month']['windMax'];
          this.monthRainSum = this.weather['month']['rainSum'];
          this.monthRainRateMax = this.weather['month']['rainRateMax'];
          console.log('summaries and symbol updated');
        }
      });
    }, 300000); // 5 minutes
  }

  // Refresher function
  load(refresher) {
    setTimeout(() => {
      refresher.complete();
    }, 20000);
    // load Json function
    this.loadJson();
      
    refresher.complete();
    console.log("Json refresh completed")
  }

  ionViewDidLoad() {
    // load Json function
    this.loadJson();

    // reload Json function
      this.reloadJson();

    // Parse weewx mqtt loop
    this.subs = this.mqttService.observe('weather/correns/live/loop').subscribe(
    (loop : IMqttMessage) => {
      this.loop = JSON.parse(loop.payload.toString());
      // Transform unix epoch dateTime in date format using moment
      if(this.loop['dateTime'] != null) {
        this.dateTime = parseFloat(this.loop['dateTime']).toFixed(0);
        this.dateTime = moment.unix(this.dateTime).format('dddd Do MMMM YYYY LTS');
        this.connectStatus = "Réception de données";
        this.showOffline = false;
        this.showOnline = true;
      }
      // Verifying if data exist to prevent loading blank value in html. 
      // parseFloat data received from MQTT, round it and put unit
      if(this.loop['outTemp_C'] != null) {
        this.outTemp_C = this.replace_point(parseFloat(this.loop['outTemp_C']).toFixed(1)) + "<sup class='outtempunitlabelsuper'>°C</sup>";
      }  
      if(this.loop['appTemp_C'] != null) {
        this.appTemp_C = 'Ressenti: ' + this.replace_point(parseFloat(this.loop['appTemp_C']).toFixed(1)) + " °C";
      }
      if(this.loop['windSpeed_kph'] != null) {
        this.windSpeed_kph = parseFloat(this.loop['windSpeed_kph']).toFixed(0) + " km/h";
      }
      if(this.loop['windDir'] != null) {
        this.windDir = parseFloat(this.loop['windDir']).toFixed(0) + " °";
        this.windArrow =  "rotate(" + parseFloat(this.loop['windDir']) + 'deg)';
        this.windCompass = this.wind_cardinals(parseFloat(this.loop['windDir']).toFixed(1));
      }
      if(this.loop['windGust_kph'] != null) {
        this.windGust_kph = parseFloat(this.loop['windGust_kph']).toFixed(0) + " km/h";
      }
      if(this.loop['barometer_mbar'] != null) {
        this.barometer_mbar = this.replace_point(parseFloat(this.loop['barometer_mbar']).toFixed(1)) + " hPa";
      }
      if(this.loop['cloudbase_meter'] != null) {
        this.cloudbase_meter = parseFloat(this.loop['cloudbase_meter']).toFixed(0) + " mètres";
      }
      if(this.loop['dewpoint_C'] != null) {
        this.dewpoint_C = this.replace_point(parseFloat(this.loop['dewpoint_C']).toFixed(1)) + " °C";
      }
      if(this.loop['outHumidity'] != null) {
        this.outHumidity = parseFloat(this.loop['outHumidity']).toFixed(0) + " %";
      }
      if(this.loop['dayRain_cm'] != null) {
        this.dayRain_cm = this.replace_point(parseFloat(this.loop['dayRain_cm']).toFixed(1)) + " mm";
      }
      if(this.loop['rainRate_cm_per_hour'] != null) {
        this.rainRate_cm_per_hour = this.replace_point(parseFloat(this.loop['rainRate_cm_per_hour']).toFixed(1)) + " mm/h";
      }
      if(this.loop['UV'] != null) {
        this.UV = this.replace_point(parseFloat(this.loop['UV']).toFixed(1));
      }

    } // end of IMqttMessage
    ); // end of subs
    
    
    console.log('ionViewDidLoad HomePage');

  }

  //
  ionViewWillEnter() {

    console.log('ionViewWillEnter HomePage');
  }

  ionViewWillLeave() {
      this.subs.unsubscribe();
      console.log('MQTT unsubscribed');
  }


}
