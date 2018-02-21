import {Http, RequestOptions, URLSearchParams, Headers} from '@angular/http';
import {Injectable} from "@angular/core";
import * as CryptoJS from 'crypto-js';
import {UserStorageService} from "./user.storage.service";

/**
 * Created by Avell on 03/05/2017.
 */


@Injectable()
export class RequestUtil {


  constructor(private userStorageService: UserStorageService, private http: Http) {

  }


  execute(url, payload): Promise<any> {

    return new Promise((resolve, reject) => {

      //
      // let build = this.buildParams(payload);
      // this.http.post(url, build.body, build.options).map(res => res.json()).subscribe(data => {
      //
      //   if (data.status == 'ok') {
      //     resolve(data.data);
      //   } else {
      //     reject(data);
      //   }
      // }, error => {
      //   reject(error);
      // })

    })

  }


  getDefaultRequestOptions(options?: RequestOptions) {

    if (!options) {
      options = new RequestOptions();
    }

    let headers = (<any> Object).assign(this.getHeaders(), options.headers)
    options.headers = headers;

    return options;

  }

  getHeaders() {

    let headers = new Headers();
    headers.append('content-type', 'application/x-www-form-urlencoded');

    return headers;
  }

  buildParams(jsonPayload): any {

    let options = new RequestOptions();
    let user = this.userStorageService.getUserDataWithoutPromise();
    //let time = new Date().getTime();

    var time = Math.floor(+new Date() / 1000) ;

    let str = `api_ts=${time}&api_user=${user.api_user}&payload=${JSON.stringify(jsonPayload)}`

    let body = new URLSearchParams();
    body.set('api_ts', time + "");
    body.set('api_user', user.api_user);
    body.set('payload', JSON.stringify(jsonPayload));

    let api_sig = CryptoJS.HmacSHA256(str, user.api_key);
    body.set('api_sig', api_sig + "");

    options.headers = this.getHeaders();

    return {body: body, options: options};
  }


  // api_user	The API User
  // api_ts	Unixtimestamp when request is signed
  // payload	json encoded data
  // api_sig	Signature:
  //   Result of hash_hmac sha256 with APIKEY over an url encoded string of all formfields in alphabetical order
  //
  // Example:
  //   api_sig = hash_hmac('sha256','api_ts=124456&api_user=user&payload={id:4,"foo":"bar"}',API_KEY)


}

