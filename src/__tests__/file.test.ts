import { VirtualFile } from '../file';

describe('equal', () => {
	test('when equal', () => {
		const left = new VirtualFile('root');
		const right = new VirtualFile('root');
		expect(left).toEqual(right);
	});

	test('when not equal', () => {
		const left = new VirtualFile('root');
		const right = new VirtualFile('toor');
		expect(left).not.toEqual(right);
	});

	test('when undefined', () => {
		const left = new VirtualFile('root');
		expect(left).not.toEqual(undefined);
	});
});

describe('getShortName', () => {
	test('when root file', () => {
		const input = new VirtualFile('root');
		const result = input.getShortName();
		expect(result).toEqual('root');
	});

	test('when two degrees', () => {
		const input = new VirtualFile('root.first');
		const result = input.getShortName();
		expect(result).toEqual('first');
	});

	test('when three degrees', () => {
		const input = new VirtualFile('root.first.second');
		const result = input.getShortName();
		expect(result).toEqual('second');
	});
});

describe('getRootName', () => {
	test('when root file', () => {
		const input = new VirtualFile('root');
		const result = input.getRootName();
		expect(result).toEqual('root');
	});

	test('when two degrees', () => {
		const input = new VirtualFile('root.first');
		const result = input.getRootName();
		expect(result).toEqual('root');
	});

	test('when three degrees', () => {
		const input = new VirtualFile('root.first.second');
		const result = input.getRootName();
		expect(result).toEqual('root');
	});
});

describe('getParent', () => {
	test('when root file', () => {
		const input = new VirtualFile('root');
		const result = input.getParent();
		expect(result).toBeUndefined;
	});

	test('when two degrees', () => {
		const input = new VirtualFile('root.first');
		const result = input.getParent();
		const expected = new VirtualFile('root');
		expect(expected).toEqual(result);
	});

	test('when three degrees', () => {
		const input = new VirtualFile('root.first.second');
		const result = input.getParent();
		const expected = new VirtualFile('root.first');
		expect(expected).toEqual(result);
	});
});

describe('isRoot', () => {
	test('when root file', () => {
		const input = new VirtualFile('root');
		expect(input.isRoot()).toBeTruthy;
	});

	test('when not root file', () => {
		const input = new VirtualFile('root.first');
		expect(input.isRoot()).toBeFalsy;
	});
});

describe('getDegree', () => {
	test('first', () => {
		const input = new VirtualFile('root');
		expect(input.getDegree()).toEqual(1);
	});

	test('second', () => {
		const input = new VirtualFile('root.first');
		expect(input.getDegree()).toEqual(2);
	});

	test('third', () => {
		const input = new VirtualFile('root.first.second');
		expect(input.getDegree()).toEqual(3);
	});
});

describe('getSiblings', () => {
	test('empty input', () => {
		const f = new VirtualFile('one.two');
		const input: VirtualFile[] = [];
		expect(f.getSiblings(input)).toEqual([]);
	});

	test('ignore self', () => {
		const f = new VirtualFile('one.two');
		const input = [f];
		expect(f.getSiblings(input)).toEqual([]);
	});

	test('direct sibling', () => {
		const f = new VirtualFile('one.two');
		const sib1 = new VirtualFile('one.two-a');
		const input = [f, sib1];
		expect(f.getSiblings(input)).toEqual([sib1]);
	});

	test('indirect sibling', () => {
		const f = new VirtualFile('one.two');
		const sib1 = new VirtualFile('one.two-a.three');
		const input = [f, sib1];
		const expected = new VirtualFile('one.two-a');
		expect(f.getSiblings(input)).toEqual([expected]);
	});

	test('similar name with spaces', () => {
		const f = new VirtualFile('one.two');
		const sib1 = new VirtualFile('one.two-a');
		const notSib = new VirtualFile('one two');
		const input = [f, sib1, notSib];
		expect(f.getSiblings(input)).toEqual([sib1]);
	});
});

describe('getChildren', () => {
	test('empty input', () => {
		const f = new VirtualFile('one.two');
		const input: VirtualFile[] = [];
		expect(f.getChildren(input)).toEqual([]);
	});

	test('direct children', () => {
		const f = new VirtualFile('one.two');
		const f1 = new VirtualFile('one.two.three-1');
		const f2 = new VirtualFile('one.two.three-2');
		const input = [f, f1, f2];
		expect(f.getChildren(input)).toEqual([f1, f2]);
	});

	test('indirect children', () => {
		const f = new VirtualFile('one.two');
		const f1 = new VirtualFile('one.two.three-1');
		const f2 = new VirtualFile('one.two.three-2');
		const f3 = new VirtualFile('one.two.three-3.four');
		const input = [f, f1, f2, f3];
		expect(f.getChildren(input)).toEqual([
			f1,
			f2,
			new VirtualFile('one.two.three-3'),
		]);
	});
});
