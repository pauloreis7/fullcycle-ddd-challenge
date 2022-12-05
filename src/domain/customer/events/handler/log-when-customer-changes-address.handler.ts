import EventHandlerInterface from '../../../@shared/event/event-handler.interface'
import CustomerAddressChangedEvent from '../customer-address-changed.event'

export default class LogWhenCustomerChangesAddressHandler
  implements EventHandlerInterface<CustomerAddressChangedEvent>
{
  handle(event: CustomerAddressChangedEvent): void {
    console.log(
      `Customer address: ${event.eventData.id}, ${event.eventData.name} changed to: ${event.eventData.address.zip}, ${event.eventData.address.city}, ${event.eventData.address.street} ${event.eventData.address.number} `
    )
  }
}
