const Koa = require('koa')
const next = require('next')
const Router = require('koa-router')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const uuidv4 = require('uuid/v4')

app.prepare()
.then(() => {
    const server = new Koa()
    const router = new Router()

	server.use(async (ctx, next) => {
		let nonce = /*uuidv4()*/'potato';

		let csp = `default-src 'self' guac.live *.guac.live localhost:* wss://chat.guac.live; base-uri 'self'; script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-inline' 'unsafe-eval' www.google.com www.googletagmanager.com www.google-analytics.com www.gstatic.com *.googleapis.com guac.live *.guac.live localhost:* wss://chat.guac.live; child-src www.google.com guac.live *.guac.live localhost:* wss://chat.guac.live; style-src 'self' 'unsafe-inline' *.googleapis.com guac.live *.guac.live localhost:* cdnjs.cloudflare.com; img-src 'self' data: guac.live *.guac.live wss://chat.guac.live *.googleapis.com *.gstatic.com www.google-analytics.com; media-src 'self' guac.live *.guac.live localhost:* wss://chat.guac.live; connect-src 'self' guac.live *.guac.live localhost:* wss://chat.guac.live wss://guac.live www.google-analytics.com; font-src 'self' guac.live *.guac.live *.gstatic.com data: cdnjs.cloudflare.com; object-src 'none';`;
		ctx.res.setHeader('content-security-policy', csp);
		ctx.res.statusCode = 200
		ctx.state.nonce = nonce;
		await next()
	})

	router.get('/c/:name', async ctx => {
		await app.render(ctx.req, ctx.res, '/c', ctx.params)
		ctx.respond = false
	})

	router.get('*', async ctx => {
		await handle(ctx.req, ctx.res)
		ctx.respond = false
	})

    server.use(router.routes())

	server.listen(port, (err) => {
		if (err) throw err
		console.log(`> Ready on http://localhost:${port}`)
	})
})
