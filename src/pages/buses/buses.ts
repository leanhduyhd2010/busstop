import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { AddbusesPage } from '../addbuses/addbuses';

/**
 * Generated class for the BusesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-buses',
  templateUrl: 'buses.html',
})
export class BusesPage {

  public station;
  public buses;
  public passed = true;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public http: Http,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
  ) {
    this.station = this.navParams.get('station');
  }

  async ionViewDidLoad() {
    console.log('ionViewDidLoad BusesPage');
    
  }

  async ionViewDidEnter(){
    let loader = this.loadingCtrl.create({
      content: 'Getting the buses...',
    })
    loader.present();
    await this.getBuses();
    loader.dismiss();
  }

  async getBuses(){
    var url = 'http://kekkaishi.tk/webservice/busserver.php?getbuses&place_id=' + this.station.place_id;
    await this.http.get(url).toPromise().then(data=>{
      this.buses = data.json();
    })
  }

  toAddBusPage(){
    this.navCtrl.push(AddbusesPage, {'station': this.station});
  }

  busPassed(bus){
    let timedelay = 5000;
    let confirm = this.alertCtrl.create({
      title: 'This bus just passed by?',
      message: 'Did you just see this bus passed by this station?',
      buttons: [
        {
          text: 'No',
          handler: ()=>{
            console.log('No clicked!');
          }
        },
        {
          text: 'Yes',
          handler: () =>{
            var url = 'http://kekkaishi.tk/webservice/busserver.php?setactive&place_id=' + this.station.place_id + '&number=' + bus.number + '&direction=' + bus.direction;
            this.http.get(url).toPromise().then(async data=>{
              await this.getBuses();
              setTimeout(()=>{
                url = url.replace('setactive','removeactive');
                this.http.get(url).toPromise().then(async str=>{
                  await this.getBuses();
                });
                
              }, timedelay)
            });
          }
        }
      ]
    });
    confirm.present();
  }

}
