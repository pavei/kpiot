import {Injectable} from "@angular/core";
import * as CryptoJS from 'crypto-js';
import {HttpClient} from "@angular/common/http";
import {Device} from '@ionic-native/device';
import {ENV} from "@app/env";
import {Platform} from "ionic-angular";

/**
 * Created by Avell on 03/05/2017.
 */


@Injectable()
export class LockerIotService {


  constructor(private http: HttpClient, private device: Device, private platform: Platform) {

  }

  register(phone, name) {

    let path = "/register";

    let obj = {
      app_type_id: ENV.APP_TYPE_ID,
      username: phone,
      full_name: name,
      app_version: ENV.APP_VERSION
    };

    return this.execute(ENV.BASE_URL_REST + path, obj);
  }


  registerConfirmationCode(phone, confirmationCode) {

    let path = "/register_confirmation_code";

    let obj = {
      app_type_id: ENV.APP_TYPE_ID,
      username: phone,
      app_version: ENV.APP_VERSION,
      confirmation_code: confirmationCode
    };

    return this.execute(ENV.BASE_URL_REST + path, obj);
  }


  getAccess() {

    let path = "/get_access";

    let obj = {};

    return this.execute(ENV.BASE_URL_REST + path, obj);
  }

  getHistory() {

    let path = "/get_historic";

    let obj = {};

    return this.execute(ENV.BASE_URL_REST + path, obj);
  }

  triggeredDevice(deviceMac, cod, logInfo) {

    let path = "/triggered_device";

    let obj = {
      device_mac: deviceMac,
      cod: cod,
      log_info: logInfo
    };

    return this.execute(ENV.BASE_URL_REST + path, obj);
  }


  getDevices(deviceMac, cod, logInfo) {

    let path = "/get_devices";

    let obj = {
      device_mac: deviceMac,
      cod: cod,
      log_info: logInfo
    };

    return this.execute(ENV.BASE_URL_REST + path, obj);
  }


  execute(url, payload): Promise<any> {
    Object.assign(payload, this.buildFingerPrint());
    return this.http.post(url, payload).toPromise();
  }


  buildFingerPrint() {

    let id = this.device.uuid;
    if (this.platform.is("core")){
      id = "123456"
    }

    var bytes  =  CryptoJS.SHA256(id);
    var plaintext = bytes.toString(CryptoJS.enc.Base64);

    return {"finger_print": plaintext}
  }

}

