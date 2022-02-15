<script lang="ts">

export let ws :WebSocket
	export let send: Function
	send({
		role: 'artist',
	})

	let poll
	let responses


	ws.onmessage = (event) => {
		const payload = JSON.parse(event.data.toString())
		if(payload.keepalive) return
		console.log('payload', payload)

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
				default:
					console.warn('Unknown command', payload)
			}
		})

	}


</script>

	
<h2>Welcome, Artist 🎨🖌️</h2>

<h3>{poll?.question || 'Loading...'}</h3>
<ul>
	{#each poll?.answers || [] as answer}
	<li>{answer}<span>{responses?.[answer] ? ': '+responses[answer] : ''}</span></li>
	{/each}
</ul>

<style>
</style>