import { exec } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

const CONTENT_DIR = path.join(process.cwd(), 'content');
const BLOG_DIR = path.join(CONTENT_DIR, 'blog');
const POLICIES_DIR = path.join(CONTENT_DIR, 'policies');
const CONTENT_SOURCE_FILE_REGEX = /\.(gif|jpe?g|json|md|png|svg)$/i;
const GENERATED_MERMAID_DIAGRAM_REGEX = /(?:^|[/\\])mermaid-diagram-\d+-(?:dark|light)\.svg$/i;

let isGenerating = false;

async function regenerateContent() {
	if (isGenerating) {
		return;
	}

	isGenerating = true;
	console.log('Content changed, regenerating...');

	try {
		await execAsync('bun run generate:content');
		console.log('Content regenerated successfully');
	} catch (error) {
		console.error('Failed to regenerate content:', error);
	} finally {
		isGenerating = false;
	}
}

function watchDirectory(dir: string) {
	if (!fs.existsSync(dir)) {
		return;
	}

	fs.watch(dir, { recursive: true }, (_eventType, filename) => {
		if (
			filename &&
			CONTENT_SOURCE_FILE_REGEX.test(filename) &&
			!GENERATED_MERMAID_DIAGRAM_REGEX.test(filename)
		) {
			regenerateContent();
		}
	});
}

console.log('Watching content directories for changes...');
watchDirectory(BLOG_DIR);
watchDirectory(POLICIES_DIR);
