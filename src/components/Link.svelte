<script lang="ts">
	import { openOrSwitch } from 'obsidian-community-lib/dist/utils';

	export let display: string;
	export let href: string | undefined;
	export let isCurrentFile: boolean;

	const onClick = async (e: MouseEvent): Promise<void> => {
		e.preventDefault();
		if (href) {
			await openOrSwitch(href, e);
		}
	};
</script>

{#if href && !isCurrentFile}
	<a
		class="internal-link crumbs-link"
		href={href}
		on:click={onClick}
	>
		{display}
	</a>
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
