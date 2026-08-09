'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { UserSettings, UserProgress, Word } from '@/types/vocabulary';
import { loadUserSettings, loadUserProgress } from '@/lib/storage';
import { parseVocabularyCSV, exportVocabularyToCSV } from '@/lib/csv';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Play,
  RefreshCw,
  Download,
  ShieldCheck,
  Search,
  Image as ImageIcon,
} from 'lucide-react';

const SAMPLE_CSV = `id,spanish,english,level,partOfSpeech,imageQuery
1,gato,cat,A1,noun,cat
2,perro,dog,A1,noun,dog
3,casa,house,A1,noun,house
4,correr,to run,A1,verb,person running
5,cocinar,to cook,A1,verb,person cooking
6,banco,bank,A1,noun,bank building
7,avión,airplane,A1,noun,airplane`;

export default function AdminPage() {
  const [progress] = useState<UserProgress>(loadUserProgress());
  const [settings, setSettings] = useState<UserSettings>(loadUserSettings());

  const [csvInput, setCsvInput] = useState<string>(SAMPLE_CSV);
  const [parsedWords, setParsedWords] = useState<Word[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(1);

  const handleParse = () => {
    const { words, errors: parseErrors } = parseVocabularyCSV(csvInput);
    setParsedWords(words);
    setErrors(parseErrors);
    if (words.length > 0) {
      setActiveStep(2);
    }
  };

  const handleBatchImagePipeline = async () => {
    if (parsedWords.length === 0) return;
    setIsProcessing(true);

    const updatedWords = [...parsedWords];

    for (let i = 0; i < updatedWords.length; i++) {
      const word = updatedWords[i];
      if (word.imageQuery) {
        try {
          const res = await fetch(`/api/images/search?query=${encodeURIComponent(word.imageQuery)}`);
          const data = await res.json();
          if (data.success && data.image) {
            updatedWords[i] = {
              ...word,
              image: data.image,
            };
          }
        } catch (e) {
          console.error(`Failed to fetch image for ${word.spanish}`, e);
        }
      }
    }

    setParsedWords(updatedWords);
    setIsProcessing(false);
    setActiveStep(3);
  };

  const handleCustomQuerySearch = async (wordId: number, query: string) => {
    try {
      const res = await fetch(`/api/images/search?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.success && data.image) {
        setParsedWords((prev) =>
          prev.map((w) => (w.id === wordId ? { ...w, imageQuery: query, image: data.image } : w))
        );
      }
    } catch (e) {
      console.error('Custom image query failed:', e);
    }
  };

  const handleDownloadJSON = () => {
    const jsonStr = JSON.stringify(parsedWords, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `words_batch_${parsedWords.length}.json`;
    a.click();
  };

  const handleDownloadCSV = () => {
    const csvStr = exportVocabularyToCSV(parsedWords);
    const blob = new Blob([csvStr], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vocabulary_export.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar progress={progress} settings={settings} onSettingsChange={setSettings} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-8 h-8 text-rose-500" />
              <span>Admin Vocabulary & Image Management</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Batch import CSV vocabulary, generate Pexels image queries, curate image grids, and approve JSON datasets.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {parsedWords.length > 0 && (
              <>
                <button
                  onClick={handleDownloadJSON}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4 text-emerald-500" />
                  <span>Export JSON</span>
                </button>

                <button
                  onClick={handleDownloadCSV}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <FileSpreadsheet className="w-4 h-4 text-rose-500" />
                  <span>Export CSV</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* 5-Step Workflow Pipeline Tracker */}
        <div className="grid grid-cols-5 gap-2 mb-8 text-center text-xs font-bold">
          {[
            { step: 1, name: 'Upload CSV' },
            { step: 2, name: 'Validate Words' },
            { step: 3, name: 'Search Pexels' },
            { step: 4, name: 'Curate Grid' },
            { step: 5, name: 'Approve & Save' },
          ].map((item) => (
            <div
              key={item.step}
              className={`p-3 rounded-xl border transition-all ${
                activeStep >= item.step
                  ? 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-300 border-rose-500/30 dark:border-rose-500/40 shadow-lg'
                  : 'bg-white/60 dark:bg-slate-900/60 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">
                Step {item.step}
              </div>
              <div className="truncate">{item.name}</div>
            </div>
          ))}
        </div>

        {/* Step 1 & 2: CSV Upload & Validation Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* CSV Input Panel */}
          <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-lg flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Upload className="w-5 h-5 text-rose-500" />
              <span>Import Vocabulary CSV</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Paste CSV text matching schema: <code className="text-amber-600 dark:text-amber-300 font-mono">id,spanish,english,level,partOfSpeech,imageQuery</code>
            </p>

            <textarea
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              rows={8}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-rose-500 transition-colors resize-none mb-4"
              placeholder="Paste CSV here..."
            />

            <div className="flex items-center justify-between mt-auto">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {csvInput.split('\n').filter((l) => l.trim().length > 0).length - 1} rows detected
              </span>

              <button
                onClick={handleParse}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-rose-600/20 hover:scale-105 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Parse & Validate</span>
              </button>
            </div>
          </div>

          {/* Validation & Pipeline Trigger */}
          <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-lg flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-amber-500 dark:text-amber-400" />
              <span>Batch Image Pipeline</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Automatically process words, evaluate Pexels search relevance, and build image cache.
            </p>

            {errors.length > 0 && (
              <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs">
                <div className="flex items-center gap-1 font-bold mb-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>Validation Errors</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5">
                  {errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex-1 flex flex-col justify-center items-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/40 text-center mb-4">
              {parsedWords.length > 0 ? (
                <div>
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2 border border-emerald-500/20">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    {parsedWords.length} Words Ready
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    All vocabulary items validated. Trigger image generator below.
                  </p>
                </div>
              ) : (
                <div className="text-slate-400 dark:text-slate-500">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Parse CSV above to prepare batch image search.</p>
                </div>
              )}
            </div>

            <button
              onClick={handleBatchImagePipeline}
              disabled={parsedWords.length === 0 || isProcessing}
              className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                parsedWords.length > 0 && !isProcessing
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-rose-600/20 hover:scale-[1.02]'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
              }`}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Searching Pexels API Batch...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Run Pexels Image Generator ({parsedWords.length} words)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Step 4: 200-Word Image Grid Curation Section */}
        {parsedWords.length > 0 && (
          <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-rose-500" />
                  <span>Vocabulary Image Curation Grid ({parsedWords.length})</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Inspect selected Pexels images, adjust queries, or re-search bad images.
                </p>
              </div>

              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {parsedWords.filter((w) => w.image && w.image.url).length} / {parsedWords.length} Images Populated
              </span>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {parsedWords.map((word) => (
                <div
                  key={word.id}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 flex flex-col justify-between group hover:border-rose-500/50 transition-all"
                >
                  <div className="relative w-full aspect-square rounded-lg bg-slate-200 dark:bg-slate-900 overflow-hidden mb-2 border border-slate-200 dark:border-slate-800">
                    {word.image && word.image.url ? (
                      <img
                        src={word.image.url}
                        alt={word.spanish}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 text-[10px] p-2 text-center">
                        <ImageIcon className="w-5 h-5 mb-1" />
                        <span>No image</span>
                      </div>
                    )}

                    <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-white/80 dark:bg-slate-950/80 text-rose-600 dark:text-rose-300 backdrop-blur-sm border border-slate-200 dark:border-slate-800">
                      {word.level}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs capitalize truncate">
                      {word.spanish}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate capitalize">{word.english}</p>
                    <p className="text-[10px] text-rose-600 dark:text-rose-400/80 truncate font-mono">
                      query: "{word.imageQuery}"
                    </p>

                    <button
                      onClick={() => {
                        const newQuery = prompt(`Enter new image query for "${word.spanish}":`, word.imageQuery);
                        if (newQuery && newQuery.trim() !== '') {
                          handleCustomQuerySearch(word.id, newQuery);
                        }
                      }}
                      className="w-full mt-2 py-1 rounded bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-semibold transition-colors flex items-center justify-center gap-1"
                    >
                      <Search className="w-3 h-3" />
                      <span>Replace</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
