import {Injectable, NgZone} from "@angular/core";
import {Events, Platform} from "ionic-angular";
import {BLE} from "@ionic-native/ble";


@Injectable()
export class BleService {


  openCharacteristic = "f0001131-0451-4000-b000-000000000000";
  openService = "f0001130-0451-4000-b000-000000000000";

  readOpenCharacteristic = "f0001141-0451-4000-b000-000000000000";
  readOpenService = "f0001140-0451-4000-b000-000000000000";



  configService = "f0001110-0451-4000-b000-000000000000";
  configCharacteristic = "f0001111-0451-4000-b000-000000000000";

  readConfigService = "f0001120-0451-4000-b000-000000000000";
  readConfigCharacteristic = "f0001121-0451-4000-b000-000000000000";



  debugService = "f0001150-0451-4000-b000-000000000000";
  debugCharacteristic = "f0001151-0451-4000-b000-000000000000";

  readDebugService = "f0001160-0451-4000-b000-000000000000";
  readDebugCharacteristic = "f0001161-0451-4000-b000-000000000000";

  zone;

  constructor(public ble: BLE, public events: Events) {
    this.zone = new NgZone({enableLongStackTrace: false});
  }

  stringToBytesArra(str) {
    var ch, st, re = [];
    for (var i = 0; i < str.length; i++) {
      ch = str.charCodeAt(i);  // get char
      st = [];                 // set up "stack"
      do {
        st.push(ch & 0xFF);  // push byte to stack
        ch = ch >> 8;          // shift value down by 1 byte
      }
      while (ch);
      // add stack contents to result
      // done because chars have "wrong" endianness
      re = re.concat(st.reverse());
    }
    // return an array of bytes
    return re;
  }

  stringToBytes(string) {
    let size = string.length / 2;
    var array = [];


    for (var i = 0, l = size; i < l; i++) {
      let str = string.substr(i * 2, 2);
      array.push("0x" + str)
    }

    let newArray = [];
    var unit = new Uint8Array(size);

    array.forEach((item, index) => {
      unit[index] = parseInt(item, 16);
    });

    return unit.buffer;
  }

// ASCII only
  bytesToString(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
  }


  async configure(id, token){
    return await this.writeAndRead(id, this.configService, this.configCharacteristic, this.readConfigService, this.readConfigCharacteristic, token);
  }


  async configureRead(id){
    return await this.read(id, this.configService, this.configCharacteristic, this.readConfigService, this.readConfigCharacteristic);
  }

  async openDevice(id, token){
    return await this.writeAndRead(id, this.openService, this.openCharacteristic, this.readOpenService, this.readOpenCharacteristic, token);
  }


  async debug(id, token) {
    return await this.writeAndRead(id, this.debugService, this.debugCharacteristic, this.readDebugService, this.readDebugCharacteristic, token);
  }



  async write(id, openService, openCharacteristic, readOpenService, readOpenCharacteristic, data) {

    try{
      let writeData = await this.ble.write(id, openService, openCharacteristic, this.stringToBytes(data));

      return writeData;
    } catch (e) {
      throw e;
    }

  }

  async read(id, openService, openCharacteristic, readOpenService, readOpenCharacteristic) {

    try{
      let returnDat = await this.ble.read(id, readOpenService, readOpenCharacteristic);
      return this.bytesToString(returnDat);
    } catch (e) {
      throw e;
    }

  }

   isEnableAndtryEnable(){

    return new Promise(async (resolve, reject) => {
      try {
        let isEnabled = await this.ble.isEnabled();
        resolve(true);

      } catch (e) {

        try{
          await this.ble.enable();
          resolve(true);
        }catch (e){
         resolve(false);
        }
      }
    })



  }

  async writeAndRead(id, openService, openCharacteristic, readOpenService, readOpenCharacteristic, data) {

    try {
      let write = await this.ble.write(id, openService, openCharacteristic, this.stringToBytes(data));
      console.log(write);

      let returnDat = await this.ble.read(id, readOpenService, readOpenCharacteristic);

      console.log(this.bytesToString(returnDat));

      return this.bytesToString(returnDat);
    } catch (e) {
      throw e;
    }

  }


  async connect(id, attempts, attempt = 0 ){

    this.ble.connect(id).subscribe(connection => {
      this.zone.run(() => {
        this.events.publish('bleconnected', id);
      })

    }, error => {
      this.zone.run(() => {

        if (attempt < attempts){
          this.connect(id, attempts, attempt++);
        }else{
           this.events.publish('bledisconnected', id);
        }
      })
    })
  }


}
