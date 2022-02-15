<script lang="ts">

	console.log('artistload')
	export let ws :WebSocket

	let el :HTMLElement
	ws.onmessage = (event) => {
		const payload = JSON.parse(event.data.toString())
		if(payload.cmd.keepalive) return
		console.log('payload', payload)

		Object.entries(payload).forEach(([cmd, data]: [string, {}]) => {
			switch(cmd) {
				case 'question':
					console.log('question', data)

				break
				default:
					console.warn('Unknown command', payload)
			}
		})
	}


</script>

	
<h1>Welcome to Artist!</h1>

<p id="server-time"></p>


<style>
</style>