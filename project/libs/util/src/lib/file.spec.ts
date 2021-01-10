import { existsSync, mkdirSync, copyFileSync } from 'fs';
import { basename, join } from 'path';
import * as fsMock from 'mock-fs';

import { copyFolderSync, findFiles, findFilesContent } from './file';

// Mock a filesystem
fsMock({
	src: {
		'srcfile1.txt': '',
		'srcfile2.txt': '',
		subfolder: {
			'subfile.txt': ''
		}
	},
	dest: {
		'destfile.txt': ''
	}
});

describe('file', () => {
	describe('copyFolderSync', () => {
		afterAll(() => fsMock.restore());

		it('should copy files with subfolder to existing destination', () => {
			copyFolderSync('src', 'dest');
			expect(existsSync('dest/destfile.txt')).toBeTruthy();
			expect(existsSync('dest/srcfile1.txt')).toBeTruthy();
			expect(existsSync('dest/srcfile2.txt')).toBeTruthy();
			expect(existsSync('dest/subfolder')).toBeTruthy();
			expect(existsSync('dest/subfolder/subfile.txt')).toBeTruthy();
		});

		it('should copy files with subfolder to new destination', () => {
			copyFolderSync('src', 'new1');
			expect(existsSync('new1/destfile.txt')).toBeFalsy();
			expect(existsSync('new1/srcfile1.txt')).toBeTruthy();
			expect(existsSync('new1/srcfile2.txt')).toBeTruthy();
			expect(existsSync('new1/subfolder')).toBeTruthy();
			expect(existsSync('new1/subfolder/subfile.txt')).toBeTruthy();
		});

		it('should copy files and overwrite existing files and folders', () => {
			mkdirSync('new2');
			copyFileSync(join('src', 'srcfile1.txt'), join('new2', 'srcfile1.txt'));
			expect(existsSync('new2/srcfile1.txt')).toBeTruthy();

			copyFolderSync('new2', 'src');
			expect(existsSync('src/srcfile1.txt')).toBeTruthy();
			expect(existsSync('src/srcfile2.txt')).toBeTruthy();
			expect(existsSync('src/subfolder')).toBeTruthy();
			expect(existsSync('src/subfolder/subfile.txt')).toBeTruthy();
		});

		it('should handle non-existing source folder', () => {
			let error;
			try {
				copyFolderSync('does-not-exist', 'src');
			} catch (err) {
				error = err;
			}
			expect(error?.code).not.toEqual('ENOENT');
		});
	});

	// TODO: Tests should use mock-fs
	describe('findFiles', () => {
		it('should return file with abolute and relative path', () => {
			const file = basename(__filename);
			expect(findFiles(__dirname, file).pop()).toBe(
				`${__dirname}/${findFiles(__dirname, file, true).pop()}`
			);
		});

		it('should find files in current folder only', () => {
			const match = findFiles(__dirname).every((file) =>
				file.startsWith(__dirname)
			);
			expect(match).toBeTruthy();
		});

		it('should find `file` files', () => {
			const files = findFiles(__dirname, 'file*.ts', true).filter(
				(file) => file === 'file.ts' || file === 'file.spec.ts'
			);
			expect(files.length).toBe(2);
		});
	});

	it('should provide empty path and default to root', () => {
		expect(findFiles('').length).toBe(findFiles('./').length);
	});

	it('should find spec file only', () => {
		expect(findFiles(__dirname, 'file.spec.ts', true)).toEqual([
			'file.spec.ts'
		]);
	});

	describe('findFilesContent', () => {
		it('should return current spec file using test name', () => {
			const file = basename(__filename);
			expect(
				findFilesContent(
					__dirname,
					'should return current spec file using describe name',
					undefined,
					true
				).pop()
			).toBe(file);
		});

		it('should return file with abolute and relative path', () => {
			expect(findFilesContent(__dirname, 'findFilesContent').pop()).toBe(
				`${__dirname}/${findFilesContent(
					__dirname,
					'findFilesContent',
					undefined,
					true
				).pop()}`
			);
		});
	});
});
