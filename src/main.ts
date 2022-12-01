import { MarkdownView, Plugin } from 'obsidian';
import { populateCrumbsContainer } from './breadcrumbs';

const breadcrumbClass = 'crumbs-container';

export default class CrumbsPlugin extends Plugin {
	public async onload(): Promise<void> {
		app.workspace.onLayoutReady(async () => {
			await drawTrail(this);

			this.registerEvent(
				app.workspace.on('file-open', async () => {
					await drawTrail(this);
				}),
			);
		});
	}

	public onunload(): void {
		const activeMDView = app.workspace.getActiveViewOfType(MarkdownView);
		if (!activeMDView) {
			return;
		}

		activeMDView.containerEl
			.querySelectorAll(`.${breadcrumbClass}`)
			?.forEach((el) => el.remove());
	}
}

const drawTrail = async (plugin: CrumbsPlugin): Promise<void> => {
	const activeMDView = app.workspace.getActiveViewOfType(MarkdownView);
	if (!activeMDView) {
		return;
	}

	activeMDView.containerEl
		.querySelectorAll(`.${breadcrumbClass}`)
		?.forEach((el) => el.remove());

	const mode = activeMDView.getMode();
	const view =
		mode === 'preview'
			? activeMDView.previewMode.containerEl.querySelector(
					'div.markdown-preview-view',
			  )
			: activeMDView.contentEl.querySelector('div.markdown-source-view');

	if (!view) {
		return;
	}

	const { file } = activeMDView;
	const allFiles = plugin.app.vault.getMarkdownFiles();

	const trailDiv = createDiv({ cls: breadcrumbClass });
	populateCrumbsContainer(trailDiv, file, allFiles);

	if (mode === 'preview') {
		view.querySelector('div.markdown-preview-sizer')?.before(trailDiv);
	} else {
		view.querySelector('div.cm-contentContainer')?.before(trailDiv);
	}
};
