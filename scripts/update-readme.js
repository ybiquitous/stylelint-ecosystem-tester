import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { parse, stringify } from 'yaml';

const workflowFile = new URL('../.github/workflows/test-ecosystem.yml', import.meta.url);
const workflowContent = readFileSync(workflowFile, 'utf8');
const packages = parse(workflowContent).jobs.test.strategy.matrix.package;

const failedPackages = new Set([
	'@shopify/stylelint-plugin',
	'@wordpress/stylelint-config',
	'stylelint-codeframe-formatter',
	'stylelint-codeframe-formatter',
	'stylelint-config-rational-order',
	'stylelint-config-recommended-less',
	'stylelint-config-standard-vue',
	'stylelint-config-tailwindcss',
	'stylelint-config-wikimedia',
	'stylelint-csstree-validator',
	'stylelint-declaration-strict-value',
	'stylelint-suitcss',
	'stylelint-use-nesting',
	'@stylistic/stylelint-config',
]);

const newPackageLines = [];
newPackageLines.push('| Package | Status |');
newPackageLines.push('| :------ | :----: |');

for (const pkg of packages) {
	const statusEmoji = failedPackages.has(pkg) ? '❌' : '✅';
	newPackageLines.push(`| [${pkg}](https://www.npmjs.com/package/${pkg}) | ${statusEmoji} |`);
}

newPackageLines.push('');
newPackageLines.push(`Total ${packages.length} packages`);

const readmeFile = new URL('../README.md', import.meta.url);
const readmeLines = readFileSync(readmeFile, 'utf8').split('\n');
const startLineIndex = readmeLines.indexOf('<!-- START:PACKAGES -->');
const endLineIndex = readmeLines.indexOf('<!-- END:PACKAGES -->');

readmeLines.splice(startLineIndex + 1, endLineIndex - startLineIndex - 1, ...newPackageLines);

writeFileSync(readmeFile, readmeLines.join('\n'), 'utf8');

execSync(`npx prettier --write "${fileURLToPath(readmeFile)}"`);
