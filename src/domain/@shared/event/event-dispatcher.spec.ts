import CustomerCreatedEvent from '../../customer/events/costumer-created.event'
import Log1WhenCustomerIsCreatedHandler from '../../customer/events/handler/log1-when-customer-is-created.handler copy'
import Log2WhenCustomerIsCreatedHandler from '../../customer/events/handler/log2-when-customer-is-created.handler'
import SendEmailWhenProductIsCreatedHandler from '../../product/event/handler/send-email-when-product-is-created.handler'
import ProductCreatedEvent from '../../product/event/product-created.event'
import EventDispatcher from './event-dispatcher'

describe('Domain events tests', () => {
  it('should register an event handler', () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandler = new SendEmailWhenProductIsCreatedHandler()

    eventDispatcher.register('ProductCreatedEvent', eventHandler)

    expect(eventDispatcher.getEventHandlers.ProductCreatedEvent).toBeDefined()
    expect(eventDispatcher.getEventHandlers.ProductCreatedEvent.length).toBe(1)
    expect(
      eventDispatcher.getEventHandlers.ProductCreatedEvent[0]
    ).toMatchObject(eventHandler)
  })

  it('should unregister an event handler', () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandler = new SendEmailWhenProductIsCreatedHandler()

    eventDispatcher.register('ProductCreatedEvent', eventHandler)

    expect(
      eventDispatcher.getEventHandlers.ProductCreatedEvent[0]
    ).toMatchObject(eventHandler)

    eventDispatcher.unregister('ProductCreatedEvent', eventHandler)

    expect(eventDispatcher.getEventHandlers.ProductCreatedEvent).toBeDefined()
    expect(eventDispatcher.getEventHandlers.ProductCreatedEvent.length).toBe(0)
  })

  it('should unregister all event handlers', () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandler = new SendEmailWhenProductIsCreatedHandler()

    eventDispatcher.register('ProductCreatedEvent', eventHandler)

    expect(
      eventDispatcher.getEventHandlers.ProductCreatedEvent[0]
    ).toMatchObject(eventHandler)

    eventDispatcher.unregisterAll()

    expect(eventDispatcher.getEventHandlers.ProductCreatedEvent).toBeUndefined()
  })

  it('should notify all event product handlers', () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandler = new SendEmailWhenProductIsCreatedHandler()
    const spyEventHandler = jest.spyOn(eventHandler, 'handle')

    eventDispatcher.register('ProductCreatedEvent', eventHandler)

    expect(
      eventDispatcher.getEventHandlers.ProductCreatedEvent[0]
    ).toMatchObject(eventHandler)

    const productCreatedEvent = new ProductCreatedEvent({
      name: 'Product 1',
      description: 'Product 1 description',
      price: 10.0
    })

    eventDispatcher.notify(productCreatedEvent)

    expect(spyEventHandler).toHaveBeenCalled()
  })

  it('should notify all event customer handlers', () => {
    const eventDispatcher = new EventDispatcher()
    const log1WhenCustomerIsCreatedHandler =
      new Log1WhenCustomerIsCreatedHandler()
    const log2WhenCustomerIsCreatedHandler =
      new Log2WhenCustomerIsCreatedHandler()

    const spylog1EventHandler = jest.spyOn(
      log1WhenCustomerIsCreatedHandler,
      'handle'
    )
    const spylog2EventHandler = jest.spyOn(
      log2WhenCustomerIsCreatedHandler,
      'handle'
    )

    eventDispatcher.register(
      'CustomerCreatedEvent',
      log1WhenCustomerIsCreatedHandler
    )
    eventDispatcher.register(
      'CustomerCreatedEvent',
      log2WhenCustomerIsCreatedHandler
    )

    expect(
      eventDispatcher.getEventHandlers.CustomerCreatedEvent[0]
    ).toMatchObject(log1WhenCustomerIsCreatedHandler)

    expect(
      eventDispatcher.getEventHandlers.CustomerCreatedEvent[1]
    ).toMatchObject(log2WhenCustomerIsCreatedHandler)

    const customerCreatedEvent = new CustomerCreatedEvent({
      name: 'Customer 1',
      address: {
        street: 'Street 1',
        number: 1,
        zip: 'Zip 1',
        city: 'City 1'
      },
      active: true,
      rewardPoints: 1
    })

    eventDispatcher.notify(customerCreatedEvent)

    expect(spylog1EventHandler).toHaveBeenCalled()
    expect(spylog2EventHandler).toHaveBeenCalled()
  })
})
