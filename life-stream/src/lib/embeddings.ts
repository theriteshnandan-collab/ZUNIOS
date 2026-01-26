// Singleton Pattern for Pipeline to avoid reloading model on every request
class PipelineSingleton {
    static task = 'feature-extraction';
    static model = 'Xenova/all-MiniLM-L6-v2';
    static instance: any = null;

    static async getInstance(progress_callback: any = null) {
        if (this.instance === null) {
            const { pipeline } = await import('@xenova/transformers');
            this.instance = await pipeline(this.task as any, this.model, { progress_callback });
        }
        return this.instance;
    }
}

export async function generateEmbedding(text: string) {
    try {
        const extractor = await PipelineSingleton.getInstance();
        const output = await extractor(text, { pooling: 'mean', normalize: true });
        return Array.from(output.data);
    } catch (error) {
        console.error("Embedding generation failed:", error);
        return null;
    }
}
