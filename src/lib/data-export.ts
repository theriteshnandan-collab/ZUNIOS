// Data Export Utilities
// Export journal entries in various formats

import type { Dream } from '@/types/dream';

export interface ExportOptions {
    format: 'json' | 'csv' | 'markdown';
    includeAIAnalysis: boolean;
    dateRange?: {
        start: Date;
        end: Date;
    };
}

/**
 * Export entries as JSON file
 */
export function exportAsJSON(entries: Dream[], filename: string = 'kogito-export') {
    const exportData = {
        exportDate: new Date().toISOString(),
        source: 'KOGITO - The OS for Your Mind',
        version: '1.0',
        entryCount: entries.length,
        entries: entries.map(e => ({
            id: e.id,
            content: e.content,
            category: e.category,
            mood: e.mood,
            theme: e.theme,
            aiAnalysis: e.ai_analysis,
            imageUrl: e.image_url,
            createdAt: e.created_at
        }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    downloadBlob(blob, `${filename}.json`);
}

/**
 * Export entries as CSV file
 */
export function exportAsCSV(entries: Dream[], filename: string = 'kogito-export') {
    const headers = ['Date', 'Category', 'Mood', 'Theme', 'Content', 'AI Analysis'];
    const rows = entries.map(e => [
        new Date(e.created_at).toLocaleDateString(),
        e.category || '',
        e.mood || '',
        e.theme || '',
        `"${(e.content || '').replace(/"/g, '""')}"`,
        `"${(e.ai_analysis || '').replace(/"/g, '""')}"`
    ]);

    const csv = [
        headers.join(','),
        ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    downloadBlob(blob, `${filename}.csv`);
}

/**
 * Export entries as Markdown file
 */
export function exportAsMarkdown(entries: Dream[], filename: string = 'kogito-export') {
    const sortedEntries = [...entries].sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const markdown = `# KOGITO Journal Export
> Exported on ${new Date().toLocaleDateString()}
> Total entries: ${entries.length}

---

${sortedEntries.map(e => `
## ${new Date(e.created_at).toLocaleDateString()} - ${e.category || 'Entry'}

**Mood:** ${e.mood || 'Not specified'}  
**Theme:** ${e.theme || 'Not specified'}

${e.content}

${e.ai_analysis ? `### AI Insights\n${e.ai_analysis}` : ''}

---
`).join('\n')}

*Exported from KOGITO - The OS for Your Mind*
`;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    downloadBlob(blob, `${filename}.md`);
}

/**
 * Helper to trigger file download
 */
function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Get export summary
 */
export function getExportSummary(entries: Dream[]): {
    totalEntries: number;
    dateRange: string;
    categories: Record<string, number>;
} {
    if (entries.length === 0) {
        return {
            totalEntries: 0,
            dateRange: 'No entries',
            categories: {}
        };
    }

    const sorted = [...entries].sort((a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    const firstDate = new Date(sorted[0].created_at).toLocaleDateString();
    const lastDate = new Date(sorted[sorted.length - 1].created_at).toLocaleDateString();

    const categories: Record<string, number> = {};
    entries.forEach(e => {
        const cat = e.category || 'Uncategorized';
        categories[cat] = (categories[cat] || 0) + 1;
    });

    return {
        totalEntries: entries.length,
        dateRange: `${firstDate} - ${lastDate}`,
        categories
    };
}
