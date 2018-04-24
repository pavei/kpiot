import {Component} from "@angular/core";
import {ModalController, NavController, ViewController} from "ionic-angular";
import {RegisteDevicePage} from "../registe-device/registe-device";
import {RegisterPage} from "../register/register";

@Component({
  template: `
    <ion-list>
      <button outline clear ion-item mode="ios"  *ngIf="device.device" (click)="register()">{{ 'Update' | translate }}</button>
      <button outline clear ion-item mode="ios"  *ngIf="!device.device" (click)="register()">{{ 'Register' | translate }}</button>
      <button outline clear ion-item mode="ios"  (click)="debug()">Log Debug</button>
    </ion-list>
  `
})
export class PopoverPage {

  device;
  deviceRegister;
  screen;

  constructor(public viewCtrl: ViewController, private modalCtrl : ModalController, public navCtrl: NavController) {
    this.device = this.viewCtrl.getNavParams().get("device");
    this.deviceRegister = this.viewCtrl.getNavParams().get("deviceRegister");
    this.screen = this.viewCtrl.getNavParams().get("screen");
  }

  close() {
    this.viewCtrl.dismiss();
  }


  register(){

    this.screen.ionViewWillLeave();

    let modal =  this.modalCtrl.create(RegisteDevicePage, {device: this.device, deviceRegister: this.deviceRegister});
    modal.present();

    modal.onWillDismiss(data => {
      this.viewCtrl.dismiss({type: 'register'});
    })

  }

  debug(){
    this.viewCtrl.dismiss({type: 'debug'});
  }

  duplicate(){

   // let modal =  this.modalCtrl.create(DuplicateInfochatPage, {infomodel : this.infomodel});
   // modal.present();
   //
   // modal.onWillDismiss(data => {
   //   this.viewCtrl.dismiss(data);
   //
   // })

  }

}
