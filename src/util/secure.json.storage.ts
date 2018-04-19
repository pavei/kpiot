import {Storage} from '@ionic/storage';
import {Injectable} from "@angular/core";
import * as CryptoJS from 'crypto-js';


@Injectable()
export class SecureJsonStorage {

  isReady: boolean;

  constructor(public storage: Storage) {

    storage.ready().then(() => {
      this.isReady = true;
    });
  }

  save(key, value, pin) {
    let strValue = JSON.stringify(value);
    console.log(strValue);
    return this.storage.set(key, CryptoJS.AES.encrypt(strValue, pin).toString())
  }

  get(key, pin) {

    let promise = null;
    if (pin) {

      promise = new Promise((resolve, reject) => {

        this.storage.get(key).then((value) => {
          if (value != null) {
            console.log("get data", pin);
            let bytes = CryptoJS.AES.decrypt(value, pin);
            let decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            resolve(decryptedData)
          } else {
            resolve(null);
          }

        }).catch(error => {
          reject(error)
        })

      });

    } else {
      promise = Promise.resolve(null);
    }

    return promise;
  }

  remove(key) {
    return this.storage.remove(key);
  }

}
