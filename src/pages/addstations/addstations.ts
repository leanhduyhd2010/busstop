import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Http } from '@angular/http';

/**
 * Generated class for the AddstationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-addstations',
  templateUrl: 'addstations.html',
})
export class AddstationsPage {

  public order;
  public station;
  public stations;
  public line;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    public toastCtrl: ToastController,
  
  ) {
    this.order = this.navParams.get('order');
    this.stations = this.navParams.get('stations');
    this.line = this.navParams.get('line');
    this.station = this.navParams.get('station');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddstationsPage');
  }

  addStation(station){
    // add next station
    if (this.order == 'next'){
      let place_id = this.station.place_id;
      let next_place_id = station.place_id;
      let line_id = this.line.id;

      let url = 'http://localhost:81/webservice/busserver.php?addnextstation&line_id=' + line_id + '&place_id=' + place_id + '&next_place_id=' + next_place_id + '&number=' + this.line.number + '&direction=' + this.line.direction;
      this.http.get(url).toPromise().then(data =>{
        const toast = this.toastCtrl.create({
          message: data.text(),
          showCloseButton: true,
          closeButtonText: 'OK',
        })
        toast.present();
        this.navCtrl.pop();
      })
    }
    else if (this.order == 'previous'){
      let place_id = this.station.place_id;
      let previous_place_id = station.place_id;
      let line_id = this.line.id;

      let url = 'http://localhost:81/webservice/busserver.php?addpreviousstation&line_id=' + line_id + '&place_id=' + place_id + '&previous_place_id=' + previous_place_id + '&number=' + this.line.number + '&direction=' + this.line.direction;
      this.http.get(url).toPromise().then(data =>{
        const toast = this.toastCtrl.create({
          message: data.text(),
          showCloseButton: true,
          closeButtonText: 'OK',
        })
        toast.present();
        this.navCtrl.pop();
      })
    }
    
  }
}
