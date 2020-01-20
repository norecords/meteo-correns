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
  outTemp_C : string
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

  weather = []; /* declare live.json as array */
  loading: any;
  symbol: string;
  summary: string;
  windCompass: string;

  // MQTT sub
  private subs : Subscription;

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
      // parseFloat datas, round it and put unit
      if(this.loop['outTemp_C'] != null) {
        this.outTemp_C = parseFloat(this.loop['outTemp_C']).toFixed(1) + " °C";
      }  
      if(this.loop['appTemp_C'] != null) {
        this.appTemp_C = parseFloat(this.loop['appTemp_C']).toFixed(1) + " °C";
      }
      if(this.loop['windSpeed_kph'] != null) {
        this.windSpeed_kph = parseFloat(this.loop['windSpeed_kph']).toFixed(0) + " km/h";
      }
      if(this.loop['windDir'] != null) {
        this.windDir = parseFloat(this.loop['windDir']).toFixed(1) + " °";
      }
      if(this.loop['windGust_kph'] != null) {
        this.windGust_kph = parseFloat(this.loop['windGust_kph']).toFixed(0) + " km/h";
      }
      if(this.loop['barometer_mbar'] != null) {
        this.barometer_mbar = parseFloat(this.loop['barometer_mbar']).toFixed(1) + " hPa";
      }
      if(this.loop['cloudbase_meter'] != null) {
        this.cloudbase_meter = parseFloat(this.loop['cloudbase_meter']).toFixed(0) + " mètres";
      }
      if(this.loop['dewpoint_C'] != null) {
        this.dewpoint_C = parseFloat(this.loop['dewpoint_C']).toFixed(1) + " °C";
      }
      if(this.loop['outHumidity'] != null) {
        this.outHumidity = parseFloat(this.loop['outHumidity']).toFixed(0) + " %";
      }
      if(this.loop['dayRain_cm'] != null) {
        this.dayRain_cm = parseFloat(this.loop['dayRain_cm']).toFixed(1) + " mm";
      }
      if(this.loop['rainRate_cm_per_hour'] != null) {
        this.rainRate_cm_per_hour = parseFloat(this.loop['rainRate_cm_per_hour']).toFixed(1) + " mm/h";
      }
      if(this.loop['UV'] != null) {
        this.UV = parseFloat(this.loop['UV']).toFixed(1);
      }

    } // end of IMqttMessage
    ); // end of subs
  } // end of constructor

  // Refresher function
  load(refresher) {
    setTimeout(() => {
      refresher.complete();
    }, 20000);
    let loader = this.loadingCtrl.create({
      content: '<h2>Chargement des données</h2>Téléchargement en cours...'
    });

    loader.present()

    setTimeout(() => {
      loader.dismiss();
    }, 20000);

      this.apiProvider.getLive().subscribe(data => { 
        this.weather = data;
        this.symbol = '<img src="assets/imgs/darksky/' + this.weather['current']['icon'] + '.png">';
        this.summary = this.weather['current']['summary'];
        this.dateTime = this.weather['current']['datetime_raw'];
        this.dateTime = moment.unix(this.dateTime).format('dddd Do MMMM YYYY LTS');
        this.outTemp_C = this.weather['current']['outTemp'];
        this.appTemp_C = this.weather['current']['appTemp'];
        this.windSpeed_kph = this.weather['current']['windSpeed'];
        this.windCompass = this.weather['current']['windCompass'];
        this.windDir = this.weather['current']['windDir'];
        this.windGust_kph  = this.weather['current']['windGust'];
        this.barometer_mbar = this.weather['current']['barometer'];
        this.dewpoint_C = this.weather['current']['dewpoint'];
        this.outHumidity = this.weather['current']['outHumidity'];
        this.dayRain_cm = this.weather['current']['rain'];
        this.rainRate_cm_per_hour = this.weather['current']['rainRate'];
        this.UV = this.weather['current']['uv'];
      });
      
      loader.dismiss();
      refresher.complete();
      console.log("Json refresh completed")
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
      this.weather = data;
      this.symbol = '<img class="yricon" src="assets/imgs/darksky/' + this.weather['current']['icon'] + '.png">';
      this.summary = this.weather['current']['summary'];
      this.dateTime = this.weather['current']['datetime_raw'];
      this.dateTime = moment.unix(this.dateTime).format('dddd Do MMMM YYYY LTS');
      this.outTemp_C = this.weather['current']['outTemp'];
      this.appTemp_C = this.weather['current']['appTemp'];
      this.windSpeed_kph = this.weather['current']['windSpeed'];
      this.windCompass = this.weather['current']['windCompass'];
      this.windDir = this.weather['current']['windDir'];
      this.windGust_kph  = this.weather['current']['windGust'];
      this.barometer_mbar = this.weather['current']['barometer'];
      this.dewpoint_C = this.weather['current']['dewpoint'];
      this.outHumidity = this.weather['current']['outHumidity'];
      this.dayRain_cm = this.weather['current']['rain'];
      this.rainRate_cm_per_hour = this.weather['current']['rainRate'];
      this.UV = this.weather['current']['uv'];
    });
    
    loader.dismiss();
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
