export default function createStatusBadge(workflowFile, stylelintVersion) {
	// TODO : rename `romainmenke` to `stylelint`
	return `[![${stylelintVersion}](https://github.com/romainmenke/stylelint-ecosystem-tester/actions/workflows/${workflowFile}/badge.svg)](https://github.com/romainmenke/stylelint-ecosystem-tester/actions/workflows/${workflowFile})`;
}
