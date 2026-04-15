/** Konva.Text `fontStyle`: normal | italic | bold | italic bold */

export function parseFontStyle(fontStyle) {
  const s = fontStyle || "normal";
  return {
    bold: s.includes("bold"),
    italic: s.includes("italic"),
  };
}

export function composeFontStyle({ bold, italic }) {
  if (bold && italic) return "italic bold";
  if (bold) return "bold";
  if (italic) return "italic";
  return "normal";
}
