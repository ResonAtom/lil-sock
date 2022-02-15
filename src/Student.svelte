<script lang="ts">
	export let ws :WebSocket
	export let send: Function
	export let doConfetti: Function

	send({
		role: 'student',
	})

	let poll
	let selected

	ws.onmessage = (event) => {
		const payload = JSON.parse(event.data.toString())
		if(payload.keepalive) return

		Object.entries(payload).forEach(([cmd, data]: [string, {}]) => {
			switch(cmd) {
				case 'poll':
					poll = data
					selected = null
				break
				case 'confetti':
					doConfetti()
				break
				
				default:
					console.warn('Unknown command', payload)
			}
		})
	}
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
	fieldset label {
		font-size: 24px;
	}
</style>