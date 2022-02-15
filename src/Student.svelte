<script lang="ts">

	console.log('studentload')
	export let ws :WebSocket
	export let send: Function

	ws.onopen = (event) => {
		console.log('opened', event)
		send({
			role: 'student',
		})
	}

	let el :HTMLElement
	ws.onmessage = (event) => {
		const payload = JSON.parse(event.data.toString())
		if(payload.keepalive) return
		console.log('payload', payload)

		Object.entries(payload).forEach(([cmd, data]: [string, {}]) => {
			switch(cmd) {
				case 'poll':
					console.log('poll', data)

				break
				default:
					console.warn('Unknown command', payload)
			}
		})

		// el = document.getElementById('server-time')
		// el.innerHTML = 'Server time: ' + event.data
	}

</script>

<svelte/>
	
<h1>Welcome to Student!</h1>

<p id="server-time"></p>


<style>
</style>