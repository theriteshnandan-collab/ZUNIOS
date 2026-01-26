"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileJson, FileText, FileType, X, Check, Loader2 } from 'lucide-react';
import { exportAsJSON, exportAsCSV, exportAsMarkdown, getExportSummary } from '@/lib/data-export';
import type { Dream } from '@/types/dream';

interface DataExportModalProps {
    entries: Dream[];
    isOpen: boolean;
    onClose: () => void;
}

type ExportFormat = 'json' | 'csv' | 'markdown';

export function DataExportModal({ entries, isOpen, onClose }: DataExportModalProps) {
    const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('json');
    const [isExporting, setIsExporting] = useState(false);
    const [exported, setExported] = useState(false);

    const summary = getExportSummary(entries);

    const handleExport = async () => {
        setIsExporting(true);

        // Slight delay for UX
        await new Promise(r => setTimeout(r, 500));

        const filename = `kogito-journal-${new Date().toISOString().split('T')[0]}`;

        switch (selectedFormat) {
            case 'json':
                exportAsJSON(entries, filename);
                break;
            case 'csv':
                exportAsCSV(entries, filename);
                break;
            case 'markdown':
                exportAsMarkdown(entries, filename);
                break;
        }

        setIsExporting(false);
        setExported(true);

        setTimeout(() => {
            setExported(false);
            onClose();
        }, 1500);
    };

    const formats = [
        { id: 'json' as ExportFormat, name: 'JSON', icon: FileJson, description: 'Machine readable, includes all data' },
        { id: 'csv' as ExportFormat, name: 'CSV', icon: FileText, description: 'Spreadsheet compatible' },
        { id: 'markdown' as ExportFormat, name: 'Markdown', icon: FileType, description: 'Human readable, formatted' }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-gray-900 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500/20 rounded-xl">
                                    <Download className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                    <h2 className="font-semibold text-white">Export Your Data</h2>
                                    <p className="text-xs text-white/50">Download all your journal entries</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Summary */}
                            <div className="p-4 bg-white/5 rounded-xl">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-white/50">Total Entries</span>
                                        <p className="font-semibold text-white">{summary.totalEntries}</p>
                                    </div>
                                    <div>
                                        <span className="text-white/50">Date Range</span>
                                        <p className="font-semibold text-white text-xs">{summary.dateRange}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Format Selection */}
                            <div className="space-y-2">
                                <label className="text-sm text-white/70">Export Format</label>
                                <div className="space-y-2">
                                    {formats.map(format => (
                                        <button
                                            key={format.id}
                                            onClick={() => setSelectedFormat(format.id)}
                                            className={`
                                                w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all
                                                ${selectedFormat === format.id
                                                    ? 'bg-purple-500/20 border-purple-500/50'
                                                    : 'bg-white/5 border-white/10 hover:border-white/20'
                                                }
                                            `}
                                        >
                                            <format.icon className={`w-5 h-5 ${selectedFormat === format.id ? 'text-purple-400' : 'text-white/50'}`} />
                                            <div className="flex-1">
                                                <p className="font-medium text-white">{format.name}</p>
                                                <p className="text-xs text-white/50">{format.description}</p>
                                            </div>
                                            {selectedFormat === format.id && (
                                                <Check className="w-5 h-5 text-purple-400" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Export Button */}
                            <motion.button
                                onClick={handleExport}
                                disabled={isExporting || exported || entries.length === 0}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`
                                    w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2
                                    transition-all disabled:cursor-not-allowed
                                    ${exported
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white disabled:opacity-50'
                                    }
                                `}
                            >
                                {isExporting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Exporting...
                                    </>
                                ) : exported ? (
                                    <>
                                        <Check className="w-5 h-5" />
                                        Downloaded!
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-5 h-5" />
                                        Export {summary.totalEntries} Entries
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
