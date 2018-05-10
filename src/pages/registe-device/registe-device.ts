import {Component, NgZone} from '@angular/core';
import {LoadingController, NavController, NavParams, ViewController} from 'ionic-angular';
import {LockerIotService} from "../../services/locker.iot.service";
import {MessageHandler} from "../../util/error.handler";
import {UserStorageService} from "../../util/user.storage.service";
import {BleService} from "../../services/ble.service";
import {BLE} from "@ionic-native/ble";
import {Observable} from "rxjs/Observable";
import {TranslateService} from "@ngx-translate/core";
import {ConnectionPage} from "../connection/connection";

/**
 * Generated class for the RegisteDevicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-registe-device',
  templateUrl: 'registe-device.html',
})
export class RegisteDevicePage {

  register = {
    device_name: "",
    device_info: ""
  }

  device;

  submitted = false;
  zone;

  deviceRegister;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private lockerIotService: LockerIotService,
              private messageHandler: MessageHandler,
              private loaderCtrl: LoadingController,
              public ble : BLE,
              private bleService : BleService,
              private translate : TranslateService,
              private viewCtrl: ViewController,
              private userStorage: UserStorageService) {

    this.device = this.navParams.get("device");
    this.zone = new NgZone({enableLongStackTrace: false});

    if (this.navParams.get("deviceRegister")){
      this.deviceRegister =  this.navParams.get("deviceRegister")
      this.register.device_info = this.deviceRegister["info"];
      this.register.device_name = this.deviceRegister["name"];
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisteDevicePage');
  }


  isValid() {
    return this.register.device_name != '' && this.register.device_info != "";
  }


  setLoadingText(text:string) {
    const elem = document.querySelector(
      "div.loading-wrapper div.loading-content");
    if(elem) elem.innerHTML = text;
  }



  showMessageConnection(message, loader, device) {
    console.log(message);

      this.messageHandler.showToast("Cannot connect with device")
      loader.dismiss();


  }


  async send() {
    this.submitted = true;

    // let loader = this.loaderCtrl.create();

    const loader = this.loaderCtrl.create({
      spinner: 'bubbles',
      content: this.translate.instant("Sending to server..")
    });

    let responseRegister = null;

    let lockerTimeout = null;

    try {

      let isEnabled = await this.bleService.isEnableAndtryEnable();

      if (this.isValid() && isEnabled ) {


        loader.present();
        let user = await this.userStorage.getCurrentUser();


        if (this.deviceRegister) {

          responseRegister = await this.lockerIotService.updateDevice(this.register.device_name, this.register.device_info, this.device.id);
        } else {
          responseRegister = await this.lockerIotService.registerDevice(this.register.device_name, this.register.device_info, this.device.id);
        }

        this.setLoadingText(this.translate.instant("Connecting with Locker"));
        lockerTimeout = setTimeout(this.showMessageConnection.bind(this), ConnectionPage.CONNCETION_SECONDS * 1000, 'Scan complete', loader);

        this.ble.connect(this.device.id).subscribe(async connection => {


          clearTimeout(lockerTimeout);
          try{
          this.setLoadingText(this.translate.instant("Sending configuration"));
          let responseConfigure =  await this.bleService.configure(this.device.id, responseRegister.data);


          let responseConfigureReplace = responseConfigure.replace("\x00", '')

          console.log("resposta do configuracao", responseConfigureReplace);

            let responseUpdate = await this.lockerIotService.updateDeviceConfirm(this.device.id, responseConfigureReplace);
            this.setLoadingText(this.translate.instant("Downloading new information"))

            let response = await this.lockerIotService.getAccess();
            user.access = response.data.access_list;
            let devices = await this.lockerIotService.getDevices();
            user.devices = devices.data;
            await this.userStorage.save(user);

            this.messageHandler.showToast("Device configuration success!")
            this.viewCtrl.dismiss();

          }catch (e) {
            console.log(JSON.stringify(e));
            console.log("aqui no erro de enviar ao desconcetar");
            this.messageHandler.handleError(e);
          }finally {
            if (lockerTimeout) {
              clearTimeout(lockerTimeout);
            }
            loader.dismiss();
            this.ble.disconnect(this.device.id);
          }

        //
        }, error => {

          if (lockerTimeout) {
            clearTimeout(lockerTimeout);
          }
          console.log("erro ao conectar");

          loader.dismiss();
          this.zone.run(() => {
            // this.messageHandler.showToast("The device lost connection.")
          })
        })

      }

    } catch (e) {

      if (lockerTimeout){
        clearTimeout(lockerTimeout);
      }

      console.log("aqui no erro de enviar geral");
      console.log(JSON.stringify(e));
      this.messageHandler.handleError(e);
      loader.dismiss();
    } finally {

      // loader.dismiss();
    }

  }
}
