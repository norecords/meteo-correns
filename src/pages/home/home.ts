import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams, ToastController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';
import 'moment/locale/fr';
import { Network } from '@ionic-native/network';
//import { faComment } from '@fortawesome/free-solid-svg-icons';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})

export class HomePage {
  loop = []; // mqtt loop
  weather = []; // json array  
  live = []; // live array
  summaries = []; // summaries array
  loading: string; // loader
  dateTime : any; // use to convert unix epoch to date
  networkStatus : boolean;
  //faCoffee = faComment;
  public toastMsgs: any = [];

// private toastInstance: Toast;
  private subs : Subscription;   // MQTT sub

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              public toastCtrl : ToastController,
              public network : Network, 
              private apiProvider: ApiProvider,
              private mqttService: MqttService) {

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

    console.log('MQTT Connection en cours...');
    this.mqttService.onConnect.subscribe((e) => {
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
  var currentRotation;
  var finalRotation = finalRotation || 0; // if finalRotation undefined or 0, make 0, else finalRotation
  currentRotation = finalRotation % 360;
  if ( currentRotation < 0 ) { currentRotation += 360; }
  if ( currentRotation < 180 && (newRotation > (currentRotation + 180)) ) { finalRotation -= 360; }
  if ( currentRotation >= 180 && (newRotation <= (currentRotation - 180)) ) { finalRotation += 360; }  finalRotation += (newRotation - currentRotation);
  return finalRotation;
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

  // load main Json
  private loadJson() {
    let loader = this.loadingCtrl.create({
      content: '<h2>Chargement des données</h2>Téléchargement en cours...',
      duration: 20000
    });
    loader.present()

    this.apiProvider.getLive().subscribe(data => { 
      this.weather = data;
        this.dateTime = this.weather['current']['datetime_raw'];
        this.live['dateTime'] = moment.unix(this.dateTime).format('dddd Do MMMM YYYY LTS');
        this.live['outTemp_C'] = this.weather['current']['outTemp_formatted'] + "<sup class='outtempunitlabelsuper'>°C</sup>";
        this.live['outTempColor'] = this.temp_colorize(parseFloat(this.weather['current']['outTemp_formatted']));
        this.live['appTemp_C'] = 'Ressenti: ' + this.weather['current']['appTemp'];
        this.live['windSpeed_kph'] = this.weather['current']['windSpeed'];
        this.live['windCompass'] = this.weather['current']['windCompass'];
        this.live['windDir'] = this.weather['current']['windDir'];
        this.live['windArrow'] =  "rotate(" + this.rotateThis(this.weather['current']['winddir_formatted']) + 'deg)';
        this.live['windGust_kph']  = this.weather['current']['windGust'];
        this.live['barometer_mbar'] = this.weather['current']['barometer'];
        this.live['dewpoint_C'] = this.weather['current']['dewpoint'];
        this.live['outHumidity'] = this.weather['current']['outHumidity'];
        //this.live['dayRain_cm'] = this.weather['current']['rain'];
        this.live['dayRain_cm'] = this.weather['day']['rainSum'];
        this.live['rainRate_cm_per_hour'] = this.weather['current']['rainRate'];
        this.live['UV'] = this.weather['current']['uv'];
        this.live['cloudbase'] = this.weather['current']['cloudbase'];
        this.summaries['dateToday'] = this.capitalizeFirstLetter(moment.unix(this.dateTime).format('dddd Do MMMM YYYY'));
        this.summaries['dateMonth'] = this.capitalizeFirstLetter(moment.unix(this.dateTime).format('MMMM YYYY'));
        this.summaries['visibility'] = this.weather['current']['visibility'];
        this.summaries['icon'] = this.checkSummariesIcon(this.weather['current']['icon']);
        this.summaries['currentText'] = this.weather['current']['summary'];
        this.summaries['dayOutTempMax'] = this.weather['day']['outTempMax'];
        this.summaries['dayOutTempMin'] = this.weather['day']['outTempMin'];
        this.summaries['dayWindAvg'] = this.weather['day']['windAvg'];
        this.summaries['dayWindMax'] = this.weather['day']['windMax'];
        this.summaries['dayRainSum'] = this.weather['day']['rainSum'];
        this.summaries['dayRainRateMax'] = this.weather['day']['rainRateMax'];
        this.summaries['monthOutTempMax'] = this.weather['month']['outTempMax'];
        this.summaries['monthOutTempMin'] = this.weather['month']['outTempMin'];
        this.summaries['monthWindAvg'] = this.weather['month']['windAvg'];
        this.summaries['monthWindMax'] = this.weather['month']['windMax'];
        this.summaries['monthRainSum'] = this.weather['month']['rainSum'];
        this.summaries['monthRainRateMax'] = this.weather['month']['rainRateMax'];
      // Dismiss loader
      if (this.weather['current']['datetime_raw'] =! null) {
        setTimeout(() => {
          loader.dismiss();
        }, 1000);
      }
    });   
  }

  // Reload summaries every 5 minutes
  private reloadJson() {
    setInterval(() => {
      this.apiProvider.getLive().subscribe(data => { 
        this.weather = data;
          this.dateTime = this.weather['current']['datetime_raw'];
          this.summaries['dateToday'] = this.capitalizeFirstLetter(moment.unix(this.dateTime).format('dddd Do MMMM YYYY'));
          this.summaries['dateMonth'] = this.capitalizeFirstLetter(moment.unix(this.dateTime).format('MMMM YYYY'));
          this.summaries['icon'] = this.checkSummariesIcon(this.weather['current']['icon']);
          this.summaries['currentText'] = this.weather['current']['summary'];
          this.summaries['visibility'] = this.weather['current']['visibility'];
          this.summaries['dayOutTempMax'] = this.weather['day']['outTempMax'];
          this.summaries['dayOutTempMin'] = this.weather['day']['outTempMin'];
          this.summaries['dayWindAvg'] = this.weather['day']['windAvg'];
          this.summaries['dayWindMax'] = this.weather['day']['windMax'];
          this.summaries['dayRainSum'] = this.weather['day']['rainSum'];
          this.summaries['dayRainRateMax'] = this.weather['day']['rainRateMax'];
          this.summaries['monthOutTempMax'] = this.weather['month']['outTempMax'];
          this.summaries['monthOutTempMin'] = this.weather['month']['outTempMin'];
          this.summaries['monthWindAvg'] = this.weather['month']['windAvg'];
          this.summaries['monthWindMax'] = this.weather['month']['windMax'];
          this.summaries['monthRainSum'] = this.weather['month']['rainSum'];
          this.summaries['monthRainRateMax'] = this.weather['month']['rainRateMax'];
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
      this.live['showOffline'] = false;
      this.live['showOnline'] = false;
      console.log('MQTT unsubscribed');
      }
  }


}
