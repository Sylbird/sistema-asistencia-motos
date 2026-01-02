import { bootstrapApplication } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es-PE';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Register Spanish (Peru) locale
registerLocaleData(localeEs);

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
