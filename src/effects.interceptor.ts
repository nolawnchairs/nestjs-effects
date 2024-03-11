
import { Request } from 'express'
import { Observable, tap } from 'rxjs'
import { DISPATCH_EFFECT, EFFECTS_MODULE_OPTIONS } from './constants'
import { DispatchedEffectEvent } from './dispatched-effect.event'
import { IEffectModuleOptions } from './effects.module'
import { CallHandler, ExecutionContext, Inject, Injectable, Logger, NestInterceptor } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class EffectsInterceptor implements NestInterceptor {

  private readonly logger = new Logger(EffectsInterceptor.name)

  constructor(
    @Inject(EFFECTS_MODULE_OPTIONS) private readonly options: Required<IEffectModuleOptions>,
    private readonly reflector: Reflector,
    private readonly emitter: EventEmitter2
  ) { }

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const effects = this.reflector.get<string[]>(DISPATCH_EFFECT, context.getHandler()) ?? []
    const request = context.switchToHttp().getRequest<Request>()
    return next.handle()
      .pipe(
        tap((result) => {
          if (effects.length) {
            const { params, path, url, query, headers, body } = request
            for (const effect of effects) {
              try {
                this.emitter.emit(
                  effect,
                  new DispatchedEffectEvent(result, {
                    params,
                    path,
                    url,
                    query,
                    headers,
                    body,
                  })
                )
              } catch (e) {
                if (this.options.logErrors) {
                  const message = `An error occurred in the event handler for effect '${effect}': ${(e as Error).message}`
                  this.logger.error(message)
                }
              }
            }
          }
        })
      )
  }
}
