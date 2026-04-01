
import { EFFECTS_MODULE_OPTIONS } from './constants'
import { EffectsInterceptor } from './effects.interceptor'

export interface IEffectModuleOptions {
  /**
   * Whether or not to log errors that happen in the event handlers.
   * Errors will not cause request to fail. Defaults to true.
   *
   * @type {boolean}
   * @memberof IEffectModuleOptions
   */
  logErrors?: boolean

  /**
   * Whether or not to re-throw the caught error from the event handlers within the interceptor. If set to true,
   * it will cause the request to fail with the error. Defaults to true.
   *
   * @type {boolean}
   * @memberof IEffectModuleOptions
   */
  throwErrors?: boolean
}

const defaultOptions: IEffectModuleOptions = {
  logErrors: true,
  throwErrors: true,
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
        EFFECTS_MODULE_OPTIONS,
      ],
    }
  }
}
