import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api' // Import our provider. Also included in charts-week.module.ts file

declare var Highcharts : any;

@IonicPage()
@Component({
  selector: 'page-charts-week',
  templateUrl: 'charts-week.html',
})

export class ChartsWeekPage {

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

      this.apiProvider.getJsonWeekCharts().subscribe(data => { 
        this.weather = data;
        console.log(this.weather);
   
        let outTemp = [];
        let dewpoint = [];
        let windchill = [];
        let UV = [];
        let outHumidity = [];
        let barometer = [];
        let windSpeed = [];
        let windGust = [];
        let rain = [];
        let rainRate = [];
        let argensNiv = [];
        let argensDeb = [];
        let chartsTitle = [];
        let chartsLittleTitle = [];
        let sunriseTime = [];
        let sunsetTime = [];
        let plotTodayRise = [];
        let plotTodaySet  = [];
        let plotLastDayRise = [];
        let plotLastDaySet = []; 
        let plotTonightRise = [];
        let plotTonightSet = [];
        let plotLastNightRise = [];
        let plotLastNightSet = [];
        let execTime = [];
   
        if(this.weather['0']['outTemp'].length > 0) {
   
          for(let i = 0; i < this.weather['0']['outTemp'].length; i++) {
            outTemp.push(
              [this.weather['13']['dateTime'][i], this.weather['0']['outTemp'][i]]
            );
          }
   
          for(let i = 0; i < this.weather['1']['dewpoint'].length; i++) {
            dewpoint.push(
              [this.weather['13']['dateTime'][i], this.weather['1']['dewpoint'][i]]
            );
          }
   
          for(let i = 0; i < this.weather['2']['windchill'].length; i++) {
            windchill.push(
              [this.weather['13']['dateTime'][i], this.weather['2']['windchill'][i]]
            );
          }
   
          for(let i = 0; i < this.weather['3']['UV'].length; i++) {
            UV.push(
              [this.weather['13']['dateTime'][i], this.weather['3']['UV'][i]]
            );
          }
   
          for(let i = 0; i < this.weather['4']['outHumidity'].length; i++) {
            outHumidity.push(
              [this.weather['13']['dateTime'][i], this.weather['4']['outHumidity'][i]]
            );
          }
   
          for(let i = 0; i < this.weather['5']['barometer'].length; i++) {
            barometer.push(
              [this.weather['13']['dateTime'][i], this.weather['5']['barometer'][i]]
            );
          }
   
          for(let i = 0; i < this.weather['6']['windSpeed'].length; i++) {
            windSpeed.push(
              [this.weather['13']['dateTime'][i], this.weather['6']['windSpeed'][i]]
            );
          }
   
          for(let i = 0; i < this.weather['7']['windGust'].length; i++) {
            windGust.push(
              [this.weather['13']['dateTime'][i], this.weather['7']['windGust'][i]]
            );
          }
   
          if(this.weather['8']['rain'][0] != null) {
            for(let i = 0; i < this.weather['8']['rain'].length; i++) {
              rain.push(
                [this.weather['8']['rain'][i]['0'], this.weather['8']['rain'][i]['1']]
              );
            }
          }
   
          if(this.weather['9']['rainRate'][0] != null) {
            for(let i = 0; i < this.weather['9']['rainRate'].length; i++) {
              rainRate.push(
                [this.weather['9']['rainRate'][i]['0'], this.weather['9']['rainRate'][i]['1']]
              );
            }
          }
   
          for(let i = 0; i < this.weather['10']['argensNiv'].length; i++) {
            argensNiv.push(
              [this.weather['14']['dateHydro'][i], this.weather['10']['argensNiv'][i]]
            );
          }
   
          for(let i = 0; i < this.weather['11']['argensDeb'].length; i++) {
            argensDeb.push(
              [this.weather['14']['dateHydro'][i], this.weather['11']['argensDeb'][i]]
            );
          }
   
          chartsTitle = this.weather['12']['chartsTitle'].toUpperCase()
   //       this.chartsTitle = this.weather['12']['chartsTitle']
          chartsLittleTitle = this.weather['12']['chartsLittleTitle']
          sunriseTime = this.weather['12']['sunriseTime']
          sunsetTime = this.weather['12']['sunsetTime']
          plotTodayRise = this.weather['12']['plotTodayRise']
          plotTodaySet = this.weather['12']['plotTodaySet']
          plotLastDayRise = this.weather['12']['plotLastDayRise']
          plotLastDaySet = this.weather['12']['plotLastDaySet']
          plotTonightRise = this.weather['12']['plotTonightRise']
          plotTonightSet = this.weather['12']['plotTonightSet']
          plotLastNightRise = this.weather['12']['plotLastNightRise']
          plotLastNightSet = this.weather['12']['plotLastNightSet']
          execTime = this.weather['12']['execTime']
   
          loader.dismiss()

          }
          this.data = this.showHighchart(outTemp,dewpoint,windchill,UV,outHumidity,barometer,windSpeed,windGust,rain,rainRate,argensNiv,argensDeb,chartsTitle,chartsLittleTitle,sunriseTime,sunsetTime,plotTodayRise,plotTodaySet,plotLastDayRise,plotLastDaySet,plotTonightRise,plotTonightSet,plotLastNightRise,plotLastNightSet,execTime)
        });

  }

  showHighchart(outTemp,dewpoint,windchill,UV,outHumidity,barometer,windSpeed,windGust,rain,rainRate,argensNiv,argensDeb,chartsTitle,chartsLittleTitle,sunriseTime,sunsetTime,plotTodayRise,plotTodaySet,plotLastDayRise,plotLastDaySet,plotTonightRise,plotTonightSet,plotLastNightRise,plotLastNightSet,execTime){
 
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

   Highcharts.stockChart('weekChart', {

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
        text: execTime,
        href: 'https://meteo.correns.org'
    },

        rangeSelector: {
            buttons: [{
                type: 'hour',
                count: 24,
                text: '1J'
            }, {
                type: 'hour',
                count: 48,
                text: '2J'
            }, {
                type: 'day',
                count: 4,
                text: '4J'
            }, {
                type: 'day',
                count: 7,
                text: '7J'
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
        plotBands: [{ // mark the daylight
            color: '#FCFFC5',
            from: plotTodayRise,
            to: plotTodaySet
	},{
            color: '#FCFFC5',
            from: plotLastDayRise,
            to: plotLastDaySet
        },{
            color: '#ccccff',
            from: plotTonightRise,
            to: plotTonightSet

        },{
            color: '#ccccff',
            from: plotLastNightRise,
            to: plotLastNightSet
        }],
        plotLines: [{
            color: '#D3D3D3',
            width: 1,
            dashStyle: 'shortdash',
            value: sunsetTime,
            zIndex: 1,
            label: {
               text: 'Coucher de soleil'
            }

        }, {
            color: '#D3D3D3',
            width: 1,
            dashStyle: 'shortdash',
            value: sunriseTime,
            zIndex: 1,
            label: {
               text: 'Lever de soleil'
            }
        }]
    },

        yAxis: [{
            labels: {
                align: 'right',
                x: -3
            },
            title: {
                text: 'Température (°C)'
            },
            height: '170px',
            lineWidth: 2
        }, {
            opposite: false,
            labels: {
                align: 'right',
                x: 8
            },
            title: {
                text: 'Index UV'
            },
            height: '170px',
            offset: 0,
            lineWidth: 2

        }, {
            opposite: true,
            labels: {
                align: 'right',
                x: -3
            },
            title: {
                text: 'Humidité (%)'
            },
            top: '25%',
            height: '170px',
            offset: 0,
            lineWidth: 2
        }, {
            opposite: false,
            labels: {
                align: 'right',
                x: 25
            },
            title: {
                text: 'pression (hPa)'
            },
            top: '25%',
            height: '170px',
            offset: 0,
            lineWidth: 2
        }, {
            opposite: true,
            labels: {
                align: 'right',
                x: -3
            },
            title: {
                text: 'Vitesse Vent (km/h)'
            },
            top: '50%',
            height: '170px',
            offset: 0,
            lineWidth: 2
        }, {
            opposite: true,
            labels: {
                align: 'right',
                x: -3
            },
            title: {
                text: 'Pluie (mm)'
            },
            top: '75%',
            height: '170px',
            offset: 0,
            lineWidth: 2
        }, {
            opposite: true,
            labels: {
		enabled: false,
                align: 'right',
                x: 33
            },
            title: {
                text: null
            },
            top: '75%',
            height: '170px',
            offset: 0,
            lineWidth: 2
        }, {
            opposite: false,
            labels: {
                align: 'right',
                x: 20
            },
            title: {
                text: 'Hauteur (m)'
            },
            top: '75%',
            height: '170px',
            offset: 0,
            lineWidth: 2
        }, {
            opposite: false,
            labels: {
                enabled :false,
                align: 'right',
                x: 0
            },
            title: {
                text: null
            },
            top: '75%',
            height: '170px',
            offset: 0,
            lineWidth: 2

        }],

        title: {
            text: chartsTitle
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
            name: 'Temp. extérieure',
            data: outTemp,
            showInNavigator: true,
            yAxis: 0

        },{
           name: 'Point de rosée',
            data: dewpoint,
            yAxis: 0
        },{
           name: 'Refroid. éolien',
            data: windchill,
            yAxis: 0
        },{
           name: 'Indice UV',
            data: UV,
            yAxis: 1,
            showInNavigator: false,
            lineWidth: 1,
            tooltip: {
                valueDecimals: 1,
                valueSuffix: ''
            },
           states: {
                hover: {
                    lineWidthPlus: 1
                }
            }
        },{
           name: 'Humidité extérieure',
            data: outHumidity,
            yAxis: 2,
            tooltip: {
                valueDecimals: 0,
	        valueSuffix: '%'
            }
        },{
           name: 'Pression',
            data: barometer,
            yAxis: 3,
            tooltip: {
                valueDecimals: 1,
                valueSuffix: ' hPa'
            }
        },{
           name: 'Vent',
            data: windSpeed,
            yAxis: 4,
            tooltip: {
                valueDecimals: 1,
                valueSuffix: ' km/h'
            }
        },{
           name: 'Rafale',
            data: windGust,
            yAxis: 4,
            lineWidth: 0,
            marker: {
                enabled: true,
                radius: 3
            },
            tooltip: {
                valueDecimals: 1,
                valueSuffix: ' km/h'
            },
           states: {
                hover: {
                    lineWidthPlus: 0
                }
            }

        },{
           name: 'Pluie',
            data: rain,
            yAxis: 5,
            type: 'column',
            tooltip: {
                valueDecimals: 1,
                valueSuffix: ' mm'
            }
       },{
           name: 'Taux de pluie',
            data: rainRate,
            yAxis: 6,
            lineWidth: 0,
            marker: {
                enabled: true,
                radius: 4
            },
            tooltip: {
                valueDecimals: 1,
                valueSuffix: ' mm/h'
            },
           states: {
                hover: {
                    lineWidthPlus: 0
                }
            }
        },{
           name: 'Hauteur Argens',
            data: argensNiv,
            yAxis: 7,
            tooltip: {
                valueDecimals: 2,
                valueSuffix: ' m'
            }
        },{
           name: 'Débit Argens',
            data: argensDeb,
            yAxis: 8,
            lineWidth: 0,
            marker: {
                enabled: true,
                radius: 3
            },
            tooltip: {
                valueDecimals: 2,
                valueSuffix: ' m3'
            },
           states: {
                hover: {
                    lineWidthPlus: 0
                }
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
                        text : chartsLittleTitle
                    }

                }
            }]
        }

    });

  }

}
