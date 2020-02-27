import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api' // Import our provider. Also included in charts.module.ts file
import * as HighStock from 'highcharts/highstock';
import * as moment from 'moment';
import 'moment/locale/fr';

@IonicPage()
@Component({
  selector: 'page-charts',
  templateUrl: 'charts.html',
})

export class ChartsPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              private apiProvider: ApiProvider) {}

  data: void;
  dateTime : number;
  longTitle : string;
  shortTitle : string;
  weather = [];

  ionViewDidLoad() {

    let loader = this.loadingCtrl.create({
        content: '<h2>Chargement des données</h2>Téléchargement en cours...',
        duration: 20000
      });
      loader.present()

      this.apiProvider.getJsonDayCharts().subscribe(data => { 
        this.weather = data;
        console.log(this.weather);
   
        let outTemp = [];
        let dewpoint = [];
        let windDir = [];
        let windGust = [];
        let windSpeed = [];
        let rainRate = [];
        let rainTotal = [];
        let barometer = [];
        let UV = [];

        if(this.weather['temperature']['series']['outTemp']['data'].length > 0) {
            // dateTime
            this.dateTime = this.weather['temperature']['series']['outTemp']['data']['0']['0'] / 1000;
            this.shortTitle = moment.unix(this.dateTime).format('dddd Do MMMM YYYY');
            this.longTitle = moment.unix(this.dateTime).format('dddd Do MMMM YYYY') + ' depuis minuit';
            }      
   
        if(this.weather['temperature']['series']['outTemp']['data'].length > 0) {
          // outTemp
          for(let i = 0; i < this.weather['temperature']['series']['outTemp']['data'].length; i++) {
            outTemp.push(
              [this.weather['temperature']['series']['outTemp']['data'][i]['0'], this.weather['temperature']['series']['outTemp']['data'][i]['1']]
            );
          }
          // dewpoint
          for(let i = 0; i < this.weather['temperature']['series']['dewpoint']['data'].length; i++) {
            dewpoint.push(
              [this.weather['temperature']['series']['dewpoint']['data'][i]['0'], this.weather['temperature']['series']['dewpoint']['data'][i]['1']]
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
          // UV
          for(let i = 0; i < this.weather['rayonnement_solaire_et_uv']['series']['UV']['data'].length; i++) {
            UV.push(
              [this.weather['rayonnement_solaire_et_uv']['series']['UV']['data'][i]['0'], this.weather['rayonnement_solaire_et_uv']['series']['UV']['data'][i]['1']]
            );
          }
          setTimeout(() => {
            loader.dismiss();
          }, 500);
          }
          this.data = this.showHighchart(outTemp,dewpoint,windDir,windGust,windSpeed,rainRate,rainTotal,barometer,UV,this.shortTitle,this.longTitle)
  
        });
  }
  showHighchart(outTemp,dewpoint,windDir,windGust,windSpeed,rainRate,rainTotal,barometer,UV,shortTitle,longTitle){
  
  
      HighStock.chart('chartsDay', {
  chart: {
          height: 1450,
          styledMode: true,
          marginLeft: 45,
          marginRight: 45

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
          type: 'hour',
          count: 1,
          text: '1h'
      }, {
          type: 'hour',
          count: 2,
          text: '2h'
      }, {
          type: 'hour',
          count: 6,
          text: '6h'
      },{
          type: 'all',
          text: 'Tout'
      }],
      buttonTheme: {
          width: 25
      },
      selected: 3,
      inputEnabled: false
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
  
  xAxis: {
      type: 'datetime',
      crosshair: true
  },
  
      yAxis: [{
          title: {
              text: 'Température',
              rotation: 0,
              textAlign: 'left',
              x:10,
              y:-142
          },
          height: '250px',
          offset: 0,
          lineWidth: 2
        },{ // UV
          title: {
              text: null
          },
          height: '250px',
          opposite: true,
          offset: 0,
          lineWidth: 2
        },{ // windspeed
        title: {
            text: 'Vent',
            rotation: 0,
            textAlign: 'left',
            x:12,
            y:-150
        },
        top: '25%',
        height: '250px',
        offset: 0,
        lineWidth: 2
  
    },{ // rain
      title: {
          text: 'Pluie',
          rotation: 0,
          textAlign: 'left',
          //x:26,
          y:-150
      },
      top: '50%',
      height: '250px',
      offset: 0,
      lineWidth: 2
  
  },{ // RainRate
    title: {
        text: null,
    },
    top: '50%',
    height: '250px',
    opposite: true,
    offset: 0,
    lineWidth: 2
  }, { // barometer
    title: {
        text: 'Baromètre',
        rotation: 0,
        textAlign: 'left',
        x:12,
        y:-150
    },
    top: '75%',
    height: '250px',
    offset: -12,
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
              showInNavigator: false,
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
        pointFormat: '{point.x:%e %b. %Y %H:%M}<br><span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br>',
        valueDecimals: 2,
        valueSuffix: '°C',
        split: true
      },
  
      series: [{
          name: 'Température.',
          data: outTemp,
          type: 'line',
          showInNavigator: true,
          yAxis: 0
        },{
          name: 'Point de rosée',
           data: dewpoint,
           type: 'line',
           yAxis: 0
          },{
            name: 'UV',
             data: UV,
             type: 'line',
             lineWidth: 1,
             yAxis: 1,
             tooltip: {
              valueDecimals: 1,
        valueSuffix: ''
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
        name: 'Vitesse',
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
                      text : shortTitle
                  }
  
              }
          }]
      }
  
      });
    }
  }
