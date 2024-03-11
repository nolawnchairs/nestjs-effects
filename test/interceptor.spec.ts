
import { lastValueFrom, of } from 'rxjs'
import { EFFECTS_MODULE_OPTIONS } from '../src/constants'
import { Dispatch } from '../src/dispatch.decorator'
import { EffectsInterceptor } from '../src/effects.interceptor'
import { CallHandler, Controller, ExecutionContext, Post } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Test, TestingModule } from '@nestjs/testing'

// Sample Controller
@Controller()
class SampleController {
  @Post()
  @Dispatch('effect1', 'effect2')
  sampleMethod() {
    return { foo: 'bar' }
  }
}

describe('EffectsInterceptor', () => {
  let interceptor: EffectsInterceptor
  let reflector: Reflector
  let emitter: EventEmitter2
  let sampleController: SampleController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SampleController],
      providers: [
        EffectsInterceptor,
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
        {
          provide: EFFECTS_MODULE_OPTIONS,
          useValue: {
            logErrors: true,
          },
        },
      ],
    }).compile()

    interceptor = module.get<EffectsInterceptor>(EffectsInterceptor)
    reflector = module.get<Reflector>(Reflector)
    emitter = module.get<EventEmitter2>(EventEmitter2)
    sampleController = module.get<SampleController>(SampleController)
  })

  it('should be defined', () => {
    expect(interceptor).toBeDefined()
  })

  it('should intercept and emit events with correct data', async () => {
    const requestMock = {
      params: {/* mock params */ },
      path: 'mockedPath',
      url: 'mockedUrl',
      query: {/* mock query */ },
      headers: {/* mock headers */ },
      body: {/* mock body */ },
    }

    const context: ExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(requestMock),
      }),
      getHandler: jest.fn().mockReturnValue(sampleController.sampleMethod),
      getClass: jest.fn().mockReturnValue(SampleController),
    } as any

    const next: CallHandler<any> = {
      handle: jest.fn().mockReturnValue(of(sampleController.sampleMethod())),
    };

    // Mock behavior for reflector.get()
    (reflector.get as jest.Mock).mockReturnValueOnce(['effect1', 'effect2'])

    await lastValueFrom(interceptor.intercept(context, next))

    expect(emitter.emit).toHaveBeenCalledWith(
      'effect1',
      expect.objectContaining({
        value: {
          foo: 'bar',
        },
        context: requestMock,
      })
    )
  })
})
