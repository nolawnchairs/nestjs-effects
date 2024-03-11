
import { DISPATCH_EFFECT } from './constants'
import { EffectsInterceptor } from './effects.interceptor'
import { SetMetadata, UseInterceptors, applyDecorators } from '@nestjs/common'

/**
 * Declare which event patterns (effects) to dispatch to the event emitter bus
 * once the decorated method has successfully completed.
 *
 * @export
 * @param {...string[]} effects - The event patterns to dispatch
 * @return {*}  {MethodDecorator}
 */
export function Dispatch(...effects: string[]): MethodDecorator {
  return applyDecorators(
    SetMetadata(DISPATCH_EFFECT, effects),
    UseInterceptors(EffectsInterceptor)
  )
}
