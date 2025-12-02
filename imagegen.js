import { Txt2ImgWorkerClient } from 'https://cdn.jsdelivr.net/npm/web-txt2img@0.3.1/dist/index.js';

const client = Txt2ImgWorkerClient.createDefault();

let modelLoaded = '';

export async function init(model, progressCallback) {
    const caps = await client.detect();
    if (!caps.webgpu) {
        throw new Error('WebGPU not supported');
    }

    const loadRes = await client.load(model, {
        backendPreference: ['webgpu'],
    }, progressCallback);

    if (!loadRes?.ok) {
        throw new Error(loadRes?.message ?? 'load failed');
    }
    modelLoaded = model;
}

export async function generate(model, prompt, seed, steps, progressCallback) {
    if (modelLoaded !== model) {
        await init(model, progressCallback);
    }

    const { promise } = client.generate(
        { prompt, seed, num_inference_steps: steps },
        progressCallback,
        { busyPolicy: 'queue', debounceMs: 200 }
    );

    const gen = await promise;
    if (gen.ok) {
        return URL.createObjectURL(gen.blob);
    } else {
        throw new Error(gen.message);
    }
}
