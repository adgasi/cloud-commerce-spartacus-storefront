import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  ConfigModule,
  Config,
  CmsConfig,
  UrlModule,
  I18nModule,
} from '@spartacus/core';
import { CheckoutProgressComponent } from './checkout-progress.component';
import { defaultCheckoutConfig } from '../../config/default-checkout-config';
import { CheckoutConfig } from '../../config/checkout-config';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    UrlModule,
    I18nModule,
    RouterModule,
    ConfigModule.withConfig(defaultCheckoutConfig),
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        CheckoutProgress: {
          selector: 'cx-checkout-progress',
        },
      },
    }),
  ],
  declarations: [CheckoutProgressComponent],
  entryComponents: [CheckoutProgressComponent],
  exports: [CheckoutProgressComponent],
  providers: [{ provide: CheckoutConfig, useExisting: Config }],
})
export class CheckoutProgressModule {}
