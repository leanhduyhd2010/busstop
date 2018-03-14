import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { AddstationsPage } from '../addstations/addstations';

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
  ) {
    this.line = this.navParams.get('line');
    this.stations = this.navParams.get('stations');
    this.station = this.navParams.get('station');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LinedetailPage');
    
  }

  ionViewDidEnter(){
    this.main()
  }

  async main(){
    await this.getConnectedStations(this.line.id, this.station.place_id);

  }


  async getConnectedStations(line_id, place_id){
    let url = 'http://localhost:81/webservice/busserver.php?getconnectedstations&line_id=' + this.line.id + '&place_id=' + this.station.place_id;await this.http.get(url).toPromise().then(res =>{
      this.connectedStations = res.json();
    }) 
  }
  
  addStation(order, line){
    this.navCtrl.push(AddstationsPage, {'order': order, 'line':line, 'stations': this.stations, 'station': this.station})
  }

}
