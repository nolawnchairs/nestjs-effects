
import { EFFECTS_MODULE_OPTIONS } from './constants'
import { EffectsInterceptor } from './effects.interceptor'

export interface IEffectModuleOptions {
  /**
   * Whether or not to log errors that happen in the event handlers.
   * Errors will not cause request to fail.
   *
   * @type {boolean}
   * @memberof IEffectModuleOptions
   */
  logErrors?: boolean
}

const defaultOptions: IEffectModuleOptions = {
  logErrors: true,
}

export class EffectsModule {
  static forRoot(options?: IEffectModuleOptions) {
    return {
      global: true,
      module: EffectsModule,
      providers: [
        EffectsInterceptor,
        {
          provide: EFFECTS_MODULE_OPTIONS,
          useValue: {
            ...defaultOptions,
            ...(options ?? {}),
          },
        },
      ],
      exports: [
        EffectsInterceptor,
      ],
    }
  }
}
