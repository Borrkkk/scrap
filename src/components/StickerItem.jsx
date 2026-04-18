import { useRef, useEffect } from "react";
import { Image as KonvaImage, Transformer } from "react-konva";
import useImage from "use-image";

const StickerItem = ({ image, isSelected, onSelect, onChange, isViewMode }) => {
  const [img] = useImage(image.src);
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <KonvaImage
        ref={shapeRef}
        image={img}
        x={image.x}
        y={image.y}
        draggable={!isViewMode}
        rotation={image.rotation}
        scaleX={image.scaleX}
        scaleY={image.scaleY}
        onClick={!isViewMode ? onSelect : undefined}
        onTap={!isViewMode ? onSelect : undefined}
        onDragEnd={(e) => {
          if (isViewMode) return;
          onChange({
            ...image,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          if (isViewMode) return;
          const node = e.target;
          onChange({
            ...image,
            x: node.x(),
            y: node.y(),
            scaleX: node.scaleX(),
            scaleY: node.scaleY(),
            rotation: node.rotation(),
          });
        }}
      />
      {isSelected && !isViewMode && <Transformer ref={trRef} rotateEnabled={true} />}
    </>
  );
};

export default StickerItem;
