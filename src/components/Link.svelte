<script lang="ts">
	import { openOrSwitch } from 'obsidian-community-lib/dist/utils';

	export let display: string;
	export let href: string | undefined;
	export let isCurrentFile: boolean;
</script>

{#if href && !isCurrentFile}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<span
		class="internal-link crumbs-link"
		on:click={async (e) => await openOrSwitch(href, e)}
	>
		{display}
	</span>
{:else}
	<span>{display}</span>
{/if}

<style>
	.crumbs-link {
		cursor: pointer;
		color: var(--text-accent);
		text-decoration: underline;
	}
	.crumbs-link:hover {
		color: var(--text-accent-hover);
	}
</style>
