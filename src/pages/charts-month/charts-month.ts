import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api' 
import * as HighStock from 'highcharts/highstock';
import * as moment from 'moment';
import 'moment/locale/fr';

@IonicPage()
@Component({
  selector: 'page-charts-month',
  templateUrl: 'charts-month.html',
})
export class ChartsMonthPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              private apiProvider: ApiProvider) {}

  data: void;
  dateTime : number;
  longTitle : string;
  shortTitle : string;
  weather = []
  lastDateTime: number;

  ionViewDidLoad() {

    let loader = this.loadingCtrl.create({
        content: '<h2>Chargement des données</h2>Téléchargement en cours...'
      });
  
      loader.present()
  
      setTimeout(() => {
        loader.dismiss();
      }, 20000);

      this.apiProvider.getJsonMonthCharts().subscribe(data => { 
        this.weather = data;
        console.log(this.weather);
   
        let outTemp = [];
        let outTemp_min = [];
        let windDir = [];
        let windGust = [];
        let windSpeed = [];
        let rainRate = [];
        let rainTotal = [];
        let barometer = [];
   
        if(this.weather['temperature']['series']['outTemp']['data'].length > 0) {
          // outTemp
          for(let i = 0; i < this.weather['temperature']['series']['outTemp']['data'].length; i++) {
            outTemp.push(
              [this.weather['temperature']['series']['outTemp']['data'][i]['0'], this.weather['temperature']['series']['outTemp']['data'][i]['1']]
            );
            this.lastDateTime = this.weather['temperature']['series']['outTemp']['data'][i]['0'] /1000;
          }

          if(this.weather['temperature']['series']['outTemp']['data'].length > 0) {
            // dateTime
          this.dateTime = this.weather['temperature']['series']['outTemp']['data']['0']['0'] / 1000;
          console.log(this.lastDateTime)
          this.longTitle = 'Du ' + moment.unix(this.dateTime).format('dddd Do MMMM YYYY') + ' au ' + moment.unix(this.lastDateTime).format('dddd Do MMMM YYYY');
          this.shortTitle = 'Du ' + moment.unix(this.dateTime).format('L') + ' au ' + moment.unix(this.lastDateTime).format('L');
          }

          // outTemp_min
          for(let i = 0; i < this.weather['temperature']['series']['outTemp_min']['data'].length; i++) {
            outTemp_min.push(
              [this.weather['temperature']['series']['outTemp_min']['data'][i]['0'], this.weather['temperature']['series']['outTemp_min']['data'][i]['1']]
            );
          }
          // WindDir
          for(let i = 0; i < this.weather['vent']['series']['windDir']['data'].length; i++) {
            windDir.push(
              [this.weather['vent']['series']['windDir']['data'][i]['0'], this.weather['vent']['series']['windDir']['data'][i]['1']]
            );
          }
          // windGust
          for(let i = 0; i < this.weather['vent']['series']['windGust']['data'].length; i++) {
            windGust.push(
              [this.weather['vent']['series']['windGust']['data'][i]['0'], this.weather['vent']['series']['windGust']['data'][i]['1']]
            );
          }
          // windSpeed
          for(let i = 0; i < this.weather['vent']['series']['windSpeed']['data'].length; i++) {
            windSpeed.push(
              [this.weather['vent']['series']['windSpeed']['data'][i]['0'], this.weather['vent']['series']['windSpeed']['data'][i]['1']]
            );
          }
          // rainRate
          for(let i = 0; i < this.weather['pluie']['series']['rainRate']['data'].length; i++) {
            rainRate.push(
              [this.weather['pluie']['series']['rainRate']['data'][i]['0'], this.weather['pluie']['series']['rainRate']['data'][i]['1']]
            );
          }
          // rainSum
          for(let i = 0; i < this.weather['pluie']['series']['rainTotal']['data'].length; i++) {
            rainTotal.push(
              [this.weather['pluie']['series']['rainTotal']['data'][i]['0'], this.weather['pluie']['series']['rainTotal']['data'][i]['1']]
            );
          }
          // barometer
          for(let i = 0; i < this.weather['barometre']['series']['barometer']['data'].length; i++) {
            barometer.push(
              [this.weather['barometre']['series']['barometer']['data'][i]['0'], this.weather['barometre']['series']['barometer']['data'][i]['1']]
            );
          }
          
  
          loader.dismiss()

          }
          this.data = this.showHighchart(outTemp,outTemp_min,windDir,windGust,windSpeed,rainRate,rainTotal,barometer,this.longTitle,this.shortTitle)
        });

  }

  showHighchart(outTemp,outTemp_min,windDir,windGust,windSpeed,rainRate,rainTotal,barometer,longTitle,shortTitle){
 
    HighStock.chart('chartsMonth', {

      chart: {
        height: 1350,
        styledMode: true,
      },

  legend: {
      enabled: true,
      borderColor: 'grey',
      borderWidth: 1,
      layout: 'horizontal',
      verticalAlign: 'bottom',
      shadow: false
  },

  credits: {
      text: 'Météo Correns',
      href: 'https://meteo.correns.org'
  },

  rangeSelector: {
    enabled: true,
    buttons: [{
      type: 'day',
      count: 7,
      text: '7j'
  }, {
    type: 'day',
    count: 14,
    text: '14j'
  },{
      type: 'all',
      text: 'Tout'
  }],
  buttonTheme: {
      width: 25
  },
  selected: 2,
  inputEnabled: false
   
},

  xAxis: {
      type: 'datetime',
      crosshair: true,

  },

      yAxis: [{
          labels: { // temp
              align: 'right',
              x: -3
          },
          title: {
              text: 'Température'
          },
          height: '250px',
          lineWidth: 2
        }, { // windDir
          opposite: true,
          labels: {
              align: 'right',
              x: 8
          },
          title: {
              text: 'Direction'
          },
          top: '25%',
          height: '250px',
          offset: 0
      }, { // windspeed
        labels: {
            align: 'right',
            x: 8
        },
        title: {
            text: 'Vent'
        },
        top: '25%',
        height: '250px',
        offset: 0,
        lineWidth: 2

    }, { // rain
      labels: {
          align: 'right',
          x: 8
      },
      title: {
          text: 'Pluie'
      },
      top: '50%',
      height: '250px',
      offset: 0,
      lineWidth: 2

  }, { // barometer
    labels: {
        align: 'right',
        x: 8
    },
    title: {
        text: 'Baromètre'
    },
    top: '75%',
    height: '250px',
    offset: 0,
    lineWidth: 2
}],

      title: {
          text: longTitle
      },

      subtitle: {
          text: null
      },

      plotOptions: {
          series: {
              showInNavigator: false
          },
          area: {
            lineWidth: 2,
            marker: {
                enabled: false,
                radius: 2
            },
            threshold: null,
            softThreshold: true
        },
        line: {
            lineWidth: 2,
            marker: {
                enabled: false,
                radius: 2
            },
        },
        spline: {
            lineWidth: 2,
            marker: {
                enabled: false,
                radius: 2
            },
        },
        areaspline: {
            lineWidth: 2,
            fillOpacity: 0.5,
            marker: {
                enabled: false,
                radius: 2
            },
            threshold: null,
            softThreshold: true
        },
      },

      tooltip: {
          pointFormat: '{point.x:%e %b. %Y}<br><span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br>',
          valueDecimals: 2,
    valueSuffix: '°C',
      split: true,
      shared: true
      },


      series: [{
          name: 'Temp. maxi.',
          type: 'line',
          data: outTemp,
          yAxis: 0
        },{
          name: 'Temp. mini.',
           data: outTemp_min,
           type: 'line',
           yAxis: 0
          },{
            name: 'Direction',
             data: windDir,
             type: 'line',
             yAxis: 1,
             lineWidth: 0,
             marker: {
              enabled: true
            },
             tooltip: {
                 valueDecimals: 0,
           valueSuffix: ' °'
             }, 
             states: {
              hover: {
                  lineWidthPlus: 0
              }
            }
         },{
          name: 'Rafale',
           data: windGust,
           type: 'areaspline',
           yAxis: 2,
           tooltip: {
               valueDecimals: 1,
         valueSuffix: ' km/h'
           }
       },{
        name: 'Vitesse moyenne',
         data: windSpeed,
         type: 'areaspline',
         yAxis: 2,
         tooltip: {
             valueDecimals: 1,
       valueSuffix: ' km/h'
         }
     },{
      name: 'Taux',
       data: rainRate,
       type: 'column',
       yAxis: 3,
       tooltip: {
           valueDecimals: 1,
     valueSuffix: ' mm/h'
       }
   },{
    name: 'Total',
     data: rainTotal,
     type: 'line',
     yAxis: 3,
     tooltip: {
         valueDecimals: 1,
   valueSuffix: ' mm'
     }
 },{
  name: 'Pression',
   data: barometer,
   type: 'line',
   yAxis: 4,
   tooltip: {
       valueDecimals: 1,
 valueSuffix: ' hPa'
   }
}],

      responsive: {
          rules: [{
              condition: {
                  maxWidth: 500
              },
              chartOptions: {
                  chart: {
                      height: 1600
                  }, 
                  title: {
                      text : shortTitle
                  }

              }
          }]
      }

  });

}

}
