import { Component, ViewChild } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams, Slides } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-forecast',
  templateUrl: 'forecast.html',
})

export class ForecastPage {
  @ViewChild('slides') slides: Slides;

  weather = [];
  selected = [];
  day = [];
  symbol = [];
  loading: any;

  slideOpts = {
    initialSlide: 2,
    speed: 400
  };
  
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              private apiProvider: ApiProvider) {}
  
  public goToSlide(num) {
    this.slides.slideTo(num, 500);
  }

  public getFirstLiClass(sel) {
    let currentIndex = this.slides.getActiveIndex();
    if (currentIndex == 0) sel = 'active';
     return sel
  }

  slideChanged() {
    let previousIndex = this.slides.getPreviousIndex();
    let currentIndex = this.slides.getActiveIndex();
    if (previousIndex === 0) this.selected[0] = 0;
    else if (currentIndex === 0) this.selected[0] = 1;
    if (previousIndex === 1) this.selected[1] = 0;
    else if (currentIndex === 1) this.selected[1] = 1;
    if (previousIndex === 2) this.selected[2] = 0;
    else if (currentIndex === 2) this.selected[2] = 1;
    if (previousIndex === 3) this.selected[3] = 0;
    else if (currentIndex === 3) this.selected[3] = 1;
    if (previousIndex === 4) this.selected[4] = 0;
    else if (currentIndex === 4) this.selected[4] = 1;
    if (previousIndex == 5) this.selected[5] = 0;
    else if (currentIndex == 5) this.selected[5] = 1;
    if (previousIndex == 6) this.selected[6] = 0;
    else if (currentIndex == 6) this.selected[6] = 1;
    if (previousIndex == 7) this.selected[7] = 0;
    else if (currentIndex == 7) this.selected[7] = 1;
    if (previousIndex == 8) this.selected[8] = 0;
    else if (currentIndex == 8) this.selected[8] = 1;
    if (previousIndex == 9) this.selected[9] = 0;
    else if (currentIndex == 9) this.selected[9] = 1;
    if (previousIndex == 9 && currentIndex == 10) this.selected[9] = 1
    if (previousIndex == 10 && currentIndex < 9) this.selected[9] = 0

  }

  // colorize outTemp class span
  public temp_colorize(temp) {
    if ( temp <= 0 ) {
        var color = "#1278c8";
    } else if ( temp <= -3.8 ) {
      color = "#30bfef";
    } else if ( temp <= 0 ) {
      color = "#1fafdd";
    } else if ( temp <= 4.4 ) {
      color = "rgba(0,172,223,1)";
    } else if ( temp <= 10 ) {
      color = "#71bc3c";
    } else if ( temp <= 12.7 ) {
      color = "rgba(90,179,41,0.8)";
    } else if ( temp <= 18.3 ) {
      color = "rgba(131,173,45,1)";
    } else if ( temp <= 21.1 ) {
      color = "rgba(206,184,98,1)";
    } else if ( temp <= 23.8 ) {
      color = "rgba(255,174,0,0.9)";
    } else if ( temp <= 26.6 ) {
      color = "rgba(255,153,0,0.9)";
    } else if ( temp <= 29.4 ) {
      color = "rgba(255,127,0,1)";
    } else if ( temp <= 32.2 ) {
      color = "rgba(255,79,0,0.9)";
    } else if ( temp <= 35 ) {
      color = "rgba(255,69,69,1)";
    } else if ( temp <= 43.3 ) {
      color = "rgba(255,104,104,1)";
    } else if ( temp >= 43.4 ) {
      color = "rgba(218,113,113,1)";
    }
    //console.log(color)
    return color;
  }


  ionViewDidLoad() {
 
    let loader = this.loadingCtrl.create({
      content: '<h2>Chargement des données</h2>Téléchargement en cours...',
      cssClass: 'custom-loader-class'
    });

    loader.present()

    setTimeout(() => {
      loader.dismiss();
    }, 20000);

    this.apiProvider.getForecast().subscribe(data => { 
      this.weather = data 
       // Short date
       for(let i = 0; i < this.weather['date'].length; i++) {
        this.day.push(this.weather['date'][i]['short']);
        this.symbol.push('<img class="Ficon" src="assets/imgs/yr/' + this.weather['date'][i]['symbol'] + '.png">')
      }
      loader.dismiss()     
    });
    console.log('ionViewDidLoad ForecastPage');
  }

}
