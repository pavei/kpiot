import {Storage} from '@ionic/storage';
import {Injectable} from "@angular/core";



@Injectable()
export class JsonStorage {

  isReady: boolean;

  constructor(public storage: Storage) {

    storage.ready().then(() => {
      this.isReady = true;
    });
  }

  save(key, value) {
    return this.storage.set(key, JSON.stringify(value))
  }

  get(key) {

    const promise = new Promise((resolve, reject) => {

      this.storage.get(key).then((value) => {
        resolve(JSON.parse(value))
      }).catch(error => {
        reject(error)
      })

    });

    return promise;
  }

  remove(key){
    return this.storage.remove(key);
  }


}
