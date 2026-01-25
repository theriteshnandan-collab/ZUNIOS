
import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2';

// Disable local models logic entirely for browser usage
env.allowLocalModels = false;

class MyTranslationPipeline {
    static task = 'automatic-speech-recognition';
    static model = 'Xenova/whisper-tiny.en';
    static instance = null;

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            this.instance = await pipeline(this.task, this.model, { quantized: true, progress_callback });
        }
        return this.instance;
    }
}

self.addEventListener('message', async (event) => {
    const message = event.data;

    // Do we have audio data?
    if (message.audio) {
        let transcriber = await MyTranslationPipeline.getInstance((data) => {
            self.postMessage({
                status: 'loading',
                data: data
            });
        });

        let output = await transcriber(message.audio, {
            top_k: 0,
            do_sample: false,
            chunk_length_s: 30,
            stride_length_s: 5,
            return_timestamps: true,
            callback_function: x => {
                self.postMessage({
                    status: 'update',
                    output: x
                });
            },
            chunk_callback: x => {
                self.postMessage({
                    status: 'chunk',
                    output: x
                });
            },
        });

        self.postMessage({
            status: 'complete',
            output: output
        });
    }
});
