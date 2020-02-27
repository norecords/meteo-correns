import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable()
export class SettingsProvider {
  private theme: BehaviorSubject<String>;
  private mode: BehaviorSubject<String>;
  private alertsDisplay: BehaviorSubject<String>;

  constructor() {
    this.theme = new BehaviorSubject('light-theme');
    this.mode = new BehaviorSubject('auto');
    this.alertsDisplay = new BehaviorSubject('true');
  }

  setActiveTheme(val) {
    this.theme.next(val);
  }

  setActiveMode(val) {
    this.mode.next(val);
  }

  setActiveAlertsDisplay(val) {
    this.alertsDisplay.next(val);
  }

  getActiveTheme() {
    return this.theme.asObservable();
  }

  getActiveMode() {
    return this.mode.asObservable();
  }

  getActiveAlertsDisplay() {
    return this.alertsDisplay.asObservable();
  }

}