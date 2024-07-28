import { readdirSync, rmSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parse, stringify } from 'yaml';
import generateSlug from './slug.mjs';

// Clean existing workflows for packages that no longer exist.
const workflowsDir = new URL('../../.github/workflows', import.meta.url);

readdirSync(workflowsDir).forEach((file) => {
	if (!file.startsWith('test-package-')) return;

	const workflowFile = new URL(`../../.github/workflows/${file}`, import.meta.url);
	rmSync(fileURLToPath(workflowFile), { force: true });
});

// List all packages
const ecosystemDataFile = new URL('../../data/ecosystem.yml', import.meta.url);
const ecosystemDataContent = readFileSync(ecosystemDataFile, 'utf8');
const ecosystemData = parse(ecosystemDataContent);

// Read the workflow template
const workflowTemplateFile = new URL('../../templates/test-package.yml', import.meta.url);
const workflowTemplateContent = readFileSync(workflowTemplateFile, 'utf8');

// Generate workflows for each package
ecosystemData.packages.forEach((name) => {
	const workflow = parse(workflowTemplateContent);

	const slug = generateSlug(name);
	const workflowFilePath = `.github/workflows/test-package-${slug}.yml`;

	// Set the name of the workflow.
	workflow.name = `Test ${name}`;

	// Run the workflow on changes to the workflow file itself.
	workflow.on.push.paths.push(workflowFilePath);
	workflow.on.pull_request.paths.push(workflowFilePath);

	// Set concurrency
	workflow.concurrency.group = '${{ github.workflow }}-${{ github.ref }}-' + slug;

	// Set the inputs
	workflow.jobs.test.with ??= {};
	workflow.jobs.test.with.package = name;

	const workflowFile = new URL(`../../${workflowFilePath}`, import.meta.url);
	const workflowContent = stringify(workflow);

	writeFileSync(fileURLToPath(workflowFile), workflowContent, 'utf8');
});
