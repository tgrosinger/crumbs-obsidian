import type { TFile } from 'obsidian';
import { VirtualFile } from './file';

export interface MenuEntry {
	shortName: string;
	fullName: string;
	exists: boolean;
}

export interface Segment {
	shortName: string;
	fullName: string;
	isCurrent: boolean;
	exists: boolean;
	siblings: MenuEntry[];
}

export interface CrumbsModel {
	segments: Segment[];
	children: MenuEntry[];
}

export const buildCrumbsModel = (
	currentFile: TFile,
	allFiles: TFile[],
): CrumbsModel | null => {
	const currentVirtualFile = new VirtualFile(currentFile.basename);
	const rootName = currentVirtualFile.getRootName();

	const pagesTopLevel = allFiles.filter((f) =>
		f.basename.startsWith(rootName),
	);
	const realBasenames = new Set(pagesTopLevel.map((f) => f.basename));
	const virtualFilesTopLevel = pagesTopLevel.map(
		(p) => new VirtualFile(p.basename),
	);

	const filenameParts = currentFile.basename.split('.');
	const children = currentVirtualFile.getChildren(virtualFilesTopLevel);

	if (filenameParts.length === 1 && children.length === 0) {
		return null;
	}

	const toEntry = (file: VirtualFile): MenuEntry => ({
		shortName: file.getShortName(),
		fullName: file.name,
		exists: realBasenames.has(file.name),
	});

	const segments: Segment[] = filenameParts.map((_, i): Segment => {
		const fullName = filenameParts.slice(0, i + 1).join('.');
		const file = new VirtualFile(fullName);

		return {
			shortName: file.getShortName(),
			fullName: file.name,
			isCurrent: file.name === currentVirtualFile.name,
			exists: realBasenames.has(file.name),
			siblings: file.getSiblings(virtualFilesTopLevel).map(toEntry),
		};
	});

	return {
		segments,
		children: children.map(toEntry),
	};
};
