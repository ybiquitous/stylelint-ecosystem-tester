import crypto from 'node:crypto';

// Create a slug with these attributes:
// - lowercase only (for file systems that are case-insensitive)
// - remove the scope character
// - make sure the slug is a safe file name
// - add a short suffix to avoid conflicts when two packages would produce the same slug
export default function createSlug(name) {
	const suffix = crypto.createHash('md5').update(name).digest('hex').slice(0, 3);

	return `${name}-${suffix}`
		.toLowerCase()
		.replace(/^@/g, '') // Remove the scope character.
		.replace(/[^a-z0-9-_]/g, '-');
}
