import {Storage} from '@ionic/storage';
import {Injectable} from "@angular/core";
import {HashGenerator} from "./hash.generator";


@Injectable()
export class PinStorage {

  isReady: boolean;
  pin;
  readonly key = "info_pin_khomp"

  constructor(public storage: Storage, private generator : HashGenerator) {

    storage.ready().then(() => {
      this.isReady = true;
      this.init();

    });
  }

  init(){
    this.get().then(value =>{
      this.pin = value;
    })

  }

  getPin(){

    if (this.pin){
      console.log("PIN", this.pin.split(":")[0]);
    }

    return this.pin ? this.pin.split(":")[0] : null;
  }

  save(value) {

    console.log(value);

    var salt = "fixed";
    var hashedPassword = this.generator.hashPassword( value, salt );
    this.pin = hashedPassword+":"+salt;

    return this.storage.set(this.key, this.pin)
  }

  match(possiblePin){
    let split = this.pin.split(":");
    return this.generator.checkPassword(possiblePin, split[0], split[1]);
  }


   get() {
    const promise = new Promise((resolve, reject) => {
      this.storage.get(this.key).then((value) => {
        resolve(value)
      }).catch(error => {
        reject(error)
      })
    });

    return promise;
  }

  remove(){
    return this.storage.remove(this.key);
  }


}
