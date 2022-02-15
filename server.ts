import express from 'express'
import { Server, WebSocket, type Data } from 'ws'
import { type ClientRequest, type IncomingMessage} from 'http'

// Typing
type Role = 'student'|'artist'
interface LilWebSocket extends WebSocket {
	id: string
	role: Role
}

// Server logic
type Poll = {
	id :number,
	question :string
	answers :string[]
}
let polls :Map<number, Poll> = new Map()
polls.set(0, {
	id: 0,
	question: 'What is your favorite food group?',
	answers: [
		'Dairy',
		'Fruit',
		'Meat',
		'Sugar',
		'Bread',
	]
})
polls.set(1, {
	id: 1,
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
polls.set(2, {
	id: 2,
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

let responses = new Map<string, string>()
const responsesSend = () => {
	return Array.from(responses, e => ({[e[0]]: e[1]}))
}

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
					if(data === 'student' || data === 'artist') {
						ws.role = data
						ws.send(JSON.stringify({
							poll: polls.get(currentPoll)
						}))
						if(data === 'artist') {
							ws.send(JSON.stringify({
								responses: responsesSend()
							}))
						}
					}
					else {
						console.warn('Invalid role', data)
					}
				break
				case 'response':
					const answer = polls.get(currentPoll).answers.find(a => a === data)
					if(answer) {
						responses.set(ws.id, answer)
						broadcast({
							responses: responsesSend()
						}, 'artist')
					}
					else {
						console.warn('Answer not found', data)
					}
				break
				case 'advance':
					currentPoll++
					if(currentPoll >= polls.size) {
						currentPoll = 0
					}
					responses.clear()
					broadcast({
						responses: responsesSend()
					}, 'artist')

					broadcast({
						poll: polls.get(currentPoll)
					})
				break
				case 'confetti':
					broadcast({confetti: true})
				break

				default:
					console.warn('Unknown command', payload)
			}
		})
	})
})

// Helper functions

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
}, 10_000)
