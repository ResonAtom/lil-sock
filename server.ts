import express from 'express'
import { Server, WebSocket, type Data } from 'ws'
import { type ClientRequest, type IncomingMessage} from 'http'

// Typing
interface LilWebSocket extends WebSocket {
	id: string
	role: Role
}
type Role = 'student'|'artist'



// Server logic


let students = new Map<string, {}>() // ws.id, data
let artists = new Map<string, {}>() // ws.id, data

type Poll = {
	question :string
	answers :string[]
}
let polls :Poll[] = []
polls.push({
	question: 'What is your favorite food group?',
	answers: [
		'Dairy',
		'Fruit',
		'Meat',
		'Sugar',
		'Bread',
	]
})
polls.push({
	question: 'What is the best day of the week?',
	answers: [
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Saturday',
		'Sunday',
		'All of the above.',
		'None of the above.',
		'It depends on the week.',
		'It depends what is meant by "best".',
	]
})
polls.push({
	question: 'How much wood would a woodchuck chuck if a woodchuck could chuck wood?',
	answers: [
		'1',
		'∞',
		'700 pounds',
		'320 kg',
		'361.9237001 cm³',
	]
})


let currentPoll = 0
let answers = new Map<string, number>()




// Websocket handling

const port = process.env.PORT || 3000
console.log('port',port)

const server = express()
	.use('/', express.static('dist'))
	.listen(port, () => console.log(`Listening on ${port}`))

const wss = new Server({ server })
wss.on('listening', () => console.log('wss listening'))
wss.on('headers', (headers, req) => console.log('wss headers', headers))
wss.on('error', error => console.log('wss error', error))
wss.on('close', () => console.log('wss close'))
wss.on('connection', (ws :LilWebSocket, req) => {
	ws.id = req.headers['sec-websocket-key']
	console.log('ws client', ws.id)

	ws.on('open', () => {
		console.log('client open')
	})
	ws.on('ping', (data) => {
		console.log('client ping', data)
	})
	ws.on('pong', (data) => {
		console.log('client pong', data)
	})
	ws.on('error', (error) => {
		console.log('client error', error)
	})
	ws.on('unexpected-response', (req, res) => {
		console.log('client unexpected', req, res)
	})
	ws.on('close', (code, reason) => {
		console.log('client close', code, reason)
	})
	ws.on('message', (data) => {
		const payload = JSON.parse(data.toString())
		if(payload.keepalive) return
		
		console.log('Client payload', payload)
		Object.entries(payload).forEach(([cmd, data]: [string, any]) => {
			switch(cmd) {
				case 'role':
					console.log('register', data)
					if(data === 'student' || data === 'artist') {
						ws.role = data
						ws.send(JSON.stringify({
							'poll': polls[currentPoll]
						}))
					}
					else {
						console.warn('Invalid role', data)
					}

				break
				default:
					console.warn('Unknown command', payload)
			}
		})
	})
})

// Send something to all clients or a role of them
function broadcast(ob :{}, role :Role|'all' = 'all') {
	wss.clients.forEach((client :LilWebSocket) => {
		if(role === 'all' || client.role === role) {
			client.send(JSON.stringify(ob))
		}
	})
}

// Keepalive
setInterval(() => {
	broadcast({
		keepalive: true
	})
}, 1000)
