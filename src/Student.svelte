<script lang="ts">

	export let ws :WebSocket
	export let send: Function
	send({
		role: 'student',
	})

	let poll

	ws.onmessage = (event) => {
		const payload = JSON.parse(event.data.toString())
		if(payload.keepalive) return
		console.log('payload', payload)

		Object.entries(payload).forEach(([cmd, data]: [string, {}]) => {
			switch(cmd) {
				case 'poll':
					console.log('poll', data)

					poll = data

				break
				default:
					console.warn('Unknown command', payload)
			}
		})

	}

	let selected

	$: console.log('Updated options:', poll?.answers)
	$: console.log('Changed selected:', selected)
	$: send({
		response: selected,
	})
	


</script>

<svelte/>
	
<h2>Welcome, Student 📚</h2>

<h3>{poll?.question || 'Loading...'}</h3>

<fieldset class="form-group">
	{#each poll?.answers || [] as answer}
		<label class="paper-radio">
			<input type="radio" bind:group={selected} value={answer} />
			<span>{answer}</span>
		</label>
	{/each}
</fieldset>

<style>
</style>