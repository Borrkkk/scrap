import { useMemo } from "react";

const stickerGlob = import.meta.glob(
  "../stickers/*.{svg,SVG,png,PNG,jpg,JPG,jpeg,JPEG,webp,WEBP,gif,GIF}",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
);
function stickerEntries() {
  return Object.entries(stickerGlob).map(([path, url]) => ({
    url,
    name: path.replace(/^.*\//, ""),
  }));
}

const StickerPickerModal = ({ isOpen, onClose, onSelectSticker }) => {
  const stickers = useMemo(() => stickerEntries(), []);

  if (!isOpen) return null;

  const handleBackdropMouseDown = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handlePick = (url) => {
    onSelectSticker(url);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onMouseDown={handleBackdropMouseDown}
      role="presentation"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[min(80vh,520px)] flex flex-col overflow-hidden border border-amber-200/80"
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sticker-picker-title"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50">
          <h2 id="sticker-picker-title" className="text-lg font-bold text-amber-900">
            Choose a sticker
          </h2>
          <button
            type="button"
            className="rounded-full p-2 text-amber-800 hover:bg-amber-200/60 transition-colors text-xl leading-none"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1 min-h-[120px]">
          {stickers.length === 0 && (
            <p className="text-amber-900/70 text-sm text-center py-6">
              No stickers yet. Add image files to{" "}
              <code className="text-xs bg-amber-100 px-1 rounded">src/stickers/</code> (supported:
              svg, png, jpg, webp, gif). They are picked up automatically when you rebuild or refresh
              dev.
            </p>
          )}
          {stickers.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {stickers.map(({ url, name }) => (
                <button
                  key={url}
                  type="button"
                  className="aspect-square rounded-xl border-2 border-amber-200 bg-amber-50/50 hover:border-amber-500 hover:bg-amber-100/80 transition-colors p-2 flex items-center justify-center overflow-hidden focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                  onClick={() => handlePick(url)}
                  title={name}
                >
                  <img
                    src={url}
                    alt=""
                    className="max-w-full max-h-full object-contain pointer-events-none"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StickerPickerModal;
