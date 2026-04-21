import { useRef, useEffect } from "react";
import { Text as KonvaText, Transformer } from "react-konva";
import { parseFontStyle } from "../textFormatting";

const TextItem = ({ textItem, isSelected, onSelect, onChange, isViewMode }) => {
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const startTextEdit = () => {
    if (isViewMode) return;
    const textNode = shapeRef.current;
    const stage = textNode.getStage();
    const layer = textNode.getLayer();

    textNode.hide();
    if (trRef.current) {
      trRef.current.hide();
    }
    layer.draw();

    const textPosition = textNode.absolutePosition();
    const stageBox = stage.container().getBoundingClientRect();
    const stageScaleX = stageBox.width / stage.width();
    const stageScaleY = stageBox.height / stage.height();
    const absScale = textNode.getAbsoluteScale();
    const areaPosition = {
      x: stageBox.left + textPosition.x * stageScaleX,
      y: stageBox.top + textPosition.y * stageScaleY,
    };

    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);

    textarea.value = textNode.text();
    textarea.style.position = "absolute";
    textarea.style.top = areaPosition.y + "px";
    textarea.style.left = areaPosition.x + "px";
    textarea.style.width =
      (textNode.width() - textNode.padding() * 2) * stageScaleX + "px";
    textarea.style.height =
      (textNode.height() - textNode.padding() * 2 + 5) * stageScaleY + "px";
    textarea.style.fontSize = textNode.fontSize() * stageScaleY + "px";
    textarea.style.border = "none";
    textarea.style.padding = "0px";
    textarea.style.margin = "0px";
    textarea.style.overflow = "hidden";
    textarea.style.background = "#ffffff";
    textarea.style.border = "1px solid rgba(120, 53, 15, 0.25)";
    textarea.style.borderRadius = "6px";
    textarea.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.12)";
    textarea.style.padding = "2px 4px";
    textarea.style.outline = "none";
    textarea.style.resize = "none";
    textarea.style.lineHeight = String(textNode.lineHeight());
    textarea.style.fontFamily = textNode.fontFamily();
    const fs = parseFontStyle(textNode.fontStyle());
    textarea.style.fontWeight = fs.bold ? "bold" : "normal";
    textarea.style.fontStyle = fs.italic ? "italic" : "normal";
    textarea.style.textDecoration = textNode.textDecoration() || "none";
    textarea.style.transformOrigin = "left top";
    textarea.style.textAlign = textNode.align();
    textarea.style.color = textNode.fill().toString();

    const rotation = textNode.rotation();
    let transform = "";
    if (rotation) {
      transform += "rotateZ(" + rotation + "deg)";
    }
    const transformScaleX = absScale.x / Math.max(stageScaleX, 0.0001);
    const transformScaleY = absScale.y / Math.max(stageScaleY, 0.0001);
    transform += ` scale(${transformScaleX}, ${transformScaleY})`;
    textarea.style.transform = transform;

    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + 3 + "px";
    textarea.focus();

    const removeTextarea = () => {
      if (textarea.parentNode) {
        textarea.parentNode.removeChild(textarea);
      }
      window.removeEventListener("click", handleOutsideClick);
      window.removeEventListener("touchstart", handleOutsideClick);
      textNode.show();
      if (trRef.current) {
        trRef.current.show();
        trRef.current.forceUpdate();
      }
      layer.draw();
    };

    const setTextareaWidth = (newWidth = 0) => {
      if (!newWidth) {
        newWidth = textNode.text().length * textNode.fontSize();
      }
      textarea.style.width = newWidth + "px";
    };

    textarea.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        textNode.text(textarea.value);
        onChange({ ...textItem, text: textarea.value });
        removeTextarea();
      }
      if (e.key === "Escape") {
        removeTextarea();
      }
    });

    textarea.addEventListener("input", function () {
      const scale = textNode.getAbsoluteScale().x;
      setTextareaWidth(textNode.width() * scale * stageScaleX);
      textarea.style.height = "auto";
      textarea.style.height =
        textarea.scrollHeight + textNode.fontSize() * stageScaleY + "px";
    });

    const handleOutsideClick = (e) => {
      if (e.target !== textarea) {
        textNode.text(textarea.value);
        onChange({ ...textItem, text: textarea.value });
        removeTextarea();
      }
    };

    setTimeout(() => {
      window.addEventListener("click", handleOutsideClick);
      window.addEventListener("touchstart", handleOutsideClick);
    });
  };

  return (
    <>
      <KonvaText
        ref={shapeRef}
        text={textItem.text}
        x={textItem.x}
        y={textItem.y}
        draggable={!isViewMode}
        rotation={textItem.rotation}
        scaleX={textItem.scaleX}
        scaleY={textItem.scaleY}
        fontSize={textItem.fontSize}
        fill={textItem.fill}
        fontFamily={textItem.fontFamily || "Patrick Hand, cursive"}
        fontStyle={textItem.fontStyle ?? "normal"}
        align={textItem.align ?? "left"}
        textDecoration={textItem.textDecoration ?? ""}
        lineHeight={textItem.lineHeight ?? 1.2}
        width={textItem.width}
        onClick={!isViewMode ? onSelect : undefined}
        onTap={!isViewMode ? onSelect : undefined}
        onDblClick={!isViewMode ? startTextEdit : undefined}
        onDblTap={!isViewMode ? startTextEdit : undefined}
        onDragEnd={(e) => {
          if (isViewMode) return;
          onChange({
            ...textItem,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          if (isViewMode) return;
          const node = e.target;
          onChange({
            ...textItem,
            x: node.x(),
            y: node.y(),
            width: node.width() * node.scaleX(),
            scaleX: 1,
            scaleY: node.scaleY(),
            rotation: node.rotation(),
          });
        }}
        onTransform={(e) => {
          if (isViewMode) return;
          const node = e.target;
          node.setAttrs({
            width: node.width() * node.scaleX(),
            scaleX: 1,
          });
        }}
      />
      {isSelected && !isViewMode && (
        <Transformer
          ref={trRef}
          rotateEnabled={true}
          enabledAnchors={["middle-left", "middle-right"]}
          boundBoxFunc={(oldBox, newBox) => {
            newBox.width = Math.max(30, newBox.width);
            return newBox;
          }}
        />
      )}
    </>
  );
};

export default TextItem;
