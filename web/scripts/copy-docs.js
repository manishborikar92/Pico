const fs = require('fs');
const path = require('path');

/**
 * Prebuild script: Copy documentation files from monorepo root to the web directory.
 * 
 * Vercel's Serverless Functions (which Next.js uses) cannot trace or access files
 * outside of the project's Root Directory (the `web/` folder). 
 * 
 * This script runs before `next build` and copies all markdown files from `../docs`
 * directly into `web/content/docs`. We then read from this internal folder at build time.
 */

// Vercel's monorepo mounting varies based on cached configurations.
// We search multiple possible ascending paths for the 'docs' directory.
const possibleSourceDirs = [
    path.join(process.cwd(), '..', 'docs'),       // Typical Vercel cwd mapping (/vercel/path/0/web -> /vercel/path/0/docs)
    path.join(__dirname, '..', '..', 'docs'),     // Strict local tree structure
    path.join(process.cwd(), 'docs'),             // Flattened structure fallback
];

let sourceDir = null;
for (const dir of possibleSourceDirs) {
    if (fs.existsSync(dir)) {
        sourceDir = dir;
        break;
    }
}

const targetDir = path.join(process.cwd(), 'content', 'docs');

function copyDocs() {
    console.log('📄 Copying documentation files from root for Vercel compatibility...');

    // 1. Ensure target directory exists
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    // 2. Clear out any existing docs sequentially (in case files were removed)
    const existingFiles = fs.existsSync(targetDir) ? fs.readdirSync(targetDir) : [];
    for (const file of existingFiles) {
        fs.unlinkSync(path.join(targetDir, file));
    }

    // 3. Copy files
    if (!sourceDir) {
        console.error(`\n❌ FATAL ERROR: Documentation source directory not found!`);
        console.error(`Attempted paths:\n  - ${possibleSourceDirs.join('\n  - ')}`);
        console.error(`If on Vercel, ensure the project "Root Directory" isn't isolating the build from the monorepo root.\n`);
        process.exit(1);
    }

    const sourceFiles = fs.readdirSync(sourceDir);
    let copyCount = 0;

    for (const file of sourceFiles) {
        if (file.endsWith('.md')) {
            const srcFile = path.join(sourceDir, file);
            const destFile = path.join(targetDir, file);
            fs.copyFileSync(srcFile, destFile);
            copyCount++;
        }
    }

    console.log(`✅ Successfully copied ${copyCount} markdown files into web/content/docs/`);
}

copyDocs();
