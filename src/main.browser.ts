// /**
//  * Angular bootstrapping
//  */
// import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
// import { decorateModuleRef } from './app/environment';
// import { hmrModule } from '@angularclass/hmr';
//
// /**
//  * App Module
//  * our top level module that holds all of our components
//  */
// import { AppModule } from './app';
//
// /**
//  * Bootstrap our Angular app with a top level NgModule
//  */
// export function main(): Promise<any> {
//   return platformBrowserDynamic()
//     .bootstrapModule(AppModule)
//     .then(decorateModuleRef)
//     .then((ngModuleRef: any) => {
//       // `module` global ref for webpackhmr
//       // Don't run this in Prod
//       return hmrModule(ngModuleRef, module);
//     })
//     .catch((err) => console.error(err));
// }
//
// /**
//  * Needed for hmr
//  * in prod this is replace for document ready
//  */
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
//   try {
//     document.removeEventListener('DOMContentLoaded', _domReadyHandler, false);
//   } catch (e) {
//     console.log(e);
//   }
//   main();
// }
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

console.log('main')

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
