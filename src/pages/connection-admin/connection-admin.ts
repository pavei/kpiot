import { Component } from '@angular/core';
import {LoadingController, NavController, NavParams, PopoverController} from 'ionic-angular';
import {ConnectionPage} from "../connection/connection";
import {BLE} from "@ionic-native/ble";
import {MessageHandler} from "../../util/error.handler";
import {UserStorageService} from "../../util/user.storage.service";
import {RegisterPage} from "../register/register";
import {RegisteDevicePage} from "../registe-device/registe-device";
import {BleService} from "../../services/ble.service";
import {LockerIotService} from "../../services/locker.iot.service";
import {PopoverPage} from "./popover-page";
import {TranslateService} from "@ngx-translate/core";

/**
 * Generated class for the ConnectionAdminPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-connection-admin',
  templateUrl: 'connection-admin.html',
})
export class ConnectionAdminPage extends ConnectionPage{

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public ble: BLE,
              public loadingController: LoadingController,
              public bleService : BleService,
              public messageHandler: MessageHandler,
              public userStorage : UserStorageService,
              public popoverCtrl: PopoverController,
              public lockerIotService : LockerIotService,
              public translate : TranslateService) {
    super(navCtrl, navParams, ble,  loadingController, bleService,   messageHandler, userStorage, lockerIotService, translate);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConnectionAdminPage');
  }


  presentPopover(myEvent, device, deviceRegister) {

    myEvent.preventDefault();
    myEvent.stopPropagation();

    let popover = this.popoverCtrl.create(PopoverPage,{device: device, deviceRegister: deviceRegister, screen: this});
    popover.present({
        ev: myEvent
      }
    );

    popover.onWillDismiss(async data => {
      console.log(data);

      if (data){
        if (data.type == "debug"){
          this.connect(device, null, true);

        }else{

          this.ionViewWillEnter();

        }
      }

    })

  }





}
