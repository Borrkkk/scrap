import { parseFontStyle, composeFontStyle } from "../textFormatting";

const FONT_OPTIONS = [
  { value: "Patrick Hand, cursive", label: "Patrick Hand" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: "Comic Neue, cursive", label: "Comic Neue" },
  { value: "ui-sans-serif, system-ui, sans-serif", label: "System UI" },
  { value: "ui-monospace, monospace", label: "Monospace" },
];

function normalizeColorForPicker(fill) {
  if (typeof fill !== "string") return "#000000";
  if (fill.startsWith("#") && (fill.length === 4 || fill.length === 7)) return fill;
  const named = {
    black: "#000000",
    white: "#ffffff",
    red: "#ff0000",
    navy: "#000080",
  };
  return named[fill.toLowerCase()] ?? "#000000";
}

export default function TextFormatToolbar({ textItem, onPatch }) {
  if (!textItem) return null;

  const { bold, italic } = parseFontStyle(textItem.fontStyle);
  const td = textItem.textDecoration ?? "";
  const underline = td.includes("underline");
  const align = textItem.align ?? "left";
  const fontSize = textItem.fontSize ?? 24;
  const fill = textItem.fill ?? "#000000";
  const fontFamily = textItem.fontFamily ?? "Patrick Hand, cursive";
  const fontChoices = FONT_OPTIONS.some((o) => o.value === fontFamily)
    ? FONT_OPTIONS
    : [{ value: fontFamily, label: "Current font" }, ...FONT_OPTIONS];

  const toggleBold = () => {
    onPatch({ fontStyle: composeFontStyle({ bold: !bold, italic }) });
  };

  const toggleItalic = () => {
    onPatch({ fontStyle: composeFontStyle({ bold, italic: !italic }) });
  };

  const toggleUnderline = () => {
    onPatch({ textDecoration: underline ? "" : "underline" });
  };

  const fillForPicker = normalizeColorForPicker(fill);

  return (
    <div
      className="flex w-full max-w-[min(100%,56rem)] flex-wrap items-center justify-center gap-2 sm:gap-3"
      role="group"
      aria-label="Text formatting"
    >
      <label className="flex items-center gap-1.5 text-xs font-semibold text-amber-900">
        Font
        <select
          className="max-w-[11rem] rounded-lg border border-amber-300 bg-white px-2 py-1.5 text-sm text-stone-900 shadow-sm"
          value={fontFamily}
          onChange={(e) => onPatch({ fontFamily: e.target.value })}
        >
          {fontChoices.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-1.5 text-xs font-semibold text-amber-900">
        Size
        <input
          type="number"
          min={8}
          max={200}
          className="w-16 rounded-lg border border-amber-300 bg-white px-2 py-1.5 text-sm tabular-nums text-stone-900 shadow-sm"
          value={fontSize}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (!Number.isFinite(n)) return;
            onPatch({ fontSize: Math.min(200, Math.max(8, Math.round(n))) });
          }}
        />
      </label>

      <div className="flex items-center gap-1 rounded-lg border border-amber-300 bg-amber-50/80 p-0.5">
        <button
          type="button"
          title="Bold"
          className={`rounded-md px-2.5 py-1.5 text-sm font-bold ${
            bold ? "bg-amber-700 text-white" : "text-stone-700 hover:bg-amber-100"
          }`}
          onClick={toggleBold}
        >
          B
        </button>
        <button
          type="button"
          title="Italic"
          className={`rounded-md px-2.5 py-1.5 text-sm italic ${
            italic ? "bg-amber-700 text-white" : "text-stone-700 hover:bg-amber-100"
          }`}
          onClick={toggleItalic}
        >
          I
        </button>
        <button
          type="button"
          title="Underline"
          className={`rounded-md px-2.5 py-1.5 text-sm underline ${
            underline ? "bg-amber-700 text-white" : "text-stone-700 hover:bg-amber-100"
          }`}
          onClick={toggleUnderline}
        >
          U
        </button>
      </div>

      <label className="flex items-center gap-1.5 text-xs font-semibold text-amber-900">
        Color
        <input
          type="color"
          className="h-9 w-10 cursor-pointer rounded border border-amber-300 bg-white p-0.5"
          value={fillForPicker}
          onChange={(e) => onPatch({ fill: e.target.value })}
        />
      </label>

      <div className="flex items-center gap-1 rounded-lg border border-amber-300 bg-amber-50/80 p-0.5">
        {["left", "center", "right"].map((a) => (
          <button
            key={a}
            type="button"
            title={`Align ${a}`}
            className={`rounded-md px-2.5 py-1.5 text-xs font-semibold capitalize ${
              align === a ? "bg-amber-700 text-white" : "text-stone-700 hover:bg-amber-100"
            }`}
            onClick={() => onPatch({ align: a })}
          >
            {a === "left" ? "Left" : a === "center" ? "Center" : "Right"}
          </button>
        ))}
      </div>
    </div>
  );
}
