import { db } from './db'

async function main() {
    // 1. Очистка от самых зависимых таблиц к главным
    await db.orm.public.OrderItem.where({}).deleteAll()
    await db.orm.public.Favorite.where({}).deleteAll()
    await db.orm.public.Order.where({}).deleteAll()
    await db.orm.public.Product.where({}).deleteAll()
    await db.orm.public.User.where({}).deleteAll()

    // 2. Создаём главного пользователя
    const user = await db.orm.public.User.create({
        first_name: 'Moni',
        last_name: 'Roy',
        email: 'moni@dashstack.io',
        phone: '+1234567890',
        gender: 'Female',
    })

    // 3. Создаём товары
    await db.orm.public.Product.createAll([
        {
        name: 'Apple Watch Series 4',
        category: 'Smart Watch',
        price: 690,
        stock: 63,
        colors: ['Black', 'Silver'],
        images: ['/watch.png'],
        },
        {
        name: 'AirPods Max',
        category: 'Headphones',
        price: 549,
        stock: 25,
        colors: ['Blue', 'Grey'],
        images: ['/airpods.png'],
        },
    ])

    const firstProduct = await db.orm.public.Product.first()

    // 4. Добавляем лайк, 10 заказов и позиции в OrderItem
    if (firstProduct) {
        await db.orm.public.Favorite.create({
            user_id: user.id,
            product_id: firstProduct.id,
        })

    const statuses = ['PENDING', 'PAID', 'SHIPPED', 'CANCELED'] as const

        for (let i = 1; i <= 10; i++) {
            const order = await db.orm.public.Order.create({
                customerName: `Клиент #${i}`,
                user_id: user.id,
                address: `Улица Примерная, д. ${i}`,
                type: 'Electronics',
                amount: firstProduct.price * 2,
                status: statuses[i % 4],
            })

            await db.orm.public.OrderItem.create({
                order_id: order.id,
                product_id: firstProduct.id,
                quantity: 2,
                price: firstProduct.price,
            })
        }
    }

    console.log('База успешно обновлена и заполнена!')
}

main()
