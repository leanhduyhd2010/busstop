import { Component } from '@angular/core';
import { NavController, Platform, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';
import { StationPage } from '../station/station';
import { GoogleMaps, GoogleMap, GoogleMapOptions, GoogleMapsEvent, Marker } from '@ionic-native/google-maps';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public stations;
  public map: GoogleMap;

  constructor(public navCtrl: NavController,
    public platform: Platform,
    public http: Http,
    public geolocation: Geolocation,
    public loadingCtrl: LoadingController,
  ) {

  }

  ionViewDidLoad(){
    //when the platform is ready
    this.platform.ready().then(()=>{
      console.log("Platform is ready!");
      this.main();

    })
  }

  main(){
    let loader = this.loadingCtrl.create({
      content: 'Loading...',
    })
    loader.present();

    this.geolocation.getCurrentPosition().then(async resp =>{
      let lat = resp.coords.latitude;
      let lon = resp.coords.longitude;
      await this.getBusStation(lat, lon);
      this.addStationsToServer();
      this.loadMap(lat, lon);
      loader.dismiss();
    })
  }

  async getBusStation(lat, lon){
    var url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyAz1AstogSiussrD_NjAtYD8yCaJKFUuQE&type=bus_station&rankby=distance&location=' + lat + ',' + lon;
    await this.http.get(url).toPromise().then(res=>{
      this.stations = res.json().results;
    })
  }

  addStationsToServer(){
    for (var i = 0; i < this.stations.length;i++){
      let place_id = this.stations[i].place_id;
      let name = this.stations[i].name;
      let lat = this.stations[i].geometry.location.lat;
      let lon = this.stations[i].geometry.location.lng;
      var url = 'http://kekkaishi.tk/webservice/busserver.php?addstation&place_id=' + place_id + '&name=' + name + '&lat='+lat+'&lon='+lon;
      this.http.get(url).toPromise().then(str=>{
        console.log('Added stations to server!');
      });
    }
  }

  loadMap(lat, lon){
    
    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: lat,
          lng: lon
        },
        zoom: 18,
        tilt: 30
      }
    };

    this.map = GoogleMaps.create('map_canvas', mapOptions);
    


    this.map.one(GoogleMapsEvent.MAP_READY).then(() =>{
      console.log('Map is ready!');

      // Now can use all method safely
      this.map.addMarker({
        title: 'You are here',
        icon: 'blue',
        animation: 'DROP',
        position:{
          lat: lat,
          lng: lon
        }
      }).then((marker: Marker) =>{
        marker.showInfoWindow();
      })
    });
  }

  getBuses(station){
    this.navCtrl.push(StationPage, {'station': station, 'stations': this.stations})
  }

  refreshPage(){
    this.main();
  }

}
