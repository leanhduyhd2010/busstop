import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';
import { BackgroundMode } from '@ionic-native/background-mode';
import { GoogleMaps } from '@ionic-native/google-maps';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AddstationsPage } from '../pages/addstations/addstations';
import { AddlinePage } from '../pages/addline/addline';
import { StationPage } from '../pages/station/station';
import { LinedetailPage } from '../pages/linedetail/linedetail';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AddstationsPage,
    AddlinePage,
    StationPage,
    LinedetailPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AddstationsPage,
    AddlinePage,
    StationPage,
    LinedetailPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    BackgroundMode,
    GoogleMaps,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
