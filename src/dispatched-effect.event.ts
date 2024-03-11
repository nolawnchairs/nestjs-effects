
import { Request } from 'express'

export type EffectContext = Pick<Request, 'path' | 'params' | 'query' | 'body' | 'url' | 'headers'>

/**
 * The event dispatched to the event emitter bus via the EffectsInterceptor
 *
 * @export
 * @class DispatchedEffectEvent
 * @template T - The type of the event value
 */
export class DispatchedEffectEvent<T> {
  /**
   * @param {T} value - The value returned from the decorated method
   * @param {EffectContext} context - The request context
   * @memberof DispatchedEffectEvent
   */
  constructor(
    readonly value: T,
    readonly context: EffectContext
  ) { }
}
