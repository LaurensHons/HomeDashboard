import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';
import { EffectsModule, provideEffects } from '@ngrx/effects';
import { StoreModule, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(HttpClientModule),
    provideRouter(routes),
    provideStore({}),
    provideEffects([]),
    provideStoreDevtools({ logOnly: false }),
    importProvidersFrom(StoreModule.forRoot({}), EffectsModule.forRoot([])),
    provideAnimations()
],
};
