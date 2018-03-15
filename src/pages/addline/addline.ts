import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Http } from '@angular/http';

/**
 * Generated class for the AddlinePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-addline',
  templateUrl: 'addline.html',
})
export class AddlinePage {


  public number;
  public direction;
  public station;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public http: Http,
    public toastCtrl: ToastController,
  ) {
    this.station = this.navParams.get('station');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddbusesPage');
    
  }

  addBus(){
    console.log(this.number);
    var url = 'http://kekkaishi.tk/webservice/busserver.php?addstationtoline&place_id=' + this.station.place_id + '&number=' + this.number + '&direction=' + this.direction;
    console.log(url);
    this.http.get(url).toPromise().then(resp=>{
      var data:string =resp.text();
      const toast = this.toastCtrl.create({
        message: data,
        showCloseButton: true,
        closeButtonText: 'OK',
        

      })
      toast.present();
      this.navCtrl.pop();
    });
    
  }

}
