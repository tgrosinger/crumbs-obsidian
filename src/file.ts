export class VirtualFile {
	public name: string;
	private readonly nameParts: string[];

	constructor(name: string) {
		this.name = name;
		this.nameParts = this.name.split('.');
	}

	public getPath(): string {
		return this.name + '.md';
	}

	// getDegree returns the number of name segments this file contains.
	// e.g. One.Two.Three => 3
	public getDegree(): number {
		return this.nameParts.length;
	}

	public getShortName(): string {
		return this.nameParts[this.nameParts.length - 1];
	}

	public getRootName(): string {
		return this.nameParts[0];
	}

	public truncateToDegree(degree: number): string {
		return this.nameParts.slice(0, degree).join('.');
	}

	// isRoot returns true is this file has no parent.
	public isRoot(): boolean {
		return this.getDegree() === 1;
	}

	// getParent returns a VirtualFile that would be the parent of this file. If
	// this file is the root, it returns undefined.
	public getParent(): VirtualFile | undefined {
		if (this.isRoot()) {
			return undefined;
		}

		const parentName = this.nameParts.slice(0, -1).join('.');
		return new VirtualFile(parentName);
	}

	public getSiblings(allFiles: VirtualFile[]): VirtualFile[] {
		if (this.isRoot()) {
			return [];
		}

		const commonParent = this.getParent();
		if (!commonParent) {
			return [];
		}

		const currentDegree = this.getDegree();

		return allFiles
			.map((f) => f.truncateToDegree(currentDegree))
			.filter(
				(n) =>
					n !== this.name &&
					n !== commonParent.name &&
					n.startsWith(commonParent.name),
			)
			.filter((n, i, arr) => arr.indexOf(n) === i)
			.map((n) => new VirtualFile(n));
	}

	public getChildren(allFiles: VirtualFile[]): VirtualFile[] {
		const targetDegree = this.getDegree() + 1;
		return allFiles
			.map((f) => f.truncateToDegree(targetDegree))
			.filter((n) => n.startsWith(this.name) && n !== this.name)
			.filter((n, i, arr) => arr.indexOf(n) === i)
			.map((n) => new VirtualFile(n));
	}
}
