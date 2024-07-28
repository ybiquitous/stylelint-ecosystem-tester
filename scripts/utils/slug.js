// Create a slug with these attributes:
// - lowercase only (for file systems that are case-insensitive)
// - remove the scope character
// - make sure the slug is a safe file name
// - add a string sortable prefix to preserve the original order
export default function generateSlug(name, index) {
	const prefix = (`000` + index.toString()).slice(-3);

	return (
		prefix +
		'-' +
		name
			.toLowerCase()
			.replace(/^@/g, '') // Remove the scope character.
			.replace(/[^a-z0-9-_]/g, '-')
	);
}
