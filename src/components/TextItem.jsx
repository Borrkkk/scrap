import { useRef, useEffect } from "react";
import { Text as KonvaText, Transformer } from "react-konva";
import { parseFontStyle } from "../textFormatting";

const TextItem = ({ textItem, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const startTextEdit = () => {
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
    const areaPosition = {
      x: stageBox.left + textPosition.x,
      y: stageBox.top + textPosition.y,
    };

    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);

    textarea.value = textNode.text();
    textarea.style.position = "absolute";
    textarea.style.top = areaPosition.y + "px";
    textarea.style.left = areaPosition.x + "px";
    textarea.style.width = textNode.width() - textNode.padding() * 2 + "px";
    textarea.style.height = textNode.height() - textNode.padding() * 2 + 5 + "px";
    textarea.style.fontSize = textNode.fontSize() + "px";
    textarea.style.border = "none";
    textarea.style.padding = "0px";
    textarea.style.margin = "0px";
    textarea.style.overflow = "hidden";
    textarea.style.background = "none";
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
    transform += "translateY(-2px)";
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
      setTextareaWidth(textNode.width() * scale);
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + textNode.fontSize() + "px";
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
        draggable
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
        onClick={onSelect}
        onTap={onSelect}
        onDblClick={startTextEdit}
        onDblTap={startTextEdit}
        onDragEnd={(e) => {
          onChange({
            ...textItem,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
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
          const node = e.target;
          node.setAttrs({
            width: node.width() * node.scaleX(),
            scaleX: 1,
          });
        }}
      />
      {isSelected && (
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
