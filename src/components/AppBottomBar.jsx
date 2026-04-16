import { useState } from "react";

export default function AppBottomBar({
  onOpenStickerPicker,
  onDeleteSelected,
  onUploadImage,
  onAddText,
  canDelete,
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div
      className="pointer-events-none fixed inset-y-0 left-0 z-40 flex items-center px-3 py-4 sm:px-4"
      role="presentation"
    >
      <div className="pointer-events-auto sm:hidden">
        <button
          type="button"
          className="rounded-full bg-amber-700 px-4 py-2 text-sm font-bold text-white shadow-md transition-colors hover:bg-amber-800"
          onClick={() => setIsMobileOpen((open) => !open)}
          aria-expanded={isMobileOpen}
          aria-controls="scrapbook-mobile-tools"
        >
          {isMobileOpen ? "Close tools" : "Tools"}
        </button>
      </div>
      <div
        id="scrapbook-mobile-tools"
        className={`${isMobileOpen ? "flex" : "hidden"} pointer-events-auto absolute bottom-16 left-3 w-40 flex-col items-stretch gap-2 rounded-2xl border border-amber-200/90 bg-white/95 p-3 shadow-xl shadow-amber-900/10 backdrop-blur-md sm:static sm:flex sm:w-44 sm:gap-2.5 sm:p-3.5`}
        role="toolbar"
        aria-label="Scrapbook tools"
      >
        <button
          type="button"
          className="rounded-xl bg-amber-700 px-3 py-2 text-sm font-bold text-white shadow-md transition-colors hover:bg-amber-800"
          onClick={onOpenStickerPicker}
        >
          Add sticker
        </button>

        <label className="cursor-pointer rounded-xl bg-amber-700 px-3 py-2 text-center text-sm font-bold text-white shadow-md transition-colors hover:bg-amber-800">
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
          className="rounded-xl bg-amber-700 px-3 py-2 text-sm font-bold text-white shadow-md transition-colors hover:bg-amber-800"
          onClick={onAddText}
        >
          Add text
        </button>
        <button
          type="button"
          disabled={!canDelete}
          className="rounded-xl bg-red-800 px-3 py-2 text-sm font-bold text-white shadow-md transition-colors hover:bg-red-900 disabled:cursor-not-allowed disabled:bg-stone-300 disabled:text-stone-500"
          onClick={onDeleteSelected}
        >
          Delete selected
        </button>
      </div>
    </div>
  );
}
