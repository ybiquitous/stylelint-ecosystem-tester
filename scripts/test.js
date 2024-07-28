import { execSync } from 'node:child_process';
import process from 'node:process';

if (process.env.CI) {
	execSync('npm run update-readme', { stdio: 'inherit' });
	execSync('npm run update-workflows', { stdio: 'inherit' });
	execSync('git diff --exit-code README.md .github/workflows', { stdio: 'inherit' });
}
