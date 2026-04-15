import { useRef, useEffect } from "react";
import { Image as KonvaImage, Group, Rect, Transformer } from "react-konva";
import useImage from "use-image";

/** White mat (px) — thin on top / sides, thicker bottom (polaroid-style). */
const MAT_TOP = 12;
const MAT_LEFT = 12;
const MAT_RIGHT = 12;
const MAT_BOTTOM = 52;

/** Drop shadow on the mat rect — Group shadows often don’t render in Konva; Rect does. */
const SHADOW_BLUR = 10;
const SHADOW_OFFSET_X = 3;
const SHADOW_OFFSET_Y = 8;
const SHADOW_OPACITY = 0.2;

const ImageItem = ({ image, isSelected, onSelect, onChange }) => {
  const [img] = useImage(image.src);
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  if (!img) {
    return null;
  }

  const nw = img.naturalWidth || img.width;
  const nh = img.naturalHeight || img.height;
  const matW = nw + MAT_LEFT + MAT_RIGHT;
  const matH = nh + MAT_TOP + MAT_BOTTOM;

  return (
    <>
      <Group
        ref={shapeRef}
        x={image.x}
        y={image.y}
        rotation={image.rotation}
        scaleX={image.scaleX}
        scaleY={image.scaleY}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          const node = e.target;
          onChange({
            ...image,
            x: node.x(),
            y: node.y(),
          });
        }}
        onTransformEnd={(e) => {
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
      >
        <Rect
          width={matW}
          height={matH}
          fill="#ffffff"
          shadowEnabled
          shadowColor="#000000"
          shadowBlur={SHADOW_BLUR}
          shadowOpacity={SHADOW_OPACITY}
          shadowOffsetX={SHADOW_OFFSET_X}
          shadowOffsetY={SHADOW_OFFSET_Y}
        />
        <KonvaImage image={img} x={MAT_LEFT} y={MAT_TOP} width={nw} height={nh} />
      </Group>
      {isSelected && <Transformer ref={trRef} rotateEnabled={true} />}
    </>
  );
};

export default ImageItem;
