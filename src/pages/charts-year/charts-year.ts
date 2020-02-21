import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api' // Import our provider. Also included in charts-week.module.ts file
import * as HighStock from 'highcharts/highstock';
import * as moment from 'moment';
import 'moment/locale/fr';

@IonicPage()
@Component({
  selector: 'page-charts-year',
  templateUrl: 'charts-year.html',
})
export class ChartsYearPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              private apiProvider: ApiProvider) {}

  data: void;
  dateTime : number;
  longTitle : string;
  //shortTitle : string;
  weather = []

  ionViewDidLoad() {

    let loader = this.loadingCtrl.create({
        content: '<h2>Chargement des données</h2>Téléchargement en cours...',
        duration: 20000
      });
  
      loader.present()

      this.apiProvider.getJsonYearCharts().subscribe(data => { 
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
          // dateTime
          this.dateTime = this.weather['temperature']['series']['outTemp']['data']['0']['0'] / 1000;
          //this.shortTitle = moment.unix(this.dateTime).format('dddd Do MMMM YYYY');
          this.longTitle = 'Année ' + moment.unix(this.dateTime).format('YYYY');
          }   
   
        if(this.weather['temperature']['series']['outTemp']['data'].length > 0) {
          // outTemp
          for(let i = 0; i < this.weather['temperature']['series']['outTemp']['data'].length; i++) {
            outTemp.push(
              [this.weather['temperature']['series']['outTemp']['data'][i]['0'], this.weather['temperature']['series']['outTemp']['data'][i]['1']]
            );
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
          setTimeout(() => {
            loader.dismiss();
          }, 500);
          }
          this.data = this.showHighchart(outTemp,outTemp_min,windDir,windGust,windSpeed,rainRate,rainTotal,barometer,this.longTitle)
        });

  }

  showHighchart(outTemp,outTemp_min,windDir,windGust,windSpeed,rainRate,rainTotal,barometer,longTitle){
 

    HighStock.chart('chartsYear', {

        chart: {
          height: 1450,
          styledMode: true,
          marginLeft: 45,
          marginRight: 45
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
      verticalAlign: 'top',
      buttonPosition: {
        align: 'right'
      },
      x:-40,
      y:5,
      buttons: [{
        type: 'day',
        count: 14,
        text: '14j'
    }, {
        type: 'month',
        count: 1,
        text: '1m'
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
          // temp
            title: {
                text: 'Température',
                rotation: 0,
                x:75,
                y:-142
            },
            height: '250px',
            offset:0,
            lineWidth: 2
          }, { // windDir
            opposite: true,
            title: {
                text: null
            },
            top: '25%',
            height: '250px',
            offset: 0
        }, { // windspeed
          title: {
              text: 'Vent',
              rotation: 0,
              x:40,
              y:-150
          },
          top: '25%',
          height: '250px',
          offset: 0,
          lineWidth: 2

      }, { // rain
        title: {
            text: 'Pluie',
            rotation: 0,
            x:36,
            y:-150
        },
        top: '50%',
        height: '250px',
        offset: 0,
        lineWidth: 2

    },{
      // rainRate
      title: {
          text: null
      },
      top: '50%',
      height: '250px',
      opposite: true,
      offset:0,
      lineWidth: 2
    },{ // barometer
      title: {
          text: 'Baromètre',
          rotation: 0,
          x:75,
          y:-150
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
       yAxis: 4,
       tooltip: {
           valueDecimals: 1,
     valueSuffix: ' mm'
       }
   },{
    name: 'Pression',
     data: barometer,
     type: 'line',
     yAxis: 5,
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
                        height: 1450
                    }, 
                    title: {
                        text : longTitle
                    }

                }
            }]
        }

    });

  }

}
