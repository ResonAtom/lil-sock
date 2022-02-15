<script lang="ts">
	export let ws :WebSocket
	export let send: Function
	export let doConfetti: Function

	send({
		role: 'artist',
	})

	let poll
	let responses

	ws.onmessage = (event) => {
		const payload = JSON.parse(event.data.toString())
		if(payload.keepalive) return

		Object.entries(payload).forEach(([cmd, data]: [string, any]) => {
			switch(cmd) {
				case 'poll':
					poll = data
				break
				case 'responses':
					responses = []
					for(let response of data){
						const [[studentId, studentResponse]] :any = Object.entries(response)
						console.log('response', studentId, studentResponse)
						responses[studentResponse] = (responses[studentResponse] || 0) +1
					}
				break
				case 'confetti':
					doConfetti()
				break
				
				default:
					console.warn('Unknown command', payload)
			}
		})
	}
</script>
	
<h2>Welcome, Artist 🎨🖌️</h2>
<h3>Responses to "{poll?.question || 'Loading...'}"</h3>
<ul>
	{#each poll?.answers || [] as answer}
	<li><span>{responses?.[answer] ? responses[answer] : 0}: </span>{answer}</li>
	{/each}
</ul>

<p><a href="{null}" on:click={() => send({advance: true})}>Next Poll</a></p>
<p><a href="{null}" on:click={() => send({confetti: true})}>Send Confetti</a></p>

<style>
	ul li:before {
		content: "";
	}
	ul li {
		padding: 5px;
		font-size: 24px;
	}
	ul li span {
		font-weight: bold;
	}
	p a {
		user-select: none;
	}
</style>