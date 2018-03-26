import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { AddstationsPage } from '../addstations/addstations';
import { StationPage } from '../station/station';

/**
 * Generated class for the LinedetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-linedetail',
  templateUrl: 'linedetail.html',
})
export class LinedetailPage {

  public line;
  public station;
  public stations;
  public hasnext;
  public hasprevious;
  public nextstation = null;
  public prevstation = null;
  public connectedStations;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    public loadingCtrl: LoadingController,
  ) {
    this.line = this.navParams.get('line');
    this.stations = this.navParams.get('stations');
    this.station = this.navParams.get('station');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LinedetailPage');
  }

  ionViewWillEnter(){
    this.main();
  }

  async main(){
    let loader = this.loadingCtrl.create({
      content: 'Loading...',
    })
    loader.present();
    await this.getConnectedStations(this.line.id, this.station.place_id);
    await this.getNextAndPrevStations();
    this.hasnext = this.hasNextStation(this.station);
    this.hasprevious = this.hasPreviousStation(this.station);
    loader.dismiss();
    
  }


  async getConnectedStations(line_id, place_id){
    let url = 'http://kekkaishi.tk/webservice/busserver.php?getconnectedstations&line_id=' + this.line.id + '&place_id=' + this.station.place_id;await this.http.get(url).toPromise().then(res =>{
      this.connectedStations = res.json();
    }) 
  }
  
  addStation(order, line){
    this.navCtrl.push(AddstationsPage, {'order': order, 'line':line, 'stations': this.stations, 'station': this.station})
  }

  async getNextAndPrevStations(){
    let i;
    for (i = 0; i < this.connectedStations.length; i++){
      if (this.station.place_id == this.connectedStations[i].place_id){
        if (i > 0) this.connectedStations[i-1].previous = 1;
        if (i < this.connectedStations.length - 1) this.connectedStations[i+1].next = 1;
        break;
      }
    }
  }

  // return the next station if exist, else return null
  hasNextStation(s){
    let temp = false;
    if (this.connectedStations.length > 1 && s.place_id != this.connectedStations[this.connectedStations.length - 1].place_id){
      temp = true;
    }  
    return temp;
  }

  // return the previous station if exist, else return null
  hasPreviousStation(s){
    let temp = false;
    if (s.place_id != this.connectedStations[0].place_id){
      temp = true;
    }
    return temp;
  }

  goToStation(station){
    this.navCtrl.push(StationPage, {'station': station, 'stations': this.stations});
  }

}
