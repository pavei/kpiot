import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {LockerIotService} from "../../services/locker.iot.service";
import {MessageHandler} from "../../util/error.handler";
import {UserStorageService} from "../../util/user.storage.service";
import {LoadingPage} from "../../util/loading";

/**
 * Generated class for the AccessPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-access',
  templateUrl: 'access.html',
})
export class AccessPage extends LoadingPage{

  access = [];


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private lockerIotService : LockerIotService,
              private messageHandler : MessageHandler,
              private userStorage : UserStorageService) {
    super(true);
  }

  ionViewWillEnter() {
    console.log('ionViewDidLoad RegisterPage');
    this.list();
  }


  async list(refresher?){

    let user = await this.userStorage.getCurrentUser();

    try{

      let response = await this.lockerIotService.getAccess();
      user.access = response.data.access_list;
      this.access =  response.data.access_list;

      let devices = await this.lockerIotService.getDevices();
      user.devices = devices.data;

      this.userStorage.save(user);

    }catch (e){
      this.messageHandler.handleError(e);
      this.access = user.access;

    }finally {

      this.ready();

      if (refresher){
        refresher.complete();
      }

    }

  }


}
