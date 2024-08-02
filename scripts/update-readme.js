import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { parse } from 'yaml';

import createNpmBadge from './utils/npm-badge.js';
import createStatusBadge from './utils/status-badge.js';
import generateSlug from './utils/slug.js';
import workflowFilename from './utils/workflow-filename.js';

// List all packages
const ecosystemDataFile = new URL('../data/ecosystem.yml', import.meta.url);
const ecosystemDataContent = readFileSync(ecosystemDataFile, 'utf8');
const ecosystemData = parse(ecosystemDataContent);

const newPackageLines = [];

newPackageLines.push('| Package | Latest Stylelint | Next Stylelint |');
newPackageLines.push('| :------ | ----: |  ----: |');

ecosystemData.packages.forEach((packageConfig) => {
	const [pkg] = [packageConfig].flat();

	const slug = generateSlug(pkg);
	const latestBadge = createStatusBadge(workflowFilename(slug, 'latest'), 'latest');
	const nextBadge = createStatusBadge(workflowFilename(slug, 'next'), 'next');

	newPackageLines.push(`| ${createNpmBadge(pkg)} | ${latestBadge} | ${nextBadge} |`);
});

newPackageLines.push('');
newPackageLines.push(`Total ${ecosystemData.packages.length} packages`);

const readmeFile = new URL('../README.md', import.meta.url);
const readmeLines = readFileSync(readmeFile, 'utf8').split('\n');
const startLineIndex = readmeLines.indexOf('<!-- START:PACKAGES -->');
const endLineIndex = readmeLines.indexOf('<!-- END:PACKAGES -->');

readmeLines.splice(startLineIndex + 1, endLineIndex - startLineIndex - 1, ...newPackageLines);

writeFileSync(readmeFile, readmeLines.join('\n'), 'utf8');

execSync(`npx prettier --write "${fileURLToPath(readmeFile)}"`);
