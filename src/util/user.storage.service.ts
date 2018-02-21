import {Injectable} from "@angular/core";
import {SecureJsonStorage} from "../util/secure.json.storage";
import {PinStorage} from "../util/pin.storage";

@Injectable()
export class UserStorageService {

  static readonly key = "userStorage-khomp"
  private user;

  constructor(public jsonStorage: SecureJsonStorage, public pinManager: PinStorage) {
    this.getCurrentUser();
  }

  async isAuthenticated() {

    const promise = new Promise((resolve, reject) => {
      this.pinManager.get().then(pin => {

        if (!pin){
          resolve(false);
        }else{

          let str = pin+"";

          this.jsonStorage.get(UserStorageService.key, str.split(':')[0]).then((value) => {
            resolve(value != null)
          }).catch(error => {
            reject(error)
          })
        }

      });
    });

    return promise;
  }


  save(user) {

    this.user = user;
    let pin = this.pinManager.getPin();

    return this.jsonStorage.save(UserStorageService.key, user, pin);
  }

  logout() {
    return this.jsonStorage.remove(UserStorageService.key)
  }


  getUserDataWithoutPromise(): any {
    return this.user;
  }

  getCurrentUser(): Promise<any> {

    if (this.user == null) {
      let pin = this.pinManager.getPin();

      if (pin != null) {
        return this.jsonStorage.get(UserStorageService.key, pin).then(user => {
          this.user = user;
          return user;
        })
      } else {
        return Promise.resolve(null);
      }

    } else {

      return Promise.resolve(this.user);
    }

  }




}
