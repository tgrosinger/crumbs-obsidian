import { Menu, setIcon, type App } from 'obsidian';
import type { CrumbsModel, MenuEntry, Segment } from './model';

export const renderCrumbs = (
	container: HTMLElement,
	model: CrumbsModel,
	app: App,
): void => {
	const bar = container.createDiv({ cls: 'crumbs-bar' });

	model.segments.forEach((segment, idx) => {
		if (idx > 0) {
			bar.createSpan({ cls: 'crumbs-separator', text: '/' });
		}
		renderSegment(bar, segment, app);
	});

	if (model.children.length > 0) {
		bar.createSpan({ cls: 'crumbs-separator', text: '/' });
		const childrenGroup = bar.createDiv({ cls: 'crumbs-children' });
		addChevron(childrenGroup, model.children, app, 'Show children');
	}
};

const renderSegment = (
	parent: HTMLElement,
	segment: Segment,
	app: App,
): void => {
	const group = parent.createDiv({ cls: 'crumbs-segment' });

	const nameClasses = ['crumbs-segment-name'];
	if (segment.isCurrent) nameClasses.push('is-current');
	if (!segment.exists) nameClasses.push('is-missing');

	if (segment.isCurrent) {
		group.createSpan({
			cls: nameClasses.join(' '),
			text: segment.shortName,
		});
	} else {
		const link = group.createEl('a', {
			cls: nameClasses.join(' '),
			text: segment.shortName,
			href: segment.fullName,
		});
		link.addEventListener('click', (e) => {
			e.preventDefault();
			openLink(segment.fullName, app, e);
		});
	}

	if (segment.siblings.length > 0) {
		addChevron(
			group,
			segment.siblings,
			app,
			`Show siblings of ${segment.shortName}`,
		);
	}
};

const addChevron = (
	parent: HTMLElement,
	entries: MenuEntry[],
	app: App,
	ariaLabel: string,
): void => {
	const button = parent.createEl('button', {
		cls: 'crumbs-chevron clickable-icon',
		attr: { type: 'button', 'aria-label': ariaLabel },
	});
	setIcon(button, 'chevron-down');
	button.addEventListener('click', (e) => {
		e.preventDefault();
		e.stopPropagation();
		showMenu(e, entries, app);
	});
};

const showMenu = (
	event: MouseEvent,
	entries: MenuEntry[],
	app: App,
): void => {
	const menu = new Menu();
	for (const entry of entries) {
		menu.addItem((item) => {
			const title = entry.exists
				? entry.shortName
				: createFragment((frag) => {
						frag.createSpan({
							cls: 'crumbs-menu-item-missing-title',
							text: entry.shortName,
						});
				  });
			item.setTitle(title).onClick((evt) => {
				openLink(entry.fullName, app, evt);
			});
		});
	}
	menu.showAtMouseEvent(event);
};

const openLink = (
	linkText: string,
	app: App,
	event: MouseEvent | KeyboardEvent,
): void => {
	const newLeaf = event.ctrlKey || event.metaKey;
	void app.workspace.openLinkText(linkText, '', newLeaf);
};
