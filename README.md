# Effects NestJS Module

A small NestJS helper that wraps controller handlers with an interceptor and emits an event via `@nestjs/event-emitter` when the request completes successfully. This makes it easy to run side effects after REST create/update/delete operations without blocking the main flow.

## Installation

```bash
npm install @nolawnchairs/effects-nestjs
```

This is a private NPM repository. You will need the proper credentials to install this package.
[More Info](https://docs.npmjs.com/about-private-packages)

### Peer Dependencies

This package requires the following peer dependencies to be installed:

  * `@nestjs/common`
  * `@nestjs/core`
  * `@nestjs/event-emitter`
  * `reflect-metadata`
  * `rxjs`

## Quick Start

Import the module once in your application:

```typescript
import { Module } from '@nestjs/common'
import { EffectsModule } from '@nolawnchairs/effects-nestjs'

@Module({
  imports: [EffectsModule.forRoot()],
})
export class AppModule {}
```

Decorate controller methods with `@Dispatch(...)` to emit events on successful completion:

```typescript
import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common'
import { Dispatch } from '@nolawnchairs/effects-nestjs'

@Controller('cats')
export class CatsController {
  @Post()
  @Dispatch('cats.created')
  create(@Body() body: { name: string }) {
    return { id: 'cat_123', name: body.name }
  }

  @Put(':id')
  @Dispatch('cats.updated')
  update(@Param('id') id: string, @Body() body: { name: string }) {
    return { id, name: body.name }
  }

  @Delete(':id')
  @Dispatch('cats.deleted')
  remove(@Param('id') id: string) {
    return { id }
  }
}
```

Each `@Dispatch()` call automatically applies `EffectsInterceptor` via `@UseInterceptors()`, so you do not need to wire the interceptor yourself.

## Listening for Events

Use the standard `@nestjs/event-emitter` API to subscribe:

```typescript
import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { DispatchedEffectEvent } from '@nolawnchairs/effects-nestjs'

@Injectable()
export class CatsListener {
  @OnEvent('cats.*')
  handleCatEvent(event: DispatchedEffectEvent<{ id: string; name?: string }>) {
    console.log('Cat event:', event.value)
  }
}
```

## Event Payload

The event payload is an instance of `DispatchedEffectEvent<T, R>` and contains:

  * `value` - The return value of the decorated method, typed as `T`.
  * `request` - The request object from the execution context, typed as `R` (e.g., Express).

## Notes

  * Events are emitted only after a handler completes successfully.
  * Errors thrown by the handler do not emit an event.
