import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api' // Import our provider. Also included in charts-week.module.ts file

declare var Highcharts : any;

@IonicPage()
@Component({
  selector: 'page-charts-month',
  templateUrl: 'charts-month.html',
})
export class ChartsMonthPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, private apiProvider: ApiProvider) {}

  data: void;
  weather = [];

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
          this.data = this.showHighchart(outTemp,outTemp_min,windDir,windGust,windSpeed,rainRate,rainTotal,barometer)
        });

  }

  showHighchart(outTemp,outTemp_min,windDir,windGust,windSpeed,rainRate,rainTotal,barometer){
 
//console.log(outTemp);


  Highcharts.setOptions({
       lang: {
         months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
         weekdays: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
       },

    global : {
       useUTC : false
       }

  });

   Highcharts.stockChart('monthChart', {

        chart: {
            height: 1000,
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
        text: 'météo Correns',
        href: 'https://meteo.correns.org'
    },

        rangeSelector: {
            buttons: [{
                type: 'day',
                count: 2,
                text: '1J'
            }, {
                type: 'day',
                count: 7,
                text: '1S'
            }, {
                type: 'week',
                count: 2,
                text: '2S'
            }, {
                type: 'day',
                count: 28,
                text: '1M'
            }],
            selected: 3,
            inputEnabled: false,
            buttonSpacing: 5,
            buttonTheme: {
              width: 30,
              r: 2,
              style: {
                color: '#039',
                fontWeight: 'bold'
              },
            },
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
                text: 'Température (°C)'
            },
            height: '170px',
            lineWidth: 2
          }, { // windDir
            opposite: false,
            labels: {
                align: 'right',
                x: 8
            },
            title: {
                text: 'Direction'
            },
            top: '25%',
            height: '170px',
            offset: 0,
            lineWidth: 2
        }, { // windspeed
          labels: {
              align: 'right',
              x: 8
          },
          title: {
              text: 'Vent'
          },
          top: '25%',
          height: '170px',
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
        height: '170px',
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
      height: '170px',
      offset: 0,
      lineWidth: 2
  }],

        title: {
            text: 'month test'
        },

        subtitle: {
            text: null
        },

        plotOptions: {
            series: {
                showInNavigator: false
            }
        },


        tooltip: {
            pointFormat: '{point.x:%e %b. %H:%M}<br><span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br>',
            valueDecimals: 2,
	    valueSuffix: '°C',
//            split: true
        shared: true
        },


        series: [{
            name: 'Temp. maxi.',
            data: outTemp,
            showInNavigator: true,
            yAxis: 0
          },{
            name: 'Temp. mini.',
             data: outTemp_min,
             yAxis: 0
            },{
              name: 'Direction',
               data: windDir,
               yAxis: 1,
               marker: {
                enabled: true
              },
              lineWidth: 0,
               tooltip: {
                   valueDecimals: 0,
             valueSuffix: ' °'
               }
           },{
            name: 'Rafale',
             data: windGust,
             yAxis: 2,
             tooltip: {
                 valueDecimals: 1,
           valueSuffix: ' km/h'
             }
         },{
          name: 'Vitesse moyenne',
           data: windSpeed,
           yAxis: 2,
           tooltip: {
               valueDecimals: 1,
         valueSuffix: ' km/h'
           }
       },{
        name: 'Taux',
         data: rainRate,
         yAxis: 3,
         tooltip: {
             valueDecimals: 1,
       valueSuffix: ' mm/h'
         }
     },{
      name: 'Total',
       data: rainTotal,
       yAxis: 3,
       tooltip: {
           valueDecimals: 1,
     valueSuffix: ' mm'
       }
   },{
    name: 'Pression',
     data: barometer,
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
                        height: 1150
                    }, 
                    title: {
                        text : 'little title'
                    }

                }
            }]
        }

    });

  }

}
