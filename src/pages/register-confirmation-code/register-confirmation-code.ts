import { Component } from '@angular/core';
import {AlertController, LoadingController, NavController, NavParams} from 'ionic-angular';
import {LockerIotService} from "../../services/locker.iot.service";
import {MessageHandler} from "../../util/error.handler";
import {UserStorageService} from "../../util/user.storage.service";
import {TabsPage} from "../tabs/tabs";
import {RegisterPage} from "../register/register";
import {TranslateService} from "@ngx-translate/core";


@Component({
  selector: 'page-register-confirmation-code',
  templateUrl: 'register-confirmation-code.html',
})
export class RegisterConfirmationCodePage {

  confirmationCode;
  submitted = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private lockerIotService : LockerIotService,
              private messageHandler : MessageHandler,
              private loaderCtrl: LoadingController,
              private translateService : TranslateService,
              private alertCtrl: AlertController,
              private userStorage : UserStorageService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }


  isValid(){

    return this.confirmationCode != ''

  }

  async send(){
    this.submitted = true;

    let loader = this.loaderCtrl.create();

    try{

      if (this.isValid()){

        loader.present();
        let user = await this.userStorage.getCurrentUser();
        let response = await this.lockerIotService.registerConfirmationCode(user.username, this.confirmationCode);

        user.status = "ready";

        await this.userStorage.save(user);
        this.messageHandler.showSuccess(response);
        this.navCtrl.setRoot(TabsPage);
      }


    }catch (e){
      this.messageHandler.handleError(e);
    }finally {
      loader.dismiss();
    }

  }

  back(){


    let alert = this.alertCtrl.create({
      title: this.translateService.instant("Back"),
      message: this.translateService.instant("Do you really want to cancel?"),
      buttons: [
        {
          text: this.translateService.instant("No"),
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: this.translateService.instant("Yes"),
          handler: () => {
            this.navCtrl.setRoot(RegisterPage);
          }
        }
      ]
    });
    alert.present();

  }




}
