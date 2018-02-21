import {Component} from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {TranslateService} from "@ngx-translate/core";
import {UserStorageService} from "../../util/user.storage.service";
import {RegisterPage} from "../register/register";
import {ENV} from "@app/env";

/**
 * Generated class for the ConfigurationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-configuration',
  templateUrl: 'configuration.html',
})
export class ConfigurationPage {

  version;

  constructor(public navCtrl: NavController,
              private translateService : TranslateService,
              private alertCtrl: AlertController,
              private userStorage : UserStorageService,
              public navParams: NavParams) {
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfigurationPage');
    this.version = ENV.APP_VERSION
  }


  exit() {


    let alert = this.alertCtrl.create({
      title: this.translateService.instant("Logout"),
      message: this.translateService.instant("Do you really want to exit?"),
      buttons: [
        {
          text: this.translateService.instant("No"),
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: this.translateService.instant("Yes"),
          handler: () => {
             this.userStorage.logout();
            this.navCtrl.setRoot(RegisterPage);
          }
        }
      ]
    });
    alert.present();

  }

}
