export default function createStatusBadge(workflowFile, stylelintVersion) {
	return `[![${stylelintVersion}](https://github.com/stylelint/stylelint-ecosystem-tester/actions/workflows/${workflowFile}/badge.svg)](https://github.com/stylelint/stylelint-ecosystem-tester/actions/workflows/${workflowFile})`;
}
