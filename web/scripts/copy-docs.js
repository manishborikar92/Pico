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

const sourceDir = path.join(__dirname, '..', '..', 'docs');
const targetDir = path.join(__dirname, '..', 'content', 'docs');

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
    const sourceFiles = fs.existsSync(sourceDir) ? fs.readdirSync(sourceDir) : [];
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
