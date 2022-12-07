import { Sequelize } from 'sequelize-typescript'

import Order from '../../../../domain/checkout/entity/order'
import OrderItem from '../../../../domain/checkout/entity/order_item'
import Customer from '../../../../domain/customer/entity/customer'
import Address from '../../../../domain/customer/value-object/address'
import Product from '../../../../domain/product/entity/product'
import CustomerModel from '../../../customer/repository/sequelize/customer.model'
import CustomerRepository from '../../../customer/repository/sequelize/customer.repository'
import ProductModel from '../../../product/repository/sequelize/product.model'
import ProductRepository from '../../../product/repository/sequelize/product.repository'
import OrderItemModel from './order-item.model'
import OrderModel from './order.model'
import OrderRepository from './order.repository'

describe('Order repository test', () => {
  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel
    ])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('should create a new order', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('123', 'Customer 1')
    const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
    customer.changeAddress(address)
    await customerRepository.create(customer)

    const productRepository = new ProductRepository()
    const product = new Product('123', 'Product 1', 10)
    await productRepository.create(product)

    const ordemItem = new OrderItem(
      '1',
      product.name,
      product.price,
      product.id,
      2
    )

    const order = new Order('123', '123', [ordemItem])

    const orderRepository = new OrderRepository()
    await orderRepository.create(order)

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ['items']
    })

    expect(orderModel.toJSON()).toStrictEqual({
      id: '123',
      customer_id: '123',
      total: order.total(),
      items: [
        {
          id: ordemItem.id,
          name: ordemItem.name,
          price: ordemItem.price,
          quantity: ordemItem.quantity,
          order_id: '123',
          product_id: '123'
        }
      ]
    })
  })

  it('should update an order', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('123', 'Customer 1')
    const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
    customer.changeAddress(address)
    await customerRepository.create(customer)

    const productRepository = new ProductRepository()
    const product = new Product('123', 'Product 1', 10)
    await productRepository.create(product)

    const ordemItem1 = new OrderItem(
      '1',
      product.name,
      product.price,
      product.id,
      2
    )

    const order = new Order('123', customer.id, [ordemItem1])
    const orderRepository = new OrderRepository()
    await orderRepository.create(order)

    let orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ['items']
    })

    expect(orderModel.toJSON()).toStrictEqual({
      id: '123',
      customer_id: '123',
      total: 20,
      items: [
        {
          id: ordemItem1.id,
          name: ordemItem1.name,
          price: ordemItem1.price,
          quantity: ordemItem1.quantity,
          order_id: '123',
          product_id: '123'
        }
      ]
    })

    const product2 = new Product('456', 'Product 2', 20)
    await productRepository.create(product2)

    const ordemItem2 = new OrderItem(
      '2',
      product2.name,
      product2.price,
      product2.id,
      3
    )

    const updatedOrder = new Order('123', customer.id, [ordemItem1, ordemItem2])

    await orderRepository.update(updatedOrder)

    orderModel = await OrderModel.findOne({
      where: { id: updatedOrder.id },
      include: ['items']
    })

    expect(orderModel.toJSON()).toStrictEqual({
      id: updatedOrder.id,
      customer_id: updatedOrder.customerId,
      total: updatedOrder.total(),
      items: [
        {
          id: ordemItem1.id,
          name: ordemItem1.name,
          price: ordemItem1.price,
          quantity: ordemItem1.quantity,
          order_id: '123',
          product_id: '123'
        },
        {
          id: ordemItem2.id,
          name: ordemItem2.name,
          price: ordemItem2.price,
          quantity: ordemItem2.quantity,
          order_id: '123',
          product_id: '456'
        }
      ]
    })
  })

  it('should find an order by id', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('123', 'Customer 1')
    const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
    customer.changeAddress(address)
    await customerRepository.create(customer)

    const productRepository = new ProductRepository()
    const product = new Product('123', 'Product 1', 10)
    await productRepository.create(product)

    const ordemItem = new OrderItem(
      '1',
      product.name,
      product.price,
      product.id,
      2
    )

    const order = new Order('123', '123', [ordemItem])

    const orderRepository = new OrderRepository()
    await orderRepository.create(order)

    const orderExits = await orderRepository.find(order.id)

    expect(order).toStrictEqual(orderExits)
  })

  it('should find all orders', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('123', 'Customer 1')
    const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
    customer.changeAddress(address)
    await customerRepository.create(customer)

    const productRepository = new ProductRepository()
    const product = new Product('123', 'Product 1', 10)
    await productRepository.create(product)

    const ordemItem = new OrderItem(
      '1',
      product.name,
      product.price,
      product.id,
      1
    )

    const ordemItem2 = new OrderItem(
      '2',
      product.name,
      product.price,
      product.id,
      2
    )

    const ordemItem3 = new OrderItem(
      '3',
      product.name,
      product.price,
      product.id,
      3
    )

    const orderRepository = new OrderRepository()

    const order = new Order('123', '123', [ordemItem])
    await orderRepository.create(order)

    const order2 = new Order('456', '123', [ordemItem2, ordemItem3])
    await orderRepository.create(order2)

    const foundOrders = await orderRepository.findAll()
    const orders = [order, order2]

    expect(foundOrders).toHaveLength(2)
    expect(orders).toEqual(foundOrders)
  })
})
