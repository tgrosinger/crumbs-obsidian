import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import obsidianmd from 'eslint-plugin-obsidianmd';
import globals from 'globals';
import { globalIgnores } from 'eslint/config';

export default tseslint.config(
	js.configs.recommended,
	...tseslint.configs.recommended,
	...obsidianmd.configs.recommended,
	{
		languageOptions: {
			globals: {
				...globals.browser,
				createDiv: 'readonly',
				createEl: 'readonly',
				createFragment: 'readonly',
				createSpan: 'readonly',
				activeDocument: 'readonly',
				activeWindow: 'readonly',
			},
			parserOptions: {
				projectService: {
					allowDefaultProject: [
						'eslint.config.mjs',
						'jest.config.js',
						'manifest.json',
					],
				},
				tsconfigRootDir: import.meta.dirname,
				extraFileExtensions: ['.json'],
			},
		},
	},
	{
		files: ['**/*.ts'],
		rules: {
			'@typescript-eslint/array-type': 'error',
			'@typescript-eslint/await-thenable': 'error',
			'@typescript-eslint/consistent-type-assertions': 'error',
			'@typescript-eslint/consistent-type-definitions': 'error',
			'@typescript-eslint/explicit-function-return-type': [
				'error',
				{ allowExpressions: true },
			],
			'@typescript-eslint/explicit-member-accessibility': [
				'error',
				{
					accessibility: 'explicit',
					overrides: {
						accessors: 'explicit',
						constructors: 'off',
						parameterProperties: 'explicit',
					},
				},
			],
			'@typescript-eslint/member-ordering': [
				'error',
				{
					default: [
						'public-static-field',
						'protected-static-field',
						'private-static-field',
						'public-static-method',
						'protected-static-method',
						'private-static-method',
						'public-instance-field',
						'protected-instance-field',
						'private-instance-field',
						'constructor',
						'public-instance-method',
						'protected-instance-method',
						'private-instance-method',
					],
				},
			],
			'@typescript-eslint/naming-convention': [
				'error',
				{
					selector: 'variable',
					format: ['camelCase', 'PascalCase', 'snake_case', 'UPPER_CASE'],
					leadingUnderscore: 'allow',
				},
				{ selector: 'typeLike', format: ['PascalCase'] },
				{ selector: 'enumMember', format: ['PascalCase'] },
			],
			'@typescript-eslint/no-extraneous-class': 'error',
			'@typescript-eslint/no-non-null-assertion': 'error',
			'@typescript-eslint/no-this-alias': ['error', { allowDestructuring: true }],
			'@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
			'@typescript-eslint/no-unnecessary-type-assertion': 'error',
			'@typescript-eslint/prefer-function-type': 'error',
			'@typescript-eslint/prefer-readonly': 'error',
			'no-shadow': 'off',
			'@typescript-eslint/no-shadow': 'error',
			'arrow-body-style': ['error', 'as-needed'],
			curly: ['error', 'multi-line'],
			eqeqeq: 'error',
			'linebreak-style': ['error', 'unix'],
			'new-parens': 'error',
			'no-caller': 'error',
			'no-cond-assign': ['error', 'always'],
			'no-else-return': 'error',
			'no-eval': 'error',
			'no-new-wrappers': 'error',
			'no-param-reassign': 'error',
			'no-restricted-globals': [
				'error',
				'length',
				'name',
				{ name: 'isFinite', message: 'Use the more strict Number.isFinite.' },
				{ name: 'isNaN', message: 'Use the more strict Number.isNaN.' },
			],
			'no-restricted-properties': [
				'error',
				{
					property: 'bind',
					message: 'Native? Use an arrow function. jQuery? Use .on()',
				},
			],
			'no-return-await': 'error',
			'no-self-compare': 'error',
			'no-sequences': 'error',
			'no-template-curly-in-string': 'error',
			'no-throw-literal': 'error',
			'no-var': 'error',
			'object-shorthand': 'error',
			'one-var': ['error', 'never'],
			'prefer-const': ['error', { destructuring: 'all' }],
			'prefer-object-spread': 'error',
			radix: 'error',
			'spaced-comment': [
				'error',
				'always',
				{
					line: { markers: ['#region', '#endregion'] },
					block: { balanced: true },
				},
			],
		},
	},
	{
		files: ['src/**/__tests__/**/*.ts'],
		languageOptions: {
			globals: {
				...globals.jest,
			},
		},
	},
	globalIgnores([
		'node_modules',
		'dist',
		'esbuild.config.mjs',
		'eslint.config.mjs',
		'jest.config.js',
		'version-bump.mjs',
		'versions.json',
		'main.js',
		'src/**/*.svelte',
	]),
);
