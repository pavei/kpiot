import {Component} from "@angular/core";
import {LoadingController} from "ionic-angular";


@Component({
  selector: 'loading-indicator',
  template: ''
})
export class LoadingIndicator {

  loader;

  constructor(private loadingController: LoadingController) {

    this.loader = this.loadingController.create({showBackdrop: false, cssClass: "loader-background"});

    this.loader.present().then(() => {

    });
  }

  ngOnDestroy() {
    this.loader.dismiss();
  }


}

export class LoadingPage {
  public loading: boolean;

  constructor(val: boolean = true) {
    this.loading = val;
  }

  standby() {
    this.loading = true;
  }

  ready() {
    this.loading = false;
  }
}
