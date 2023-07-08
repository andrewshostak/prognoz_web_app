import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app';
import { environment } from '@env';

if (environment.production) {
   enableProdMode();
}

platformBrowserDynamic()
   .bootstrapModule(AppModule, { preserveWhitespaces: true })
   // tslint:disable-next-line:no-console
   .catch(err => console.log(err));
