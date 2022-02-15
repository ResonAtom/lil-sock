<script lang="ts">

	const HOST = location.origin.replace(/^http/, 'ws').replace(/3001$/, '3000')
	console.log('HOST', HOST)
	let ws = new WebSocket(HOST)
	let el :HTMLElement
	ws.onmessage = (event) => {
		el = document.getElementById('server-time')
		el.innerHTML = 'Server time: ' + event.data
	}

	// import { init } from './timer'
	// const counter = init()

</script>

<svelte/>
	
<h1>Welcome to LiLsock!</h1>

<p id="server-time"></p>

<style>
</style>