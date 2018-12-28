import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
// API:
import { ApiProvider } from '../../providers/api/api' // Import our provider. Also included in home.module.ts file
import { Slides } from 'ionic-angular';
import { ViewChild } from '@angular/core';

@IonicPage()
@Component({
  selector: 'page-forecast',
  templateUrl: 'forecast.html',
})

export class ForecastPage {
  weather = []; /* declare live as array */
  @ViewChild('slides') slides: Slides;
  selected0: any; selected1: any; selected2: any; selected3: any; selected4: any; selected5: any; selected6: any; selected7: any; selected8: any; selected9: any;
  day0: any; day1: any; day2: any; day3: any; day4: any; day5: any; day6: any; day7: any; day8: any; day9: any;
  symbol0: any; symbol1: any; symbol2: any; symbol3: any; symbol4: any; symbol5: any; symbol6: any; symbol7: any; symbol8: any; symbol9: any;
  loading: any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,private apiProvider: ApiProvider) {
    // this.navCtrl = navCtrl;
  }

  public goToSlide(num) {
    this.slides.slideTo(num, 500);
  }

  public getFirstLiClass(selected) {
    let currentIndex = this.slides.getActiveIndex();
    if (currentIndex == 0) selected = 'active';
     return selected
  }
  
  slideChanged() {
    let previousIndex = this.slides.getPreviousIndex();
    let currentIndex = this.slides.getActiveIndex();
    if (previousIndex == 0) this.selected0 = 0;
    else if (currentIndex == 0) this.selected0 = 1;
    if (previousIndex == 1) this.selected1 = 0;
    else if (currentIndex == 1) this.selected1 = 1;
    if (previousIndex == 2) this.selected2 = 0;
    else if (currentIndex == 2) this.selected2 = 1;
    if (previousIndex == 3) this.selected3 = 0;
    else if (currentIndex == 3) this.selected3 = 1;
    if (previousIndex == 4) this.selected4 = 0;
    else if (currentIndex == 4) this.selected4 = 1;
    if (previousIndex == 5) this.selected5 = 0;
    else if (currentIndex == 5) this.selected5 = 1;
    if (previousIndex == 6) this.selected6 = 0;
    else if (currentIndex == 6) this.selected6 = 1;
    if (previousIndex == 7) this.selected7 = 0;
    else if (currentIndex == 7) this.selected7 = 1;
    if (previousIndex == 8) this.selected8 = 0;
    else if (currentIndex == 8) this.selected8 = 1;
    if (previousIndex == 9) this.selected9 = 0;
    else if (currentIndex == 9) this.selected9 = 1;

    //console.log('prev', previousIndex);
    //console.log('current', currentIndex);
  }

  ionViewDidLoad() {
 
    let loader = this.loadingCtrl.create({
      content: '<h2>Chargement des données</h2>Téléchargement en cours...'
    });

    loader.present()

    setTimeout(() => {
      loader.dismiss();
    }, 20000);

    this.apiProvider.getForecast().subscribe(data => { 
      this.weather = data 
      this.day0 = this.weather['date']['0']['short']
      this.day1 = this.weather['date']['1']['short']
      this.day2 = this.weather['date']['2']['short']
      this.day3 = this.weather['date']['3']['short']
      this.day4 = this.weather['date']['4']['short']
      this.day5 = this.weather['date']['5']['short']
      this.day6 = this.weather['date']['6']['short']
      this.day7 = this.weather['date']['7']['short']
      this.day8 = this.weather['date']['8']['short']
      this.day9 = this.weather['date']['9']['short']
      this.symbol0 = '<img class="Ficon" src="assets/imgs/yr/' + this.weather['date']['0']['symbol'] + '.png">'
      this.symbol1 = '<img class="Ficon" src="assets/imgs/yr/' + this.weather['date']['1']['symbol'] + '.png">'
      this.symbol2 = '<img class="Ficon" src="assets/imgs/yr/' + this.weather['date']['2']['symbol'] + '.png">'
      this.symbol3 = '<img class="Ficon" src="assets/imgs/yr/' + this.weather['date']['3']['symbol'] + '.png">'
      this.symbol4 = '<img class="Ficon" src="assets/imgs/yr/' + this.weather['date']['4']['symbol'] + '.png">'
      this.symbol5 = '<img class="Ficon" src="assets/imgs/yr/' + this.weather['date']['5']['symbol'] + '.png">'
      this.symbol6 = '<img class="Ficon" src="assets/imgs/yr/' + this.weather['date']['6']['symbol'] + '.png">'
      this.symbol7 = '<img class="Ficon" src="assets/imgs/yr/' + this.weather['date']['7']['symbol'] + '.png">'
      this.symbol8 = '<img class="Ficon" src="assets/imgs/yr/' + this.weather['date']['8']['symbol'] + '.png">'
      this.symbol9 = '<img class="Ficon" src="assets/imgs/yr/' + this.weather['date']['9']['symbol'] + '.png">'
      loader.dismiss()
     
      //this.weather['icon'] = '<i class="wi ' + this.weather['icon'] + '"></i>'
    }); // Loading the Data
  
    console.log('ionViewDidLoad ForecastPage');
  }

}
