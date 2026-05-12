import { MarkdownView, Plugin } from 'obsidian';
import { populateCrumbsContainer } from './breadcrumbs';

const breadcrumbClass = 'crumbs-container';

export default class CrumbsPlugin extends Plugin {
	public async onload(): Promise<void> {
		this.app.workspace.onLayoutReady(async () => {
			await drawTrail(this);

			this.registerEvent(
				this.app.workspace.on('file-open', async () => {
					await drawTrail(this);
				}),
			);
		});
	}

	public onunload(): void {
		const activeMDView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!activeMDView) {
			return;
		}

		activeMDView.containerEl
			.querySelectorAll(`.${breadcrumbClass}`)
			?.forEach((el: Element) => el.remove());
	}
}

const drawTrail = async (plugin: CrumbsPlugin): Promise<void> => {
	const activeMDView = plugin.app.workspace.getActiveViewOfType(MarkdownView);
	if (!activeMDView) {
		return;
	}

	activeMDView.containerEl
		.querySelectorAll(`.${breadcrumbClass}`)
		?.forEach((el: Element) => el.remove());

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
	if (!file) {
		return;
	}
	const allFiles = plugin.app.vault.getMarkdownFiles();

	const trailDiv = createDiv({ cls: breadcrumbClass });
	populateCrumbsContainer(trailDiv, file, allFiles);

	if (mode === 'preview') {
		view.querySelector('div.markdown-preview-sizer')?.before(trailDiv);
	} else {
		view.querySelector('div.cm-contentContainer')?.before(trailDiv);
	}
};
