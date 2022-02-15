import express from 'express'
import { Server } from 'ws'

const PORT = process.env.PORT || 3000
console.log('PORT',PORT)

const server = express()
	// .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
	.use('/', express.static('dist'))
	.listen(PORT, () => console.log(`Listening on ${PORT}`))

const wss = new Server({ server })
wss.on('connection', (ws) => {
	console.log('Client connected')
	ws.on('close', () => console.log('Client disconnected'))
})

setInterval(() => {
	wss.clients.forEach((client) => {
		client.send(new Date().toTimeString())
	})
}, 1000)
