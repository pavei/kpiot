import {Injectable} from "@angular/core";
import {AlertController, App, ToastController} from "ionic-angular";
import {TranslateService} from "@ngx-translate/core";

@Injectable()
export class MessageHandler {

  constructor(public toastCtrl: ToastController,
              public app: App,
              public translateService: TranslateService,
              public alertCtrl: AlertController) {
  }


  showSuccess(response){
    this.showToast(response.code);
  }

  handleError(error) {

    console.log(JSON.stringify(error));

    if (error.status) {


      this.showToast(error.error.code);

    } else if (error.status == 0) {

      this.showToast(this.translateService.instant("You are offline, try again later"));

    } else if (error && error._body != null && error._body != '') {


      this.showToast("Internal server error");


    } else {

      if (error.status == 502){
        this.showToast("502 - You are offline, try again later");
      }else{
        this.showToast("You are offline, try again later");
      }

    }

  }

  showPopup(message, title?) {

    let alert = this.alertCtrl.create({
      title: title ? title : 'Aviso',
      subTitle: message,
      buttons: [{
        text: 'Ok',
        handler: data => {
        }
      }],
    });
    alert.present();

  }


  showToast(msg) {

    let toast = this.toastCtrl.create({
      message: this.translateService.instant(msg+""),
      showCloseButton: true,
      duration: 4000,
      closeButtonText: "ok",
    });
    toast.present();

  }

}
