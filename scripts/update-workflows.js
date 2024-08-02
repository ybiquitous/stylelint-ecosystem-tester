import { readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { parse, stringify } from 'yaml';

import generateSlug from './utils/slug.js';
import workflowFilename from './utils/workflow-filename.js';

function generateWorkflow({
	concurrencyGroup,
	pkg,
	stylelintVersion,
	template,
	workflowFilePath,
	workflowName,
	testName,
}) {
	const workflow = parse(template);

	// Set the workflow name
	workflow.name = workflowName;
	workflow.jobs.test.name = testName;

	// Run the workflow on changes to the workflow file itself.
	workflow.on.push.paths.push(workflowFilePath);
	workflow.on.pull_request.paths.push(workflowFilePath);

	// Set concurrency
	workflow.concurrency.group = concurrencyGroup;

	// Set the package to test and the Stylelint version to use.
	workflow.jobs.test.with ??= {};
	workflow.jobs.test.with.package = pkg;
	workflow.jobs.test.with['stylelint-version'] = stylelintVersion;

	return workflow;
}

// Clean existing workflows for packages that no longer exist.
const workflowsDir = new URL('../.github/workflows', import.meta.url);

readdirSync(workflowsDir).forEach((file) => {
	if (!file.startsWith('test-package-')) return;

	const workflowFile = new URL(`../.github/workflows/${file}`, import.meta.url);

	rmSync(fileURLToPath(workflowFile), { force: true });
});

// List all packages
const ecosystemDataFile = new URL('../data/ecosystem.yml', import.meta.url);
const ecosystemDataContent = readFileSync(ecosystemDataFile, 'utf8');
const ecosystemData = parse(ecosystemDataContent);

// Read the workflow template
const workflowTemplateFile = new URL('../templates/test-package.yml', import.meta.url);
const workflowTemplateContent = readFileSync(workflowTemplateFile, 'utf8');

// Generate workflows for each package
ecosystemData.packages.forEach((pkg) => {
	const slug = generateSlug(pkg);

	const latestStylelintWorkflowFilePath = `.github/workflows/${workflowFilename(slug, 'latest')}`;
	const latestStylelintWorkflow = generateWorkflow({
		concurrencyGroup: `\${{ github.workflow }}-\${{ github.ref }}-${slug}-latest`,
		pkg,
		stylelintVersion: 'stylelint@latest',
		template: workflowTemplateContent,
		workflowFilePath: latestStylelintWorkflowFilePath,
		workflowName: pkg,
		testName: 'latest',
	});

	const latestWorkflowFile = new URL(`../${latestStylelintWorkflowFilePath}`, import.meta.url);
	const latestWorkflowContent = stringify(latestStylelintWorkflow);

	writeFileSync(fileURLToPath(latestWorkflowFile), latestWorkflowContent, 'utf8');

	const nextStylelintWorkflowFilePath = `.github/workflows/${workflowFilename(slug, 'next')}`;
	const nextStylelintWorkflow = generateWorkflow({
		concurrencyGroup: `\${{ github.workflow }}-\${{ github.ref }}-${slug}-next`,
		pkg,
		stylelintVersion: 'stylelint/stylelint',
		template: workflowTemplateContent,
		workflowFilePath: nextStylelintWorkflowFilePath,
		workflowName: pkg,
		testName: 'next',
	});

	const nextWorkflowFile = new URL(`../${nextStylelintWorkflowFilePath}`, import.meta.url);
	const nextWorkflowContent = stringify(nextStylelintWorkflow);

	writeFileSync(fileURLToPath(nextWorkflowFile), nextWorkflowContent, 'utf8');
});

execSync(`npx prettier --write ".github/workflows/test-package-*"`, { stdio: 'inherit' });
