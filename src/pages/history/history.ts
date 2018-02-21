import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {LoadingPage} from "../../util/loading";
import {LockerIotService} from "../../services/locker.iot.service";
import {MessageHandler} from "../../util/error.handler";
import {UserStorageService} from "../../util/user.storage.service";

/**
 * Generated class for the HistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage extends LoadingPage{

  history = [];


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private lockerIotService : LockerIotService,
              private messageHandler : MessageHandler,
              private userStorage : UserStorageService) {
    super(true);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
    this.list();
  }


  async list(refresher?){

    let user = await this.userStorage.getCurrentUser();

    try{

      let response = await this.lockerIotService.getHistory();
      user.history = response.data.access_list;
      this.history =  response.data.access_list;

    }catch (e){
      this.messageHandler.handleError(e);
      this.history = user.history;

    }finally {

      this.ready();

      if (refresher){
        refresher.complete();
      }

    }

  }



}
