import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {BLE} from "@ionic-native/ble";
import { NgZone} from '@angular/core';
/**
 * Generated class for the ConnectionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-connection',
  templateUrl: 'connection.html',
})
export class ConnectionPage {

   items = [];
    zone;
  constructor(public navCtrl: NavController, public navParams: NavParams, private ble: BLE) {
    this.zone = new NgZone({enableLongStackTrace: false});
  }

  scanDevices(){

    this.items = [];
    this.ble.scan([], 10).subscribe(async item => {


      console.log(JSON.stringify(item));

      this.zone.run(() => {
        this.items.unshift(item);
      });

    }, error => {
      console.log(JSON.stringify(error))
    }, () => {
      console.log("terminei")
    })
  }

 async connect(device){

    try{
      let connected =  await this.ble.isConnected(device.id);
      console.log(connected)
    }catch (e){
      console.log("Not connected")
    }

    this.ble.connect(device.id).subscribe(connection => {
      console.log(JSON.stringify(connection))
    }, error => {
      console.log(JSON.stringify(error));
    })
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ConnectionPage');

  }

}
