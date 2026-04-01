
/**
 * The event dispatched to the event emitter bus via the EffectsInterceptor
 *
 * @export
 * @class DispatchedEffectEvent
 * @template T - The type of the event value
 * @template R - The type of the request object
 */
export class DispatchedEffectEvent<T, R> {
  /**
   * @param {T} value - The value returned from the decorated method
   * @param {R} request - The request object from the execution context (e.g., Express request)
   * @memberof DispatchedEffectEvent
   */
  constructor(
    readonly value: T,
    readonly request: R
  ) { }
}
