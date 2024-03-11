# Effects NestJS Module

This package is a plugin that dispatches events through the `@nestjs/event-emitter` package whenever a decorated controller method successfully completes. This is useful for logging, analytics, and other side effects that should not block the main request flow.

## Installation

```bash
npm install @knightinteractive/effects-nestjs
```

This is a private NPM repository. You will need to have the proper credentials to install this package.
[More Info](https://docs.npmjs.com/about-private-packages)

### Peer Dependencies

This package requires the following peer dependencies to be installed:

  * `@nestjs/common`
  * `@nestjs/core`
  * `@nestjs/event-emitter`
  * `reflect-metadata`
  * `rxjs`

> All peer dependencies are listed in the `peerDependencies` section of the `package.json` file. The required versions of these packages are defined in the `peerDependencies` stanza.

## Usage

Add the `EffectsModule` to your application's imports:

```typescript
import { Module } from '@nestjs/common'
import { EffectsModule } from '@knightinteractive/effects-nestjs'

@Module({
  imports: [
    EffectsModule.forRoot(),
  ],
})
export class AppModule { }
```

### Decorators

Decorate any controller method with the `Dispatch` decorator. The decorator takes one or more event patterns as
arguments.

```typescript
import { Controller, Post } from '@nestjs/common'
import { Dispatch } from '@knightinteractive/effects-nestjs'

@Controller('cats')
export class CatsController {

  @Post()
  @Dispatch('cats.*')
  create() {
    return { message: 'Cat created' }
  }
}
```

When and if the `CatsController.create` method successfully completes, an event will be dispatched with the pattern `cats.*`, which can be observed from any provider that listens for `@nestjs/event-emitter` events.

Each method to which `@Dispatch()` is applied automatically applies the `@UseInterceptors()` decorator with `EffectsInterceptor`, so there is no need to manually apply it anywhere in the application. The interceptor is responsible for dispatching the event after the method completes.

### Listening for Effect Events

```typescript
import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { DispatchedEffectEvent } from '@knightinteractive/effects-nestjs'

@Injectable()
export class CatsListener {

  @OnEvent('cats.*')
  handleCatEvent(event: DispatchedEffectEvent<{ message: string }>) {
    console.log('Cat event:', event.value) // { message: 'Cat created' }
  }
}
```

### Event Payload

The event payload is an instance of `DispatchedEffectEvent<T>` and contains the following properties:

  * `value` - The return value of the decorated method (if any). This is typed as `T` in the `DispatchEffect` decorator.
  * `context` - The context object of the decorated method, which contains the following information from the `express.Request` object:
    * `path` - The request path.
    * `params` - The request path.
    * `method` - The request method.
    * `query` - The request query parameters.
    * `body` - The request body.
    * `headers` - The request headers.
