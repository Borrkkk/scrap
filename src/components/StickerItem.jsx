import { useRef, useEffect, useState } from "react";
import { Image as KonvaImage, Transformer, Line } from "react-konva";
import useImage from "use-image";

const StickerItem = ({ image, isSelected, onSelect, onChange, isViewMode }) => {
  const [img] = useImage(image.src);
  const shapeRef = useRef();
  const trRef = useRef();
  const [isHovered, setIsHovered] = useState(false);
  const [sparklePhase, setSparklePhase] = useState(0);
  const sparkleSeedRef = useRef(Math.random() * Math.PI * 2);
  const sparkleSpeedRef = useRef(0.85 + Math.random() * 0.55);
  const sparkleDriftRef = useRef(0.7 + Math.random() * 0.8);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  useEffect(() => {
    if (!isHovered || !isViewMode) {
      setSparklePhase(0);
      return;
    }
    let frameId = 0;
    const animate = (time) => {
      setSparklePhase(
        sparkleSeedRef.current + (time / 260) * sparkleSpeedRef.current
      );
      frameId = window.requestAnimationFrame(animate);
    };
    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
  }, [isHovered, isViewMode]);

  const stickerWidth = (img?.naturalWidth || img?.width || 120) * (image.scaleX || 1);
  const stickerHeight = (img?.naturalHeight || img?.height || 120) * (image.scaleY || 1);
  const sparkleColor = "#7dd3fc";
  const sparkleHighlightColor = "#ffffff";
  const sparkleStroke = 2.2;
  const sparkleSize = 8;
  const pulseScale = 0.8 + (Math.sin(sparklePhase) + 1) * 0.25;
  const driftX = Math.cos(sparklePhase * 0.8 * sparkleDriftRef.current) * 2.2;
  const driftY = Math.sin(sparklePhase * 1.1 * sparkleDriftRef.current) * 1.8;
  const showSparkles = isViewMode && isHovered;

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
        shadowEnabled={showSparkles}
        shadowColor={sparkleColor}
        shadowBlur={showSparkles ? 18 + Math.sin(sparklePhase * 1.2) * 8 : 0}
        shadowOpacity={
          showSparkles ? 0.55 + (Math.sin(sparklePhase) + 1) * 0.15 : 0
        }
        onClick={!isViewMode ? onSelect : undefined}
        onTap={!isViewMode ? onSelect : undefined}
        onMouseEnter={() => setIsHovered(isViewMode)}
        onMouseLeave={() => setIsHovered(false)}
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
      {showSparkles ? (
        <>
          <Line
            points={[
              image.x - sparkleSize,
              image.y + 8 + driftY,
              image.x + sparkleSize,
              image.y + 8 + driftY,
            ]}
            stroke={sparkleColor}
            strokeWidth={sparkleStroke * pulseScale}
            lineCap="round"
            listening={false}
          />
          <Line
            points={[
              image.x - sparkleSize * 0.45,
              image.y + 8 + driftY,
              image.x + sparkleSize * 0.45,
              image.y + 8 + driftY,
            ]}
            stroke={sparkleHighlightColor}
            strokeWidth={Math.max(1, sparkleStroke * pulseScale * 0.45)}
            lineCap="round"
            opacity={0.95}
            listening={false}
          />
          <Line
            points={[
              image.x,
              image.y - sparkleSize + 8 + driftY,
              image.x,
              image.y + sparkleSize + 8 + driftY,
            ]}
            stroke={sparkleColor}
            strokeWidth={sparkleStroke * pulseScale}
            lineCap="round"
            listening={false}
          />
          <Line
            points={[
              image.x,
              image.y - sparkleSize * 0.45 + 8 + driftY,
              image.x,
              image.y + sparkleSize * 0.45 + 8 + driftY,
            ]}
            stroke={sparkleHighlightColor}
            strokeWidth={Math.max(1, sparkleStroke * pulseScale * 0.45)}
            lineCap="round"
            opacity={0.95}
            listening={false}
          />
          <Line
            points={[
              image.x + stickerWidth + 6 - sparkleSize + driftX,
              image.y + 10 - driftY * 0.4,
              image.x + stickerWidth + 6 + sparkleSize + driftX,
              image.y + 10 - driftY * 0.4,
            ]}
            stroke={sparkleColor}
            strokeWidth={sparkleStroke * pulseScale}
            lineCap="round"
            listening={false}
          />
          <Line
            points={[
              image.x + stickerWidth + 6 + driftX,
              image.y + 10 - sparkleSize - driftY * 0.4,
              image.x + stickerWidth + 6 + driftX,
              image.y + 10 + sparkleSize - driftY * 0.4,
            ]}
            stroke={sparkleColor}
            strokeWidth={sparkleStroke * pulseScale}
            lineCap="round"
            listening={false}
          />
          <Line
            points={[
              image.x + stickerWidth + 6 + driftX,
              image.y + 10 - sparkleSize * 0.45 - driftY * 0.4,
              image.x + stickerWidth + 6 + driftX,
              image.y + 10 + sparkleSize * 0.45 - driftY * 0.4,
            ]}
            stroke={sparkleHighlightColor}
            strokeWidth={Math.max(1, sparkleStroke * pulseScale * 0.45)}
            lineCap="round"
            opacity={0.95}
            listening={false}
          />
          <Line
            points={[
              image.x + stickerWidth * 0.35 - sparkleSize * 0.6 - driftX * 0.6,
              image.y + stickerHeight + 8 + driftY * 0.5,
              image.x + stickerWidth * 0.35 + sparkleSize * 0.6 - driftX * 0.6,
              image.y + stickerHeight + 8 + driftY * 0.5,
            ]}
            stroke={sparkleColor}
            strokeWidth={(sparkleStroke - 0.6) * pulseScale}
            lineCap="round"
            listening={false}
          />
          <Line
            points={[
              image.x + stickerWidth * 0.35 - driftX * 0.6,
              image.y + stickerHeight + 8 - sparkleSize * 0.6 + driftY * 0.5,
              image.x + stickerWidth * 0.35 - driftX * 0.6,
              image.y + stickerHeight + 8 + sparkleSize * 0.6 + driftY * 0.5,
            ]}
            stroke={sparkleColor}
            strokeWidth={(sparkleStroke - 0.6) * pulseScale}
            lineCap="round"
            listening={false}
          />
        </>
      ) : null}
      {isSelected && !isViewMode && <Transformer ref={trRef} rotateEnabled={true} />}
    </>
  );
};

export default StickerItem;
