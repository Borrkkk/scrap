import { useRef, useEffect, useState } from "react";
import {
  Image as KonvaImage,
  Group,
  Rect,
  Text as KonvaText,
  Transformer,
} from "react-konva";
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

const HOVER_TILT_DEGREES = 4;
const HOVER_LIFT = 0.04;
const DEFAULT_CAPTION = "Sweet memory";

const ImageItem = ({ image, isSelected, onSelect, onChange, isViewMode }) => {
  const [img] = useImage(image.src);
  const shapeRef = useRef();
  const trRef = useRef();
  const [hoverRotation, setHoverRotation] = useState(0);
  const [hoverScale, setHoverScale] = useState(1);

  useEffect(() => {
    if (isSelected && !isViewMode && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected, isViewMode]);

  if (!img) {
    return null;
  }

  const nw = img.naturalWidth || img.width;
  const nh = img.naturalHeight || img.height;
  const matW = nw + MAT_LEFT + MAT_RIGHT;
  const matH = nh + MAT_TOP + MAT_BOTTOM;
  const caption = image.caption || DEFAULT_CAPTION;

  return (
    <>
      <Group
        ref={shapeRef}
        x={image.x}
        y={image.y}
        rotation={image.rotation + hoverRotation}
        scaleX={image.scaleX * hoverScale}
        scaleY={image.scaleY * hoverScale}
        draggable={!isViewMode}
        onClick={!isViewMode ? onSelect : undefined}
        onTap={!isViewMode ? onSelect : undefined}
        onDragEnd={(e) => {
          if (isViewMode) return;
          const node = e.target;
          onChange({
            ...image,
            x: node.x(),
            y: node.y(),
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
        onMouseMove={(e) => {
          if (!isViewMode) return;
          const group = e.target.getParent();
          const stage = group.getStage();
          const pointer = stage?.getPointerPosition();
          if (!pointer) return;
          const centerX = group.x() + (matW * image.scaleX) / 2;
          const offset = (pointer.x - centerX) / Math.max(1, (matW * image.scaleX) / 2);
          const clamped = Math.max(-1, Math.min(1, offset));
          setHoverRotation(clamped * HOVER_TILT_DEGREES);
          setHoverScale(1 + HOVER_LIFT);
        }}
        onMouseLeave={() => {
          if (!isViewMode) return;
          setHoverRotation(0);
          setHoverScale(1);
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
        <KonvaText
          text={caption}
          x={MAT_LEFT}
          y={MAT_TOP + nh + 10}
          width={nw}
          align="center"
          fontSize={24}
          fill="#4b392d"
          fontFamily="Patrick Hand, cursive"
        />
      </Group>
      {isSelected && !isViewMode && <Transformer ref={trRef} rotateEnabled={true} />}
    </>
  );
};

export default ImageItem;
