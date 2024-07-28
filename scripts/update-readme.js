import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { parse } from 'yaml';
import createStatusBadge from './utils/status-badge.js';

const workflowsDir = new URL('../.github/workflows', import.meta.url);
let numberOfPackages = 0;

const newPackageLines = [];
newPackageLines.push('| Package | Status |');
newPackageLines.push('| :------ | ----: |');

readdirSync(workflowsDir).forEach((file) => {
	if (!file.startsWith('test-package-')) return;

	const workflowFile = new URL(`../.github/workflows/${file}`, import.meta.url);
	const workflowContent = readFileSync(workflowFile, 'utf8');
	const pkg = parse(workflowContent).jobs.test.with.package;

	newPackageLines.push(
		`| [${pkg}](https://www.npmjs.com/package/${pkg}) | ${createStatusBadge(file)} |`,
	);
	numberOfPackages++;
});

newPackageLines.push('');
newPackageLines.push(`Total ${numberOfPackages} packages`);

const readmeFile = new URL('../README.md', import.meta.url);
const readmeLines = readFileSync(readmeFile, 'utf8').split('\n');
const startLineIndex = readmeLines.indexOf('<!-- START:PACKAGES -->');
const endLineIndex = readmeLines.indexOf('<!-- END:PACKAGES -->');

readmeLines.splice(startLineIndex + 1, endLineIndex - startLineIndex - 1, ...newPackageLines);

writeFileSync(readmeFile, readmeLines.join('\n'), 'utf8');

execSync(`npx prettier --write "${fileURLToPath(readmeFile)}"`);
