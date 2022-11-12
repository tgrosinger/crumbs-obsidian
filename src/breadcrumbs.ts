import { Component, MarkdownRenderer, TFile } from 'obsidian';
import { VirtualFile } from './file';

// TODO: Right click on a segment in the crumbs to rename it.

const makeLink = async (
	currentFile: string,
	displayName: string,
	displayLink: string | undefined,
	container: HTMLElement,
) => {
	if (!displayLink) {
		container.setText(displayName);
		return;
	}

	let subcontainer = container.createSpan();
	await MarkdownRenderer.renderMarkdown(
		`[[${displayLink}|${displayName}]]`,
		subcontainer,
		currentFile,
		null as unknown as Component,
	);

	let paragraph = subcontainer.querySelector(':scope > p');
	if (subcontainer.children.length == 1 && paragraph) {
		while (paragraph.firstChild) {
			subcontainer.appendChild(paragraph.firstChild);
		}
		subcontainer.removeChild(paragraph);
	}
};

const makeCrumb = async (
	currentFile: string,
	displayName: string,
	displayLink: string | undefined,
	listFiles: VirtualFile[],
): Promise<HTMLElement> => {
	if (listFiles.length === 0) {
		const el = createDiv({ cls: 'crumbs-breadcrumb' });
		await makeLink(currentFile, displayName, displayLink, el);
		return el;
	}

	const summary = createEl('summary');
	await makeLink(currentFile, displayName, displayLink, summary);

	const container = createDiv({ cls: 'crumbs-list' });
	const listMD = listFiles
		.map((f) => `- [[${f.name}|${f.getShortName()}]]`)
		.join('\n');
	await MarkdownRenderer.renderMarkdown(
		listMD,
		container,
		currentFile,
		null as unknown as Component,
	);

	const details = createEl('details', { cls: 'crumbs-breadcrumb' });
	details.appendChild(summary);
	details.appendChild(container);

	return details;
};

export const populateCrumbsContainer = async (
	el: HTMLDivElement,
	currentFile: TFile,
	allFiles: TFile[],
) => {
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

	if (filenameParts.length === 0 && children.length === 0) {
		return;
	}

	const breadcrumbs = await Promise.all(
		filenameParts.map(async (_, i): Promise<HTMLElement> => {
			const fullName = filenameParts.slice(0, i + 1).join('.');
			const file = new VirtualFile(fullName);
			return await makeCrumb(
				currentFile.basename,
				file.getShortName(),
				file.getPath(),
				file.getSiblings(virtualFilesTopLevel),
			);
		}),
	);
	breadcrumbs.push(
		await makeCrumb(currentFile.basename, 'Children', undefined, children),
	);

	breadcrumbs.forEach((bc) => {
		el.appendChild(bc);
	});
};
