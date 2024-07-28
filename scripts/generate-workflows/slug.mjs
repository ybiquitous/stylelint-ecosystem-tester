import path from 'node:path';

// In case multiple packages would share the same slug.
const slugs = new Set();

export default function generateSlug(name) {
	const slug = name
		.toLowerCase()
		.replace(/^@/g, '')
		.replace(/[^a-z0-9-_]/g, '-');

	let counter = 0;
	let slugWithCounter = slug;

	while (slugs.has(slug)) {
		counter++;
		slugWithCounter = `${slug}-${counter}`;
	}

	slugs.add(slugWithCounter);

	return slugWithCounter;
}
