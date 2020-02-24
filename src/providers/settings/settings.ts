import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable()
export class SettingsProvider {
  private theme: BehaviorSubject<String>;
  private mode: BehaviorSubject<String>;

  constructor() {
    this.theme = new BehaviorSubject('light-theme');
    this.mode = new BehaviorSubject('auto');
  }

  setActiveTheme(val) {
    this.theme.next(val);
  }

  setActiveMode(val) {
    this.mode.next(val);
  }

  getActiveTheme() {
    return this.theme.asObservable();
  }

  getActiveMode() {
    return this.mode.asObservable();
  }
}

