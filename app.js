import { init, generate } from './imagegen.js';

const promptEl = document.getElementById('prompt');
const stepsEl = document.getElementById('steps');
const seedEl = document.getElementById('seed');
const resolutionEl = document.getElementById('resolution');
const generateBtn = document.getElementById('generate');
const resultEl = document.getElementById('result');
const saveBtn = document.getElementById('save');
const loadingOverlay = document.getElementById('loading-overlay');
const downloadProgress = document.getElementById('download-progress');
const downloadLabel = document.getElementById('download-label');
const spinner = document.getElementById('spinner');

let generating = false;

async function main() {
    try {
        await init((p) => {
            console.log('load:', p);
            updateDownloadProgress(p);
        });
        loadingOverlay.style.display = 'none';
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate';
    } catch (err) {
        console.error(err);
        generateBtn.textContent = 'Error loading model';
        alert('Error loading model: ' + err.message);
    }
}

generateBtn.addEventListener('click', async () => {
    if (generating) return;

    generating = true;
    spinner.style.display = 'block';
    resultEl.style.display = 'none';
    generateBtn.disabled = true;

    try {
        const imageUrl = await generate(
            promptEl.value,
            parseInt(seedEl.value),
            parseInt(stepsEl.value),
            (p) => {
                console.log('gen:', p);
            }
        );
        resultEl.src = imageUrl;
        resultEl.style.display = 'block';
        saveBtn.href = imageUrl;
        saveBtn.style.display = 'block';
    } catch (err) {
        console.error(err);
        alert('Error generating image');
    } finally {
        generating = false;
        spinner.style.display = 'none';
        generateBtn.disabled = false;
    }
});

function updateDownloadProgress(p) {
    if (p.phase === 'loading') {
        const pct = p.pct ?? 0;
        downloadProgress.value = pct;
        downloadLabel.textContent = `${pct}%`;
    }
}

main();
