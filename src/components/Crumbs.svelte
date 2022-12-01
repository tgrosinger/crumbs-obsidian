<script lang="ts">
	import type { CrumbLevel } from 'src/breadcrumbs';
	import Link from './Link.svelte';

	export let crumbs: CrumbLevel[];

	// TODO: When on a child with no siblings, missing visual separator before last crumb.

	// TODO: Visual indicator if a note does not yet exist.
</script>

<div class="crumbs-bar">
	{#each crumbs as c}
		{#if c.listFiles.length === 0}
			<div class="crumbs-breadcrumb">
				<Link
					display={c.displayName}
					href={c.displayLink}
					isCurrentFile={c.isCurrentFile}
				/>
			</div>
		{:else}
			<details class="crumbs-breadcrumb">
				<summary>
					<Link
						display={c.displayName}
						href={c.displayLink}
						isCurrentFile={c.isCurrentFile}
					/>
				</summary>

				<ul class="crumbs-list">
					{#each c.listFiles as file}
						<li>
							<Link
								display={file.getShortName()}
								href={file.name}
								isCurrentFile={false}
							/>
						</li>
					{/each}
				</ul>
			</details>
		{/if}
	{/each}
</div>

<style>
	.crumbs-bar {
		display: flex;
	}
	.crumbs-breadcrumb {
		margin: 5px;
	}
</style>
