import { useMemo } from "react";
import { Line } from "react-konva";
import { Line as LineType } from "@/types";
import { useAppStore } from "@/store";

interface ConnectionProps {
  connection: LineType;
  stageScale: number;
}

const Connection = ({ connection, stageScale }: ConnectionProps) => {
  const { start, end } = connection;
  const { lineColor } = useAppStore();

  const lineData = useMemo(() => {
    if (
      typeof start?.x !== "number" ||
      typeof start?.y !== "number" ||
      typeof end?.x !== "number" ||
      typeof end?.y !== "number"
    ) {
      return null;
    }

    const baseStrokeWidth = 2;
    const strokeWidth = baseStrokeWidth / Math.max(stageScale, 0.001);

    return {
      points: [start.x, start.y, end.x, end.y],
      strokeWidth,
    };
  }, [start?.x, start?.y, end?.x, end?.y, stageScale]);

  if (!lineData) return null;

  return (
    <Line
      points={lineData.points}
      stroke={lineColor}
      strokeWidth={lineData.strokeWidth}
      shadowBlur={1}
      shadowOpacity={0.5}
      perfectDrawEnabled={false}
      listening={false}
    />
  );
};

export default Connection;
