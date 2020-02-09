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
