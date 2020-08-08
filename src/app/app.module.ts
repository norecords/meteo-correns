import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Network } from '@ionic-native/network/';
import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { MqttModule, MqttService , IMqttServiceOptions} from 'ngx-mqtt';
import { SettingsProvider } from '../providers/settings/settings';
import { ApiProvider } from '../providers/api/api';
import { HttpModule } from '@angular/http'; // Import HttpModule
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
//import { PreloadProvider } from '../providers/preload/preload';

export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: 'iot.correns.org',
  port: 9001,
  protocol : 'wss',
  path: '/mqtt'
};

export function mqttServiceFactory() {
  return new MqttService(MQTT_SERVICE_OPTIONS);
}
/*
export function loadProviderFactory(provider: PreloadProvider) {
  if (navigator.onLine) {
    return () => provider.load();
  } else {
    console.log('network disconnected')
    alert("Vous êtes déconnecté, veuillez activer le réseau et appuyer sur la touche précédent.")
  }
}
*/
@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    FontAwesomeModule,
    HttpModule,
    MqttModule.forRoot({
      provide: MqttService,
      useFactory: mqttServiceFactory
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    Network,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SettingsProvider,
    ApiProvider,
    //PreloadProvider,
    //{ provide: APP_INITIALIZER, useFactory: loadProviderFactory, deps: [PreloadProvider], multi: true }
  ]
})
export class AppModule {}
