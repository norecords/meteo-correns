import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class ApiProvider {

  constructor(private http: Http) { }

  getLive() {
    return this.http.get('https://meteo.correns.org/api/v1/app.php?q=weewxdata')
    .map(this.extractData)
    .do(this.logResponse)
    .catch(this.catchError)
  }

  getJsonDayCharts(){
    return this.http.get('https://meteo.correns.org/api/v1/app.php?q=chartsday')
    .map(this.extractData)
    .do(this.logResponse)
    .catch(this.catchError)
  }

  getJsonWeekCharts(){
    return this.http.get('https://meteo.correns.org/api/v1/app.php?q=chartsweek')
    .map(this.extractData)
    .do(this.logResponse)
    .catch(this.catchError)
  }

  getJsonMonthCharts(){
    return this.http.get('https://meteo.correns.org/api/v1/app.php?q=monthcharts')
    .map(this.extractData)
    .do(this.logResponse)
    .catch(this.catchError)
  }

  getJsonYearCharts(){
    return this.http.get('https://meteo.correns.org/api/v1/app.php?q=yearcharts')
    .map(this.extractData)
    .do(this.logResponse)
    .catch(this.catchError)
  }

  getForecast(){
    return this.http.get('https://meteo.correns.org/api/v1/app.php?q=forecast')
    .map(this.extractData)
    .do(this.logResponse)
    .catch(this.catchError)
  }

  getJsonAlmanach(){
    return this.http.get('https://meteo.correns.org/api/v1/app.php?q=almanach')
    .map(this.extractData)
    .do(this.logResponse)
    .catch(this.catchError)
  }

  getJsonAbout(){
    return this.http.get('https://meteo.correns.org/api/v1/app.php?q=about')
    .map(this.extractData)
    .do(this.logResponse)
    .catch(this.catchError)
  }

  getJsonSunrise(){
    return this.http.get('https://meteo.correns.org/api/v1/app.php?q=sunrise')
    .map(this.extractData)
    .do(this.logResponse)
    .catch(this.catchError)
  }

  private catchError(error: Response | any) {
	  console.log(error);
	  return Observable.throw(error.json().error || "Server error!");
  }
  private logResponse(res: Response) {
	console.log(res);
	}
  private extractData(res: Response){
	return res.json();
	}
}
