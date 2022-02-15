<script lang="ts">

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
	let send = (ob :{}) => {
		console.log('sending...', ob)
		ws.send(JSON.stringify(ob))
	}
	// let el :HTMLElement
	// ws.onmessage = (event) => {
	// 	el = document.getElementById('server-time')
	// 	el.innerHTML = 'Server time: ' + event.data
	// }

	// import { init } from './timer'
	// const counter = init()
	



</script>

<h1>Welcome to LiLsock!</h1>

<select bind:value={pageSelected}>
	{#each pages as option}
		<option value={option}>{option.name}</option>
	{/each}
</select>

<svelte:component this={pageSelected.component} ws={ws} send={send} />
	

<!-- <p id="server-time"></p> -->

<style>
</style>