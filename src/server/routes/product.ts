import { Elysia } from 'elysia'
import { db } from '../../prisma/db'
import z from 'zod/v4'

const createProductSchema = z.object({
    name: z.string().min(2).max(100).describe('Название должно быть от 2 до 100 символов'),
    category: z.string().min(2).max(100).describe('Категория должна быть от 2 до 100 символов'),
    description: z.string().min(2).max(1000).describe('Описание должно быть от 2 до 1000 символов').optional(),
    price: z.number().min(0).describe('Цена не может быть отрицательной'),
    stock: z.number().min(0).describe('Количество товара на складе не может быть отрицательным'),
    colors: z.array(z.string().min(1).max(50)).describe('Каждый цвет должен быть от 1 до 50 символов'),
    images: z.array(z.string()).describe('Каждое изображение должно быть валидным URL'),
})

export const productRouter = new Elysia({ prefix: '/products' })
.get('/', async () => {
    const products = await db.orm.public.Product.all()
    return products
})
.post('/', async ({ body }) => {
    const product = await db.orm.public.Product.create(body)
    return product
},
{
    body: createProductSchema,
})