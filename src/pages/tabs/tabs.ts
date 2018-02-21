import { Component } from '@angular/core';
import {AccessPage} from "../access/access";
import {HistoryPage} from "../history/history";
import {ConfigurationPage} from "../configuration/configuration";
import {ConnectionPage} from "../connection/connection";


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = AccessPage;
  tab2Root = HistoryPage;
  tab3Root = ConnectionPage;
  tab4Root = ConfigurationPage;

  constructor() {

  }
}
