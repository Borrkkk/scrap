import { useState, useEffect, useCallback, useRef } from "react";
import { Stage, Layer } from "react-konva";
import ImageItem from "./components/ImageItem";
import StickerItem from "./components/StickerItem";
import TextItem from "./components/TextItem";
import AppHeader from "./components/AppHeader";
import AppBottomBar from "./components/AppBottomBar";
import TextFormatToolbar from "./components/TextFormatToolbar";
import StickerPickerModal from "./components/StickerPickerModal";
import {
  getDefaultAppState,
  parseScrapbookPayload,
  downloadScrapbookFile,
} from "./scrapbookStorage";
import "./App.css";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 1000;

export default function App() {
  const [doc, setDoc] = useState(() => getDefaultAppState());
  const [selectedId, setSelectedId] = useState(null);
  const [stickerPickerOpen, setStickerPickerOpen] = useState(false);
  const loadFileInputRef = useRef(null);

  const { pages, pageIndex } = doc;
  const items = pages[pageIndex] ?? [];

  const patchCurrentItems = useCallback((updaterOrValue) => {
    setDoc((d) => {
      const idx = d.pageIndex;
      const current = d.pages[idx] ?? [];
      const nextItems =
        typeof updaterOrValue === "function"
          ? updaterOrValue(current)
          : updaterOrValue;
      const nextPages = [...d.pages];
      nextPages[idx] = nextItems;
      return { ...d, pages: nextPages };
    });
  }, []);

  useEffect(() => {
    setSelectedId(null);
  }, [pageIndex]);

  const handleStickerSelected = (src) => {
    patchCurrentItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "sticker",
        src,
        x: 220,
        y: 180,
        scaleX: 0.5,
        scaleY: 0.5,
        rotation: 0,
      },
    ]);
  };

  const handleAddText = () => {
    patchCurrentItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "text",
        text: "Hello World",
        x: 150,
        y: 150,
        width: 220,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        fontSize: 24,
        fill: "#000000",
        fontFamily: "Patrick Hand, cursive",
        fontStyle: "normal",
        align: "left",
        textDecoration: "",
        lineHeight: 1.2,
      },
    ]);
  };

  const selectedItem = items.find((it) => it.id === selectedId) ?? null;
  const selectedTextItem =
    selectedItem?.type === "text" ? selectedItem : null;

  const patchSelectedText = useCallback(
    (patch) => {
      if (selectedId == null) return;
      patchCurrentItems((prev) =>
        prev.map((item) =>
          item.id === selectedId && item.type === "text"
            ? { ...item, ...patch }
            : item
        )
      );
    },
    [selectedId, patchCurrentItems]
  );

  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        patchCurrentItems((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: "image",
            src: result,
            x: 250,
            y: 200,
            scaleX: 0.5,
            scaleY: 0.5,
            rotation: 0,
          },
        ]);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const handleStageMouseDown = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  const deleteSelected = useCallback(() => {
    if (selectedId == null) return;
    patchCurrentItems((prev) => prev.filter((item) => item.id !== selectedId));
    setSelectedId(null);
  }, [selectedId, patchCurrentItems]);

  const handleSaveToFile = useCallback(() => {
    downloadScrapbookFile({ pages: doc.pages, pageIndex: doc.pageIndex });
  }, [doc.pages, doc.pageIndex]);

  const handleLoadFromFileClick = useCallback(() => {
    if (
      !window.confirm(
        "Load a scrapbook from file? The current scrapbook will be replaced — use Save to file first if you need to keep it."
      )
    ) {
      return;
    }
    loadFileInputRef.current?.click();
  }, []);

  const handleLoadFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        const parsed = parseScrapbookPayload(data);
        if (!parsed) {
          window.alert("That file is not a valid scrapbook.");
          return;
        }
        setDoc(parsed);
        setSelectedId(null);
      } catch {
        window.alert("Could not read that file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }, []);

  const goPrevPage = useCallback(() => {
    setDoc((d) => ({
      ...d,
      pageIndex: Math.max(0, d.pageIndex - 1),
    }));
  }, []);

  const goNextPage = useCallback(() => {
    setDoc((d) => ({
      ...d,
      pageIndex: Math.min(d.pageIndex + 1, d.pages.length - 1),
    }));
  }, []);

  const addPage = useCallback(() => {
    setDoc((d) => ({
      pages: [...d.pages, []],
      pageIndex: d.pages.length,
    }));
  }, []);

  const deleteCurrentPage = useCallback(() => {
    if (pages.length <= 1) return;
    if (
      !window.confirm(
        "Delete this page and everything on it? This cannot be undone."
      )
    ) {
      return;
    }
    setDoc((d) => {
      if (d.pages.length <= 1) return d;
      const nextPages = d.pages.filter((_, i) => i !== d.pageIndex);
      let nextIndex = d.pageIndex;
      if (nextIndex >= nextPages.length) nextIndex = nextPages.length - 1;
      return { pages: nextPages, pageIndex: nextIndex };
    });
    setSelectedId(null);
  }, [pages.length]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== "Delete" && e.key !== "Backspace") return;
      const el = document.activeElement;
      const tag = el?.tagName?.toLowerCase();
      if (
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        el?.isContentEditable
      ) {
        return;
      }
      if (selectedId == null) return;
      e.preventDefault();
      deleteSelected();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedId, deleteSelected]);

  const pageCount = pages.length;
  const currentPageLabel = pageIndex + 1;
  const canPrev = pageIndex > 0;
  const canNext = pageIndex < pageCount - 1;
  const canDeletePage = pageCount > 1;

  return (
    <div className="flex min-h-screen flex-col bg-orange-200">
      <input
        ref={loadFileInputRef}
        type="file"
        accept="application/json,.json"
        className="sr-only"
        aria-hidden
        tabIndex={-1}
        onChange={handleLoadFileChange}
      />
      <AppHeader
        onLoadFromFile={handleLoadFromFileClick}
        onSaveToFile={handleSaveToFile}
      />

      {selectedTextItem ? (
        <div className="z-30 flex w-full shrink-0 justify-center border-b border-amber-800/25 bg-white/95 px-3 py-2.5 shadow-sm backdrop-blur-sm">
          <TextFormatToolbar
            textItem={selectedTextItem}
            onPatch={patchSelectedText}
          />
        </div>
      ) : null}

      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-8 pt-4 sm:pl-48">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-amber-50 to-amber-100 p-4 shadow-2xl">
          <Stage
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="max-h-[min(CANVAS_HEIGHT,70vh)] min-h-[CANVAS_HEIGHT] w-full max-w-full rounded-2xl"
            style={{
              background:
                "repeating-linear-gradient(to bottom, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 36px)",
            }}
            onMouseDown={handleStageMouseDown}
          >
            <Layer key={pageIndex}>
              {items.map((item, i) =>
                item.type === "image" ? (
                  <ImageItem
                    key={item.id}
                    image={item}
                    isSelected={item.id === selectedId}
                    onSelect={() => setSelectedId(item.id)}
                    onChange={(newAttrs) => {
                      patchCurrentItems((prev) => {
                        const next = prev.slice();
                        next[i] = newAttrs;
                        return next;
                      });
                    }}
                  />
                ) : item.type === "sticker" ? (
                  <StickerItem
                    key={item.id}
                    image={item}
                    isSelected={item.id === selectedId}
                    onSelect={() => setSelectedId(item.id)}
                    onChange={(newAttrs) => {
                      patchCurrentItems((prev) => {
                        const next = prev.slice();
                        next[i] = newAttrs;
                        return next;
                      });
                    }}
                  />
                ) : (
                  <TextItem
                    key={item.id}
                    textItem={item}
                    isSelected={item.id === selectedId}
                    onSelect={() => setSelectedId(item.id)}
                    onChange={(newAttrs) => {
                      patchCurrentItems((prev) => {
                        const next = prev.slice();
                        next[i] = newAttrs;
                        return next;
                      });
                    }}
                  />
                )
              )}
            </Layer>
          </Stage>
        </div>

        <nav
          className="mt-4 flex w-full max-w-[832px] flex-wrap items-center justify-center gap-2 sm:gap-3"
          aria-label="Pages"
        >
          <button
            type="button"
            disabled={!canPrev}
            className="rounded-full bg-stone-600 px-3 py-2 text-sm font-bold text-white shadow-md transition-colors hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-300 disabled:text-stone-500"
            onClick={goPrevPage}
          >
            ← Prev
          </button>
          <span className="min-w-[5.5rem] text-center text-sm font-semibold tabular-nums text-amber-900">
            Page {currentPageLabel} / {pageCount}
          </span>
          <button
            type="button"
            disabled={!canNext}
            className="rounded-full bg-stone-600 px-3 py-2 text-sm font-bold text-white shadow-md transition-colors hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-300 disabled:text-stone-500"
            onClick={goNextPage}
          >
            Next →
          </button>
          <button
            type="button"
            className="rounded-full bg-violet-700 px-3 py-2 text-sm font-bold text-white shadow-md transition-colors hover:bg-violet-800"
            onClick={addPage}
          >
            + Add page
          </button>
          <button
            type="button"
            disabled={!canDeletePage}
            className="rounded-full border-2 border-red-800 bg-white px-3 py-2 text-sm font-bold text-red-900 shadow-md transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:border-stone-300 disabled:bg-stone-100 disabled:text-stone-400"
            onClick={deleteCurrentPage}
          >
            Delete page
          </button>
        </nav>
      </main>

      <AppBottomBar
        onOpenStickerPicker={() => setStickerPickerOpen(true)}
        onDeleteSelected={deleteSelected}
        onUploadImage={handleUploadImage}
        onAddText={handleAddText}
        canDelete={selectedId != null}
      />

      <StickerPickerModal
        isOpen={stickerPickerOpen}
        onClose={() => setStickerPickerOpen(false)}
        onSelectSticker={handleStickerSelected}
      />
    </div>
  );
}
