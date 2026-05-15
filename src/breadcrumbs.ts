import type { App, TFile } from 'obsidian';
import { buildCrumbsModel } from './model';
import { renderCrumbs } from './render';

export const populateCrumbsContainer = (
	container: HTMLElement,
	currentFile: TFile,
	allFiles: TFile[],
	app: App,
): void => {
	const model = buildCrumbsModel(currentFile, allFiles);
	if (!model) {
		return;
	}
	renderCrumbs(container, model, app);
};
