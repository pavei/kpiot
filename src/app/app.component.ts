import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {TabsPage} from '../pages/tabs/tabs';
import {UserStorageService} from "../util/user.storage.service";
import {TranslateService} from "@ngx-translate/core";
import {RegisterPage} from "../pages/register/register";
import {RegisterConfirmationCodePage} from "../pages/register-confirmation-code/register-confirmation-code";
import {PinStorage} from "../util/pin.storage";
import {Device} from "@ionic-native/device";
import {LockerIotService} from "../services/locker.iot.service";
import * as PromiseBlueBird from 'bluebird';
import {Network} from "@ionic-native/network";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage: any;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              public userStorage: UserStorageService,
              public device : Device,
              private lockerIotService : LockerIotService,
              private network: Network,
              private translate: TranslateService, private pinStorage: PinStorage) {
    platform.ready().then(async () => {
      // console.log(translate.getBrowserLang());
      //



      if (translate.getBrowserLang() == "pt") {
        translate.setDefaultLang("pt-BR");
      } else if (translate.getBrowserLang() == "en") {
        translate.setDefaultLang("en-US");
      }

      await pinStorage.save(this.device.uuid ? this.device.uuid  : "123456" );

      // statusBar.styleDefault();
      statusBar.backgroundColorByHexString('#4A7A52');
      let user = await userStorage.getCurrentUser();

      if (user) {

        if (user.status == "ready") {
          this.rootPage = TabsPage
        } else {
          this.rootPage = RegisterConfirmationCodePage;
        }

      } else {
        this.rootPage = RegisterPage;
      }
      splashScreen.hide();

      this.refreshOnOpen();

      this.network.onConnect().subscribe(() => {

        // We just got a connection but we need to wait briefly
        // before we determine the connection type. Might need to wait.
        // prior to doing any api requests as well.
        setTimeout(() => {

          // alert("AQUIIIIIIIIIII no network")
          this.sync();
        }, 5000);
      });

    });


  }





  async refreshOnOpen(){

    console.log("aqui refrescando")

    let user = await this.userStorage.getCurrentUser();
    try{

      let response = await this.lockerIotService.getAccess();
      user.access = response.data.access_list;
      let devices = await this.lockerIotService.getDevices();
      user.devices = devices.data;


      this.sync();

    }catch (e){

    }

  }

  async sync(){

    let user = await this.userStorage.getCurrentUser();
    if (user.openList){

      console.log("aqui mandando no open list")
      PromiseBlueBird.map(user.openList, async item => {

        let result =  await this.lockerIotService.triggeredDevice(item["deviceId"], item["cod"], item["logInfo"]);
        console.log(result);
        console.log(user.openList.indexOf(item));
        user.openList.splice(user.openList.indexOf(item), 1);
        return this.userStorage.save(user);

      }, {concurrency: 1}).then(complete => {
        console.log("compelto");

        // alert("AQUIIIIIIIIIII no network 2")
      }).catch(error => {
        console.log("erro ao sincronziar", JSON.stringify(error));
      })
    }

  }


  asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
  };
}
