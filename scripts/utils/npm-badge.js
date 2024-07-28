export default function createNpmBadge(pkg) {
	return `[![${pkg}](https://img.shields.io/npm/v/${pkg}.svg)](https://www.npmjs.com/package/${pkg})`;
}
