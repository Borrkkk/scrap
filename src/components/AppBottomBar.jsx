export default function AppBottomBar({
  onOpenStickerPicker,
  onDeleteSelected,
  onUploadImage,
  onAddText,
  canDelete,
}) {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-6 pt-2"
      role="presentation"
    >
      <div
        className="pointer-events-auto inline-flex max-w-[min(100%,56rem)] flex-wrap items-center justify-center gap-2 rounded-2xl border border-amber-200/90 bg-white/95 px-3 py-2.5 shadow-xl shadow-amber-900/10 backdrop-blur-md sm:gap-3 sm:px-4 sm:py-3"
        role="toolbar"
        aria-label="Scrapbook tools"
      >
        <button
          type="button"
          className="rounded-full bg-amber-700 px-4 py-2 text-sm font-bold text-white shadow-md transition-colors hover:bg-amber-800"
          onClick={onOpenStickerPicker}
        >
          Add sticker
        </button>

        <label className="cursor-pointer rounded-full bg-amber-700 px-4 py-2 text-sm font-bold text-white shadow-md transition-colors hover:bg-amber-800">
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={onUploadImage}
          />
          Upload file
        </label>
        <button
          type="button"
          className="rounded-full bg-amber-700 px-4 py-2 text-sm font-bold text-white shadow-md transition-colors hover:bg-amber-800"
          onClick={onAddText}
        >
          Add text
        </button>
        <button
          type="button"
          disabled={!canDelete}
          className="rounded-full bg-red-800 px-4 py-2 text-sm font-bold text-white shadow-md transition-colors hover:bg-red-900 disabled:cursor-not-allowed disabled:bg-stone-300 disabled:text-stone-500"
          onClick={onDeleteSelected}
        >
          Delete selected
        </button>
      </div>
    </div>
  );
}
