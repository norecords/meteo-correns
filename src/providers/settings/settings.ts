import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable()
export class SettingsProvider {
  private theme: BehaviorSubject<String>;
  private mode: BehaviorSubject<String>;
  private alertsDisplay: BehaviorSubject<String>;
  private almanac : BehaviorSubject<Array<any>>;
  private sunrise : BehaviorSubject<Array<any>>;
  private forecast : BehaviorSubject<Array<any>>;
  private live : BehaviorSubject<Array<any>>;


  constructor() {
    this.theme = new BehaviorSubject('light-theme');
    this.mode = new BehaviorSubject('auto');
    this.alertsDisplay = new BehaviorSubject('true');
    this.almanac = new BehaviorSubject([]);
    this.sunrise = new BehaviorSubject([]);
    this.forecast = new BehaviorSubject([]);
    this.live = new BehaviorSubject([]);


  }

  // light or dark
  setActiveTheme(val) {
    this.theme.next(val);
    console.log('setActiveTheme ' + val)
  }
  getActiveTheme() {
    return this.theme.asObservable();
  }

  // auto or manual
  setActiveMode(val) {
    this.mode.next(val);
    console.log('setActiveMode ' + val)
  }
  getActiveMode() {
    return this.mode.asObservable();
  
  }
  // diplay or shrink weather alerts
  setActiveAlertsDisplay(val) {
    this.alertsDisplay.next(val);
  }
  getActiveAlertsDisplay() {
    return this.alertsDisplay.asObservable();
  }
    
  // Sunrise data
  updateSunriseData(data) {
    this.sunrise.next(data);
  }
  getSunriseData() {
    return this.sunrise.asObservable();
  }

  // live
  setLiveData(val) {
    this.live.next(val);
    console.log('setLiveData ' + val)
  }
  getLiveData() {
    return this.live.asObservable();
  }

  // Forecast data
  updateForecastData(data) {
    this.forecast.next(data);
  }
  getForecastData() {
    return this.forecast.asObservable();
  }
  
  // Almanac data
  updateAlmanacData(data) {
    this.almanac.next(data);
  }
  getAlmanacData() {
    return this.almanac.asObservable();
  }

}