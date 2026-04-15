export default function AppHeader({ onLoadFromFile, onSaveToFile }) {
  return (
    <header className="flex shrink-0 items-center justify-between gap-4 border-b border-amber-800/80 bg-amber-900 px-4 py-3 text-amber-50 shadow-md sm:px-6">
      <h1 className="text-lg font-bold tracking-tight sm:text-xl">Scrapbook</h1>
      <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          className="rounded-full bg-amber-700 px-4 py-2 text-sm font-bold text-white shadow-md transition-colors hover:bg-amber-600"
          onClick={onLoadFromFile}
        >
          Load from file
        </button>
        <button
          type="button"
          className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-md transition-colors hover:bg-emerald-500"
          onClick={onSaveToFile}
        >
          Save to file
        </button>
      </div>
    </header>
  );
}
