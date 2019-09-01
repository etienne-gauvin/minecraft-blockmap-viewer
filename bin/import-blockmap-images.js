const fs = require('fs');
const path = require('path');

const WORLDS_DIR = 'public/worlds';
const OUTPUT_FILE = 'src/blockmap-images.json';

console.log('Importing BlockMap images...');

if (fs.existsSync(OUTPUT_FILE)) {
    fs.unlinkSync(OUTPUT_FILE);
}

const worldsDirs = fs.readdirSync(WORLDS_DIR);
const worlds = [];

for (const worldDir of worldsDirs) {
    const chunks = [];

    try {
        const chunksFiles = fs.readdirSync(path.join(WORLDS_DIR, worldDir));

        for (const chunkFile of chunksFiles) {
            const match = chunkFile.match(/^r\.(-?\d+)\.(-?\d+)\.png$/);

            if (match) {
                chunks.push({
                    x: +match[1],
                    y: +match[2],
                    file: chunkFile,
                });
            }
        }
        
        if (chunks.length > 0) {
            console.log(`Found world ${worldDir} containing ${chunks.length} chunks.`);

            worlds.push({
                directory: worldDir,
                chunks,
            });
        }
    } catch (e) {
        console.error(e);
    }
}

if (worlds.length) {
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify({ worlds }));
    console.log(`Wrote ${worlds.length} worlds in JSON output file ${OUTPUT_FILE}.`);
}
