import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Http } from '@angular/http';

/**
 * Generated class for the AddbusesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-addbuses',
  templateUrl: 'addbuses.html',
})
export class AddbusesPage {

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
    var url = 'http://kekkaishi.tk/webservice/busserver.php?addbus&place_id=' + this.station.place_id + '&number=' + this.number + '&direction=' + this.direction;
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
