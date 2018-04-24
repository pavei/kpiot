import {Component} from '@angular/core';
import {LoadingController, NavController, NavParams} from 'ionic-angular';
import {BLE} from "@ionic-native/ble";
import {NgZone} from '@angular/core';

import {UserStorageService} from "../../util/user.storage.service";
import {BleService} from "../../services/ble.service";
import {MessageHandler} from "../../util/error.handler";
import {LockerIotService} from "../../services/locker.iot.service";
import {TranslateService} from "@ngx-translate/core";


@Component({
  selector: 'page-connection',
  templateUrl: 'connection.html',
})
export class ConnectionPage {

  items = [];
  zone;
  static NAME_PATTERN = "KLIOT_";

  initialInformation = true;

  static SEARCH_SECONDS = 10;
  static CONNCETION_SECONDS = 20;

  access = [];
  devices = [];
  itensToShow = [];
  scan = false;
  timeoutScan;
  timeoutConnect;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public ble: BLE,
              public loadingController: LoadingController,
              public bleService : BleService,
              public messageHandler: MessageHandler,
              public userStorage: UserStorageService,
              public lockerIotService : LockerIotService,
              public translate : TranslateService) {
    this.zone = new NgZone({enableLongStackTrace: false});

  }

  async ionViewWillEnter() {

    console.log("aqui no will enter");

    let user = await this.userStorage.getCurrentUser();
    this.access = user.access;
    this.devices = user.devices;
    this.initialInformation = true;
    this.items = [];
    this.itensToShow = null;
    this.scan = false;
    this.scanDevices(true);
  }

  ionViewWillLeave(){

    console.log("aqui no will leeave")

    this.ble.stopScan();

    if (this.timeoutScan){
      clearTimeout(this.timeoutScan);
    }

    let device =  this.items.find(item => item.connected);

    if (device){
      this.disconnect(device, true);
    }

  }

  async scanDevices(refresh) {

    let isEnabled = await this.bleService.isEnableAndtryEnable();

    if (isEnabled) {

      let device =  this.items.find(item => item.connected);
      if (device){
        this.disconnect(device, true);
      }

      // let loader = this.loadingController.create();
      this.scan = true;
      this.initialInformation = false;

      if (refresh){
        this.items = [];
      }

      this.ble.startScan([]).subscribe(async device => {
        console.log(JSON.stringify(device));
        this.zone.run(() => {

          if (device && device.name && device.name.indexOf(ConnectionPage.NAME_PATTERN) >= 0) {

            let alreadyExists = this.items.find(item => device.id == item.id);

            if (!alreadyExists){
              device.name = device.name.replace(ConnectionPage.NAME_PATTERN, '')

              this.items.unshift(device);

              let find = this.access.find(item => device.id == item.mac);

              if (find) {
                device.access = find;
              }

              let findDevices = this.devices.find(item => device.id == item.ble_mac);

              if (findDevices) {
                console.log("find devices", findDevices)
                device.device = findDevices;
              }
            }


          }
        });

      }, error => {
        console.log(JSON.stringify(error))
      }, () => {
        console.log("terminei")
      })


      if (this.timeoutScan){
        clearTimeout(this.timeoutScan);
      }

      this.timeoutScan = setTimeout(this.setStatus.bind(this), ConnectionPage.SEARCH_SECONDS * 1000, 'Scan complete');
    }
  }

  async setStatus(message, loader) {
    console.log(message);
    //loader.dismiss();
    this.scan = false;
    await this.ble.stopScan();

    if (this.items.length == 0) {
      this.initialInformation = true;
    } else {
      this.initialInformation = false;
    }

    if (this.itensToShow ){
      this.itensToShow = this.items;
    }

    this.scanDevices(false);
  }


  async connect(device, event, debug) {

    if (event){
      event.preventDefault();
      event.stopImmediatePropagation();
      event.stopPropagation();
    }

    let isEnabled = await this.bleService.isEnableAndtryEnable();

    if (this.timeoutScan){
      clearTimeout(this.timeoutScan);
    }

    await this.ble.stopScan();
    this.scan = false;

    let loader = this.loadingController.create({
      content: this.translate.instant("Connecting")
    });
    loader.present();

    if (isEnabled){

      this.ble.connect(device.id).subscribe(connection => {
        this.zone.run(() => {

          if (this.timeoutConnect){
            clearTimeout(this.timeoutConnect);
          }

          device.connected = true;

          if (!debug){
            this.open(device, loader);
          }else{
            this.debug(device, loader);
          }


        })
      }, error => {
        console.log("aqui no connect error")
        console.log(JSON.stringify(error));

        this.zone.run(() => {
          if (device.connected){
            device.connected = false;
          }else{
            this.messageHandler.showToast("Cannot connect with device")
          }

        })
      })
    }


    if (this.timeoutConnect){
      clearTimeout(this.timeoutConnect);
    }

   this.timeoutConnect =  setTimeout(this.showMessageConnection.bind(this), ConnectionPage.CONNCETION_SECONDS * 1000, 'Scan complete', loader, device);

  }

  showMessageConnection(message, loader, device) {
    // console.log(message);

    if (!device.connected){
      this.messageHandler.showToast("Cannot connect with device")
      loader.dismiss();

    }
  }

  async disconnect(device, leave) {

    this.ble.disconnect(device.id).then(connection => {

      if (!leave) {
        device.connected = false;
      }
    }, error => {

      this.zone.run(() => {

        if (!leave) {
          if (device.connected){
            device.connected = false;
          }else{
            // this.messageHandler.showToast("Cannot connect with device")
          }
        }


      })
    })
  }

  asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
  };


  async debug(device, loader){
    try{

      let debugTokens =  await this.lockerIotService.getDebugTokens(device.id);

      this.setLoadingText(this.translate.instant("Loading log debug"))
      console.log(JSON.stringify(debugTokens));

      let dataToSend = "";
      await this.asyncForEach(debugTokens.data, async (item) =>{
        let data = await this.bleService.debug(device.id, item);
        dataToSend += data;
      })


      let dataResponse = await this.lockerIotService.uploadDebug(device.id, dataToSend);
      console.log(dataResponse);
      this.messageHandler.showToast("Log debug was send success");

    }catch (e) {
      console.log(JSON.stringify(e));
    }finally {
      loader.dismiss();
    }
  }


  setLoadingText(text:string) {
    const elem = document.querySelector(
      "div.loading-wrapper div.loading-content");
    if(elem) elem.innerHTML = text;
  }


  async open(device, loader) {


    this.setLoadingText(this.translate.instant("Opening"))

    try{
     let openReturn = await this.bleService.openDevice(device.id, device.access.token)

      console.log("open", openReturn);
     let cod = openReturn.split("::");

      let firstCommand = cod[0].replace(/\0/g, '');

     if (firstCommand.indexOf("nak") > -1){
       this.messageHandler.showPopup(this.translate.instant(firstCommand), this.translate.instant("Error"));
     }
      await this.lockerIotService.triggeredDevice(device.id, firstCommand, openReturn);

    }catch (e){
      console.log("error", JSON.stringify(e));
    }finally {
      loader.dismiss();
    }


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConnectionPage');
  }

}
