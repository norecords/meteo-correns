import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs/Subscription';
import { Network } from '@ionic-native/network';
import { SettingsProvider } from "../../providers/settings/settings";
import { faExclamationTriangle, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import * as moment from 'moment';
import 'moment/locale/fr';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})

export class HomePage {
  mqttOnConnect: any;
  loop = []; // mqtt loop
  live = []; // live array
  summaries = []; // summaries array
  dateTime : any; // use to convert unix epoch to date
  networkStatus : boolean;
  alerts : boolean = false;
  showAlerts: String;
  toastMsgs: any = [];
  iconAlert = faExclamationTriangle;
  iconDown = faAngleDown;
  iconUp = faAngleUp;
  liveCache = []

  private subs : Subscription;   // MQTT sub

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public toastCtrl : ToastController,
              public network : Network, 
              private apiProvider: ApiProvider,
              private mqttService: MqttService,
              private settings: SettingsProvider) {
                
    this.settings.getActiveAlertsDisplay().subscribe(val => this.showAlerts = val);


    this.network.onDisconnect().subscribe(() => {
      console.log('network disconnected')
      alert("Vous êtes déconnecté, l'application va se fermer")
      navigator['app'].exitApp()
    });

    this.network.onConnect().subscribe(() => {
      console.log('network connected')
    });

    if (navigator.onLine) {
      console.log('Internet is connected');
      this.networkStatus = true;
    } else {
      console.log('No internet connection');
      this.networkStatus = false;
    }

    this.mqttOnConnect = this.mqttService.onConnect.subscribe((e) => {
      console.log('MQTT onConnect', e);
      if(e['cmd'] == 'connack') {
        this.live['showOffline'] = false;
        this.live['showOnline'] = false;
        this.presentToast('Vous êtes connecté au serveur live.', 8000)
      }
    });

    this.mqttService.onError.subscribe((e) => {
        console.log('MQTT Erreur de connection...')
        console.log('MQTT onError', e);
        this.presentToast('Une erreur est survenue, veuillez vérifier votre connection.', 8000)
        this.live['showOffline'] = true;
        this.live['showOnline'] = false;
    });

    this.mqttService.onClose.subscribe(() => {
        console.log('MQTT Connection fermée.')
        this.live['showOffline'] = true;
        this.live['showOnline'] = false;
    });

    this.mqttService.onReconnect.subscribe(() => {
        this.live['showOffline'] = false;
        this.live['showOnline'] = false;
    });
  }

  async presentToast(mes,duration) {
    this.toastMsgs.push(mes);
    //console.log(this.toastMsgs.length)
    if (this.toastMsgs.length < 2 ) {
      const toast = await this.toastCtrl.create({
          message: this.toastMsgs['0'].toString(),
          position: 'bottom',
          duration: duration
      });
      toast.present();
    } else if (this.toastMsgs.length > 5) {
      this.toastMsgs.length = 0;
    }
}

  // Transform mqtt value windDir degree in cardinal point
  private wind_cardinals(deg) {
    var directions = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSO','SO','OSO','O','ONO','NO','NNO','N']
    var cardinal = directions[Math.round(deg / 22.5)];
    return cardinal;
  }

  // Handle wind arrow rotation with the ability to "rollover" past 0 
// without spinning back around. e.g 350 to 3 would spin back around
// https://stackoverflow.com/a/19872672/1177153
private rotateThis(newRotation) {
  if ( newRotation == "N/A") { return; }
  let currentRotation;
  var finalRotation = finalRotation || 0; // if finalRotation undefined or 0, make 0, else finalRotation
  currentRotation = finalRotation % 360;
  if ( currentRotation < 0 ) { currentRotation += 360; }
  if ( currentRotation < 180 && (newRotation > (currentRotation + 180)) ) { finalRotation -= 360; }
  if ( currentRotation >= 180 && (newRotation <= (currentRotation - 180)) ) { finalRotation += 360; }  finalRotation += (newRotation - currentRotation);
  return finalRotation;
}

  // Replace unit . by ,
  private replace_point(str) {
    let newstr = str.replace('.', ','); 
    return newstr;
  }

  // Capitalize moment first letter
  private capitalizeFirstLetter(str) {
    let newstr = str.substring(0, 1).toUpperCase() + str.substring(1);
    return newstr;
  }

  // colorize outTemp class span
  private temp_colorize(temp) {
    let color;
    if ( temp <= 0 ) color = "#1278c8";
    else if ( temp <= -3.8 ) color = "#30bfef";
    else if ( temp <= 0 ) color = "#1fafdd";
    else if ( temp <= 4.4 ) color = "rgba(0,172,223,1)";
    else if ( temp <= 10 ) color = "#71bc3c";
    else if ( temp <= 12.7 ) color = "rgba(90,179,41,0.8)";
    else if ( temp <= 18.3 ) color = "rgba(131,173,45,1)";
    else if ( temp <= 21.1 ) color = "rgba(206,184,98,1)";
    else if ( temp <= 23.8 ) color = "rgba(255,174,0,0.9)";
    else if ( temp <= 26.6 ) color = "rgba(255,153,0,0.9)";
    else if ( temp <= 29.4 ) color = "rgba(255,127,0,1)";
    else if ( temp <= 32.2 ) color = "rgba(255,79,0,0.9)";
    else if ( temp <= 35 ) color = "rgba(255,69,69,1)";
    else if ( temp <= 43.3 ) color = "rgba(255,104,104,1)";
    else if ( temp >= 43.4 ) color = "rgba(218,113,113,1)";
    //console.log(color)
    return color;
  }

  private checkSummariesIcon(state) {
    let check;
    if (state === 'clear-day') check = '<img src="assets/imgs/yr/01d.png">';
    else if (state === 'clear-night') check = '<img src="assets/imgs/yr/01n.png">';
    else if (state === 'cloudy') check = '<img src="assets/imgs/yr/04.png">';
    else if (state === 'fog') check = '<img src="assets/imgs/yr/15.png">';
    else if (state === 'hail') check = '<img src="assets/imgs/yr/22.png">';
    else if (state === 'partly-cloudy-day') check = '<img src="assets/imgs/yr/03d.png">';
    else if (state === 'partly-cloudy-night') check = '<img src="assets/imgs/yr/03n.png">';
    else if (state === 'rain') check = '<img src="assets/imgs/yr/09.png">';
    else if (state === 'sleet') check = '<img src="assets/imgs/yr/12.png">';
    else if (state === 'snow') check = '<img src="assets/imgs/yr/13.png">';
    else if (state === 'thunderstorm') check = '<img src="assets/imgs/yr/22.png">';
    else if (state === 'tornado') check = '<img src="assets/imgs/yr/11.png">';
    else if (state === 'wind') check = '<img src="assets/imgs/yr/wind.png">';

    return check;
  }

  public alertsColorize(alert) {
    let color;
    if (alert.match(/jaune/i)) color = "#cfc800";
    else if (alert.match(/orange/i)) color = "#cf8a00";
    else if (alert.match(/rouge/i)) color = "#cf0000";
    return color;
  }

  public momentAlerts(time,type) {
    if (type === 'from') time = moment.unix(time).fromNow();
    if (type === 'to') time = moment.unix(time).format('dddd Do MMMM YYYY LT');
    return time;
  }

  public toggleAlerts() {
    if (this.showAlerts === 'true') {
      this.settings.setActiveAlertsDisplay('false');
      //console.log(this.showAlerts)
    } else {
      this.settings.setActiveAlertsDisplay('true');
      //console.log(this.showAlerts)
    }
  }

  // load main Json
  private loadJson() {
    this.apiProvider.getLive().subscribe(data => { 
        this.dateTime = data['current']['datetime_raw'];
        this.live['dateTime'] = moment.unix(this.dateTime).format('dddd Do MMMM YYYY LTS');
        this.live['outTemp_C'] = data['current']['outTemp_formatted'] + "<sup class='outtempunitlabelsuper'>°C</sup>";
        this.live['outTempColor'] = this.temp_colorize(parseFloat(data['current']['outTemp_formatted']));
        this.live['appTemp_C'] = 'Ressenti: ' + data['current']['appTemp'];
        this.live['windSpeed_kph'] = data['current']['windSpeed'];
        this.live['windCompass'] = data['current']['windCompass'];
        this.live['windDir'] = data['current']['windDir'];
        this.live['windArrow'] =  "rotate(" + this.rotateThis(data['current']['winddir_formatted']) + 'deg)';
        this.live['windGust_kph']  = data['current']['windGust'];
        this.live['barometer_mbar'] = data['current']['barometer'];
        this.live['dewpoint_C'] = data['current']['dewpoint'];
        this.live['outHumidity'] = data['current']['outHumidity'];
        this.live['dayRain_cm'] = data['day']['rainSum'];
        this.live['rainRate_cm_per_hour'] = data['current']['rainRate'];
        this.live['UV'] = data['current']['uv'];
        this.live['cloudbase'] = data['current']['cloudbase'];
        this.summaries['dateToday'] = this.capitalizeFirstLetter(moment.unix(this.dateTime).format('dddd Do MMMM YYYY'));
        this.summaries['dateMonth'] = this.capitalizeFirstLetter(moment.unix(this.dateTime).format('MMMM YYYY'));
        this.summaries['visibility'] = data['current']['visibility'];
        this.summaries['icon'] = this.checkSummariesIcon(data['current']['icon']);
        this.summaries['currentText'] = data['current']['summary'];
        this.summaries['dayOutTempMax'] = data['day']['outTempMax'];
        this.summaries['dayOutTempMin'] = data['day']['outTempMin'];
        this.summaries['dayWindAvg'] = data['day']['windAvg'];
        this.summaries['dayWindMax'] = data['day']['windMax'];
        this.summaries['dayRainSum'] = data['day']['rainSum'];
        this.summaries['dayRainRateMax'] = data['day']['rainRateMax'];
        this.summaries['monthOutTempMax'] = data['month']['outTempMax'];
        this.summaries['monthOutTempMin'] = data['month']['outTempMin'];
        this.summaries['monthWindAvg'] = data['month']['windAvg'];
        this.summaries['monthWindMax'] = data['month']['windMax'];
        this.summaries['monthRainSum'] = data['month']['rainSum'];
        this.summaries['monthRainRateMax'] = data['month']['rainRateMax'];
        if (data['alerts'] != null) {
         this.alerts = true;
          this.summaries['alerts'] = data['alerts'];
          console.log('alerts : ' + this.alerts)
        }      
      });
  }

  // Reload summaries every 5 minutes
  private reloadJson() {
    setInterval(() => {
      this.apiProvider.getLive().subscribe(data => { 
          this.dateTime = data['current']['datetime_raw'];
          this.summaries['dateToday'] = this.capitalizeFirstLetter(moment.unix(this.dateTime).format('dddd Do MMMM YYYY'));
          this.summaries['dateMonth'] = this.capitalizeFirstLetter(moment.unix(this.dateTime).format('MMMM YYYY'));
          this.summaries['icon'] = this.checkSummariesIcon(data['current']['icon']);
          this.summaries['currentText'] = data['current']['summary'];
          this.summaries['visibility'] = data['current']['visibility'];
          this.summaries['dayOutTempMax'] = data['day']['outTempMax'];
          this.summaries['dayOutTempMin'] = data['day']['outTempMin'];
          this.summaries['dayWindAvg'] = data['day']['windAvg'];
          this.summaries['dayWindMax'] = data['day']['windMax'];
          this.summaries['dayRainSum'] = data['day']['rainSum'];
          this.summaries['dayRainRateMax'] = data['day']['rainRateMax'];
          this.summaries['monthOutTempMax'] = data['month']['outTempMax'];
          this.summaries['monthOutTempMin'] = data['month']['outTempMin'];
          this.summaries['monthWindAvg'] = data['month']['windAvg'];
          this.summaries['monthWindMax'] = data['month']['windMax'];
          this.summaries['monthRainSum'] = data['month']['rainSum'];
          this.summaries['monthRainRateMax'] = data['month']['rainRateMax'];
          if (data['alerts'] != null) {
            this.alerts = true;
             this.summaries['alerts'] = data['alerts'];
             console.log('alerts : ' + this.alerts)
           } else {
            this.alerts = false;
          }
          console.log('summaries and symbol updated');
        
      });
    }, 300000); // 5 minutes
  }

  private mqttSubscribe() {
    // Parse weewx mqtt loop
    this.subs = this.mqttService.observe('weather/correns/live/loop').subscribe(
      (loop : IMqttMessage) => {
        this.loop = JSON.parse(loop.payload.toString());
        // Transform unix epoch dateTime in date format using moment
        if(this.loop['dateTime'] != null) {
          this.dateTime = parseFloat(this.loop['dateTime']).toFixed(0);
          this.live['dateTime'] = moment.unix(this.dateTime).format('dddd Do MMMM YYYY LTS');
          this.live['showOffline'] = false;
          this.live['showOnline'] = true;
        }
        // Verifying if data exist to prevent loading blank value in html. 
        // parseFloat data received from MQTT, round it and put unit
        if(this.loop['outTemp_C'] != null) {
          this.live['outTemp_C'] = this.replace_point(parseFloat(this.loop['outTemp_C']).toFixed(1)) + "<sup class='outtempunitlabelsuper'>°C</sup>";
          this.live['outTempColor'] = this.temp_colorize(parseFloat(this.loop['outTemp_C']).toFixed(1));

        }  
        if(this.loop['appTemp_C'] != null) {
          this.live['appTemp_C'] = 'Ressenti: ' + this.replace_point(parseFloat(this.loop['appTemp_C']).toFixed(1)) + " °C";
        }
        if(this.loop['windSpeed_kph'] != null) {
          this.live['windSpeed_kph'] = parseFloat(this.loop['windSpeed_kph']).toFixed(0) + " km/h";
        }
        if(this.loop['windDir'] != null) {
          this.live['windDir'] = parseFloat(this.loop['windDir']).toFixed(0) + " °";
          this.live['windArrow'] =  "rotate(" + this.rotateThis(parseFloat(this.loop['windDir'])) + 'deg)';
          this.live['windCompass'] = this.wind_cardinals(parseFloat(this.loop['windDir']).toFixed(1));
        }
        if(this.loop['windGust_kph'] != null) {
          this.live['windGust_kph'] = parseFloat(this.loop['windGust_kph']).toFixed(0) + " km/h";
        }
        if(this.loop['barometer_mbar'] != null) {
          this.live['barometer_mbar'] = this.replace_point(parseFloat(this.loop['barometer_mbar']).toFixed(1)) + " hPa";
        }
        if(this.loop['cloudbase_meter'] != null) {
          this.live['cloudbase_meter'] = parseFloat(this.loop['cloudbase_meter']).toFixed(0) + " mètres";
        }
        if(this.loop['dewpoint_C'] != null) {
          this.live['dewpoint_C'] = this.replace_point(parseFloat(this.loop['dewpoint_C']).toFixed(1)) + " °C";
        }
        if(this.loop['outHumidity'] != null) {
          this.live['outHumidity'] = parseFloat(this.loop['outHumidity']).toFixed(0) + " %";
        }
        if(this.loop['dayRain_cm'] != null) {
          this.live['dayRain_cm'] = this.replace_point(parseFloat(this.loop['dayRain_cm']).toFixed(1)) + " mm";
        }
        if(this.loop['rainRate_cm_per_hour'] != null) {
          this.live['rainRate_cm_per_hour'] = this.replace_point(parseFloat(this.loop['rainRate_cm_per_hour']).toFixed(1)) + " mm/h";
        }
        if(this.loop['UV'] != null) {
          this.live['UV'] = this.replace_point(parseFloat(this.loop['UV']).toFixed(1));
        }
  
      } // end of IMqttMessage
    ); // end of subs
  }


  ionViewDidLoad() {

    if (this.networkStatus === true) {
    // load Json function
    this.loadJson();
    // reload Json function
    this.reloadJson();
    // subscribe to mqtt topic
    this.mqttSubscribe();
    
    console.log('HomePage loaded');
    } 

  }
  ionViewWillLeave() {
      // Mqtt Unsubscribe
      if (this.loop['dateTime'] != null) {
      this.subs.unsubscribe();
      this.mqttOnConnect.unsubscribe();
      this.live['showOffline'] = false;
      this.live['showOnline'] = false;
      console.log('MQTT unsubscribed');
      }
  }
  

}
