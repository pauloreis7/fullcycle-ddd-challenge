import EventInterface from '../../@shared/event/event.interface'

interface EventDataProps {
  id: string
  name: string
  address: {
    street: string
    number: number
    zip: string
    city: string
  }
}

export default class CustomerAddressChangedEvent implements EventInterface {
  dataTimeOccurred: Date
  eventData: EventDataProps

  constructor(eventData: EventDataProps) {
    this.dataTimeOccurred = new Date()
    this.eventData = eventData
  }
}
