<link rel="stylesheet" href="https://unpkg.com/papercss@1.8.3/dist/paper.min.css">

<script lang="ts">
	import confetti from 'canvas-confetti'
	import Student from './Student.svelte'
	import Artist from './Artist.svelte'
	const pages = [
		{name: 'Student', component: Student },
		{name: 'Artist', component: Artist },
	]
	let pageSelected = pages[0]

	const host = location.origin.replace(/^http/, 'ws').replace(/3001$/, '3000')
	console.log('host', host)

	let ws = new WebSocket(host)
	ws.onopen = (event) => {
		console.log('opened', event)
	}
	let send = (ob :{}) => { 
		// Send only once websocket is open, so that sub Component can call this on init
		if(ws.readyState === WebSocket.OPEN) {
			ws.send(JSON.stringify(ob))
		}
		else {
			setTimeout(() => send(ob), 100)
		}
	}

	let doConfetti = () => { 
		confetti({
			spread: 180
		})
	}
</script>

<div id="container">
	<h1>LiLsock</h1>

	<select bind:value={pageSelected}>
		{#each pages as option}
			<option value={option}>{option.name}</option>
		{/each}
	</select>

	<svelte:component this={pageSelected.component} 
		ws={ws} 
		send={send} 
		doConfetti={doConfetti} 
	/>
</div>

<style>
	#container {
		padding: 0px;
		padding-left: 20px;
	}
	#container h1{
		margin: 0;
		font-size: 4rem;
	}

	#container select{
		position:absolute;
		top: 20px;
		right: 20px;
	}

	:global h2 {
		margin: 0px;
	}
</style>