// import { pipeline } from '@xenova/transformers'; // Removed static import

/**
 * ZUNIOS VECTOR INTELLIGENCE
 * 
 * This utility handles the conversion of human thoughts (text) into 
 * mathematical vectors (embeddings) for true semantic search.
 */

let pipelineInstance: any = null;

/**
 * Returns a singleton instance of the feature extraction pipeline.
 * We use the 'all-MiniLM-L6-v2' model which is optimized for speed and semantic accuracy.
 */
async function getPipeline() {
    if (!pipelineInstance) {
        try {
            // Dynamic import to prevent build/runtime crashes if module is missing (e.g. sharp issue)
            const { pipeline } = await import('@xenova/transformers');
            pipelineInstance = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
        } catch (error) {
            console.error("Failed to load Transformer Pipeline:", error);
            throw new Error("AI Model Load Failed");
        }
    }
    return pipelineInstance;
}

/**
 * Generates an embedding for the given text.
 * @param text The text to vectorize.
 * @returns An array of 384 numbers representing the semantic meaning.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
    try {
        const extractor = await getPipeline();

        // Generate the output vector
        const output = await extractor(text, {
            pooling: 'mean',
            normalize: true,
        });

        // Convert the Tensor to a standard JS array
        return Array.from(output.data);
    } catch (error) {
        console.error("Embedding generation failed:", error);
        throw new Error("Failed to generate semantic vector for the provided text.");
    }
}
