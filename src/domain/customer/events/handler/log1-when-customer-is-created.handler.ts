import EventHandlerInterface from '../../../@shared/event/event-handler.interface'
import CustomerCreatedEvent from '../customer-created.event'

export default class Log1WhenCustomerIsCreatedHandler
  implements EventHandlerInterface<CustomerCreatedEvent>
{
  handle(_: CustomerCreatedEvent): void {
    console.log('This is the first event console.log: CustomerCreated')
  }
}
