import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ActionSheetController, Navbar } from 'ionic-angular';
import { Http } from '@angular/http';
import { BackgroundMode } from '@ionic-native/background-mode';
import { AddlinePage } from '../addline/addline';
import { LinedetailPage } from '../linedetail/linedetail';

import 'rxjs/add/operator/toPromise';


/**
 * Generated class for the StationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-station',
  templateUrl: 'station.html',
})
export class StationPage {

  @ViewChild(Navbar) navBar: Navbar;
  public stations;
  public station;
  public lines;
  public passedbus = false;
  public connectedStations;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public http: Http,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public backgroundMode: BackgroundMode,
    public actionSheetCtrl: ActionSheetController,
  ) {
    this.station = this.navParams.get('station');
    this.stations = this.navParams.get('stations');
  }

  async ionViewDidLoad() {
    console.log('ionViewDidLoad StationPage');
   this.navBar.backButtonClick = (e:UIEvent) => {
     console.log('BACKBUTTON CLICKED!');
     this.navCtrl.popToRoot();
   }
  }



  ionViewDidEnter(){
    this.main()
  }

  async main(){
    let loader = this.loadingCtrl.create({
      content: 'Getting the buses...',
    })
    loader.present();
    await this.getLines();
    await this.getBusStatus();

    
  
    loader.dismiss();
  }

  refreshPage(){
    this.main();
  }

  async getLines(){
    var url = 'http://kekkaishi.tk/webservice/busserver.php?getlines&place_id=' + this.station.place_id;
    await this.http.get(url).toPromise().then(data=>{
      this.lines = data.json();
    })
  }


  async getBusStatus(){
    var i;
    for (i = 0; i< this.lines.length; i++){
      let url = 'http://kekkaishi.tk/webservice/busserver.php?getbustime&line_id=' + this.lines[i].id + '&place_id=' + this.station.place_id;
      await this.http.get(url).toPromise().then(res=>{
        this.lines[i].time = res.text();
      })
    }
  }

  async getConnectedStations(line){
    let url = 'http://kekkaishi.tk/webservice/busserver.php?getconnectedstations&line_id=' + line.id + '&place_id=' + this.station.place_id;await this.http.get(url).toPromise().then(res =>{
      this.connectedStations = res.json();
    }) 
  }


  toAddBusPage(){
    this.navCtrl.push(AddlinePage, {'station': this.station});
  }

  setBusPassed(line){
    var url = 'http://kekkaishi.tk/webservice/busserver.php?addbus&line_id=' + line.id + '&place_id=' + this.station.place_id;
    this.http.get(url).toPromise().then(async data=>{
      await this.main();
      /*
      setTimeout(()=>{
        url = url.replace('add','remove');
        this.http.get(url).toPromise().then(async str=>{
          await this.main();
        });
        
      }, timedelay)
      */
    });     
  }

  cancelPassed(line){
    var url = 'http://kekkaishi.tk/webservice/busserver.php?removebus&line_id=' + line.id + '&place_id=' + this.station.place_id;
    this.http.get(url).toPromise().then(async data =>{
      await this.main();
    })
  }

  async addStationInLine(line){
    /*
    console.log(this.hasStation('next', line));
    let actionsheet = this.actionSheetCtrl.create({
      title: 'Add stations for this bus',
      buttons:[
        {
          text: await this.hasStation('next', line) == 'false' ? 'Add next station' : 'Already has next station',
          icon: 'add',
          handler: () =>{
            this.navCtrl.push(AddstationsPage, {'order': 'next', 'stations': this.stations, 'station': this.station, 'line': line});
          }
        },
        {
          text: await this.hasStation('previous', line) == 'false' ? 'Add previous station' : 'Already has previous station',
          icon: 'add',
          handler: () =>{
            this.navCtrl.push(AddstationsPage, {'order': 'previous', 'stations': this.stations, 'station': this.station, 'line': line});
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          icon: 'close',
          handler: ()=>{

          }
        }
      ]
    });
    actionsheet.present();
    */

    this.navCtrl.push(LinedetailPage, {'line': line, 'stations': this.stations, 'station': this.station});
  }

  hasStation(order, line):string{
    var temp = 'false';
    if (order == 'next'){
      let url = 'http://kekkaishi.tk/webservice/busserver.php?hasnextstation&line_id=' + line.id + '&place_id=' + line.place_id;
      this.http.get(url).toPromise().then(async data =>{
        
        temp = data.text();
      })
    }
    else if (order == 'previous'){
      let url = 'http://kekkaishi.tk/webservice/busserver.php?haspreviousstation&line_id=' + line.id + '&place_id=' + line.place_id;
      this.http.get(url).toPromise().then(data =>{
        
        temp = data.text();
      })
    }
    return temp;
  }

  checkElementInArray(ele, array){
    var i;
    var temp = -1;
    for (i = 0; i < array.length; i++){
      if (ele == array[i]){
        temp = i;
        break;
      }
    }
    return temp;
  }

  
}
