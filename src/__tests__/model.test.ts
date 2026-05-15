import type { TFile } from 'obsidian';
import { buildCrumbsModel } from '../model';

const file = (basename: string): TFile => ({ basename }) as TFile;

describe('buildCrumbsModel', () => {
	test('single-segment file with no children returns null', () => {
		const current = file('root');
		const result = buildCrumbsModel(current, [current]);
		expect(result).toBeNull();
	});

	test('single-segment file with children returns one segment plus children', () => {
		const current = file('root');
		const child = file('root.first');
		const result = buildCrumbsModel(current, [current, child]);
		expect(result).not.toBeNull();
		expect(result!.segments).toHaveLength(1);
		expect(result!.segments[0].shortName).toEqual('root');
		expect(result!.segments[0].isCurrent).toBe(true);
		expect(result!.segments[0].exists).toBe(true);
		expect(result!.segments[0].siblings).toEqual([]);
		expect(result!.children).toHaveLength(1);
		expect(result!.children[0].shortName).toEqual('first');
	});

	test('multi-segment file produces a segment per part', () => {
		const current = file('root.first.second');
		const result = buildCrumbsModel(current, [current]);
		expect(result).not.toBeNull();
		expect(result!.segments.map((s) => s.shortName)).toEqual([
			'root',
			'first',
			'second',
		]);
		expect(result!.segments.map((s) => s.fullName)).toEqual([
			'root',
			'root.first',
			'root.first.second',
		]);
		expect(result!.segments.map((s) => s.isCurrent)).toEqual([
			false,
			false,
			true,
		]);
	});

	test('intermediate virtual segments are marked as not existing', () => {
		const current = file('root.first.second');
		const result = buildCrumbsModel(current, [current]);
		expect(result!.segments.map((s) => s.exists)).toEqual([
			false,
			false,
			true,
		]);
	});

	test('intermediate segments are marked as existing when a real file matches', () => {
		const current = file('root.first.second');
		const root = file('root');
		const middle = file('root.first');
		const result = buildCrumbsModel(current, [current, root, middle]);
		expect(result!.segments.map((s) => s.exists)).toEqual([
			true,
			true,
			true,
		]);
	});

	test('sibling lists exclude the segment itself', () => {
		const current = file('root.a');
		const sibling = file('root.b');
		const result = buildCrumbsModel(current, [current, sibling]);
		const lastSegment = result!.segments[result!.segments.length - 1];
		expect(lastSegment.siblings.map((s) => s.shortName)).toEqual(['b']);
		expect(
			lastSegment.siblings.find((s) => s.fullName === 'root.a'),
		).toBeUndefined();
	});

	test('children entries carry exists flag based on real files', () => {
		const current = file('root');
		const realChild = file('root.alpha');
		const virtualChildSource = file('root.beta.deeper');
		const result = buildCrumbsModel(current, [
			current,
			realChild,
			virtualChildSource,
		]);
		const childByName = Object.fromEntries(
			result!.children.map((c) => [c.shortName, c]),
		);
		expect(childByName.alpha.exists).toBe(true);
		expect(childByName.beta.exists).toBe(false);
	});

	test('multi-segment file with no children has empty children array', () => {
		const current = file('root.first.second');
		const result = buildCrumbsModel(current, [current]);
		expect(result!.children).toEqual([]);
	});
});
