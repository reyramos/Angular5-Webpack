// /**
//  * Angular bootstrapping
//  */
// import { platformBrowser } from '@angular/platform-browser';
// import { decorateModuleRef } from './app/environment';
// /**
//  * App Module
//  * our top level module that holds all of our components.
//  */
// import { AppModuleNgFactory } from '../compiled/src/app/app.module.ngfactory';
// /**
//  * Bootstrap our Angular app with a top level NgModule.
//  */
// export function main(): Promise<any> {
//   return platformBrowser()
//     .bootstrapModuleFactory(AppModuleNgFactory)
//     .then(decorateModuleRef)
//     .catch((err) => console.error(err));
// }
//
// switch (document.readyState) {
//   case 'loading':
//     document.addEventListener('DOMContentLoaded', _domReadyHandler, false);
//     break;
//   case 'interactive':
//   case 'complete':
//   default:
//     main();
// }
//
// function _domReadyHandler() {
//   document.removeEventListener('DOMContentLoaded', _domReadyHandler, false);
//   main();
// }
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode ();
}

platformBrowserDynamic ().bootstrapModule (AppModule)
  .catch (err => console.log (err));

