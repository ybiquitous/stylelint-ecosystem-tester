export default function createStatusBadge(workflowFile) {
	// TODO : rename `romainmenke` to `stylelint`
	return `[![Test status](https://github.com/romainmenke/stylelint-ecosystem-tester/actions/workflows/${workflowFile}/badge.svg)](https://github.com/romainmenke/stylelint-ecosystem-tester/actions/workflows/${workflowFile})`;
}
