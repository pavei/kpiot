import { Component } from '@angular/core';
import {LoadingController, NavController, NavParams} from 'ionic-angular';
import {LockerIotService} from "../../services/locker.iot.service";
import {UserStorageService} from "../../util/user.storage.service";
import {MessageHandler} from "../../util/error.handler";
import {RegisterConfirmationCodePage} from "../register-confirmation-code/register-confirmation-code";


@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  register = {username: "", full_name: ""};
  submitted = false;
  phoneValid = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private lockerIotService : LockerIotService,
              private messageHandler : MessageHandler,
              private loaderCtrl: LoadingController,
              private userStorage : UserStorageService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }



  isValid(){

    console.log(this.register)

    var regex = /\(?([0-9]{2})\)\s?([0-9]{5})([ .-]?)([0-9]{4})/

    var matches = this.register.username.match(regex);


    if (matches && matches.length > 0){
      this.phoneValid = true;
    }else{
      this.phoneValid = false;
    }

    return this.register.full_name != '' &&  this.phoneValid

  }

  async send(){
      this.submitted = true;
      let loader = this.loaderCtrl.create();

      try{

        if (this.isValid()){
          loader.present();

          let response = await this.lockerIotService.register(this.register.username, this.register.full_name);
          let str = await this.userStorage.save(this.register);

          this.messageHandler.showSuccess(response);

          this.navCtrl.setRoot(RegisterConfirmationCodePage);
        }

      }catch (e){
        console.log(e);
        this.messageHandler.handleError(e);
      }finally {
        loader.dismiss();
      }

  }




}
