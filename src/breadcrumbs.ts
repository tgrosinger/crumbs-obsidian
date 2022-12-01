import type { TFile } from 'obsidian';
import { VirtualFile } from './file';
import Crumbs from './components/Crumbs.svelte';

export interface CrumbLevel {
	displayName: string;
	displayLink: string | undefined;
	listFiles: VirtualFile[];
	isCurrentFile: boolean;
}

// TODO: Right click on a segment in the crumbs to rename it.

export const populateCrumbsContainer = (
	container: HTMLElement,
	currentFile: TFile,
	allFiles: TFile[],
): void => {
	const currentVirtualFile = new VirtualFile(currentFile.basename);
	const rootName = currentVirtualFile.getRootName();

	// Going forward, only consider the pages in pagesTopLevel, to avoid
	// searching through more of the vault files than necessary.
	const pagesTopLevel = allFiles.filter((f) => f.basename.startsWith(rootName));
	const virtualFilesTopLevel = pagesTopLevel.map(
		(p) => new VirtualFile(p.basename),
	);

	const filenameParts = currentFile.basename.split('.');
	const children = currentVirtualFile.getChildren(virtualFilesTopLevel);

	if (filenameParts.length === 1 && children.length === 0) {
		return;
	}

	const crumbs = filenameParts.map((_, i): CrumbLevel => {
		const fullName = filenameParts.slice(0, i + 1).join('.');
		const file = new VirtualFile(fullName);

		return {
			displayName: file.getShortName(),
			displayLink: file.name,
			listFiles: file.getSiblings(virtualFilesTopLevel),
			isCurrentFile: file.name === currentVirtualFile.name,
		};
	});

	if (children.length > 0) {
		crumbs.push({
			displayName: 'Children',
			displayLink: undefined,
			listFiles: children,
			isCurrentFile: false,
		});
	}

	new Crumbs({
		target: container,
		props: {
			crumbs,
		},
	});
};
