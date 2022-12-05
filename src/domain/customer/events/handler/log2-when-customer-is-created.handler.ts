import EventHandlerInterface from '../../../@shared/event/event-handler.interface'
import CustomerCreatedEvent from '../customer-created.event'

export default class Log2WhenCustomerIsCreatedHandler
  implements EventHandlerInterface<CustomerCreatedEvent>
{
  handle(_: CustomerCreatedEvent): void {
    console.log('This is the second event console.log: CustomerCreated')
  }
}
