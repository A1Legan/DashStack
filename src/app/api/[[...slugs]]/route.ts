import { Elysia } from 'elysia'
import { productRouter } from '../../../server/routes/product'

const app = new Elysia({ prefix: '/api' })
    .get('/health', () => ({ status: 'ok', message: 'Elysia работает!' }))
    .use(productRouter)

export const GET = app.fetch
export const POST = app.fetch
export const PUT = app.fetch
export const DELETE = app.fetch
export const PATCH = app.fetch

export type App = typeof app
