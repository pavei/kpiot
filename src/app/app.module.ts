import {NgModule, ErrorHandler, Injectable, Injector} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {IonicApp, IonicModule, IonicErrorHandler, LoadingController} from 'ionic-angular';
import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {JsonStorage} from "../util/json.storage";
import {PinStorage} from "../util/pin.storage";
import {SecureJsonStorage} from "../util/secure.json.storage";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {IonicStorageModule} from "@ionic/storage";
import {RequestUtil} from "../util/requestutil";
import {RegisterPage} from "../pages/register/register";
import {UserStorageService} from "../util/user.storage.service";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {HashGenerator} from "../util/hash.generator";
import {LockerIotService} from "../services/locker.iot.service";
import {RegisterConfirmationCodePage} from "../pages/register-confirmation-code/register-confirmation-code";
import {Device} from "@ionic-native/device";
import {MessageHandler} from "../util/error.handler";
import {AccessPage} from "../pages/access/access";
import {HistoryPage} from "../pages/history/history";
import {ConnectionPage} from "../pages/connection/connection";
import {ConfigurationPage} from "../pages/configuration/configuration";
import {LoadingIndicator} from "../util/loading";
import {BLE} from "@ionic-native/ble";
import {Ionic2MaskDirective} from "ionic2-mask-directive";
import {ConnectionAdminPage} from "../pages/connection-admin/connection-admin";
import {RegisteDevicePage} from "../pages/registe-device/registe-device";
import {BleService} from "../services/ble.service";
import {PopoverPage} from "../pages/connection-admin/popover-page";
import {Pro} from "@ionic/pro";
import {ArraySortPipe} from "../util/sort-filter";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


Pro.init('65c56af3', {
  appVersion: '1.0.0'
})

@Injectable()
export class MyErrorHandler implements ErrorHandler {
  ionicErrorHandler: IonicErrorHandler;

  constructor(injector: Injector) {
    try {
      this.ionicErrorHandler = injector.get(IonicErrorHandler);
    } catch(e) {
      // Unable to get the IonicErrorHandler provider, ensure
      // IonicErrorHandler has been added to the providers list below
    }
  }

  handleError(err: any): void {
    Pro.monitoring.handleNewError(err);
    // Remove this if you want to disable Ionic's auto exception handling
    // in development mode.
    this.ionicErrorHandler && this.ionicErrorHandler.handleError(err);
  }
}

@NgModule({
  declarations: [
    MyApp,
    RegisterPage,
    TabsPage,
    RegisterConfirmationCodePage,
    AccessPage,
    HistoryPage,
    ConnectionPage,
    ConfigurationPage,
    LoadingIndicator,
    ConnectionAdminPage,
    RegisteDevicePage,
    PopoverPage,
    ArraySortPipe,
    Ionic2MaskDirective

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    RegisterPage,
    TabsPage,
    RegisterConfirmationCodePage,
    AccessPage,
    HistoryPage,
    ConnectionPage,
    ConfigurationPage,
    ConnectionAdminPage,
    RegisteDevicePage,
    PopoverPage,
    LoadingIndicator
  ],
  providers: [
    StatusBar,
    SplashScreen,
    JsonStorage,
    PinStorage,
    SecureJsonStorage,
    UserStorageService,
    RequestUtil,
    HashGenerator,
    LockerIotService,
    Device,
    MessageHandler,
    BLE,
    BleService,
    IonicErrorHandler,
    {provide: ErrorHandler, useClass: MyErrorHandler }
  ]
})
export class AppModule {}
