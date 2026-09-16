import { useMemo } from 'react';
import Svg, { Line as SvgLine, Rect } from 'react-native-svg';

import { colors } from '@/theme/colors';
import type { CandlePoint } from '@/api/types';

interface Props {
  data: CandlePoint[];
  width: number;
  height: number;
}

export function CandlestickChartView({ data, width, height }: Props) {
  const candles = useMemo(() => {
    if (data.length === 0) return [];

    const min = Math.min(...data.map((c) => c.low));
    const max = Math.max(...data.map((c) => c.high));
    const span = max - min || 1;
    const padY = height * 0.08;
    const innerHeight = height - padY * 2;
    const slotWidth = width / data.length;
    const bodyWidth = Math.max(1, slotWidth * 0.6);

    const toY = (value: number) => padY + (1 - (value - min) / span) * innerHeight;

    return data.map((c, i) => {
      const x = i * slotWidth + slotWidth / 2;
      const isUp = c.close >= c.open;
      const color = isUp ? colors.positive : colors.negative;
      const bodyTop = toY(Math.max(c.open, c.close));
      const bodyBottom = toY(Math.min(c.open, c.close));
      return {
        key: i,
        x,
        color,
        wickY1: toY(c.high),
        wickY2: toY(c.low),
        bodyX: x - bodyWidth / 2,
        bodyY: bodyTop,
        bodyWidth,
        bodyHeight: Math.max(1.5, bodyBottom - bodyTop),
      };
    });
  }, [data, width, height]);

  if (candles.length === 0) return null;

  return (
    <Svg width={width} height={height}>
      {candles.map((c) => (
        <SvgLine key={`wick-${c.key}`} x1={c.x} y1={c.wickY1} x2={c.x} y2={c.wickY2} stroke={c.color} strokeWidth={1} />
      ))}
      {candles.map((c) => (
        <Rect
          key={`body-${c.key}`}
          x={c.bodyX}
          y={c.bodyY}
          width={c.bodyWidth}
          height={c.bodyHeight}
          fill={c.color}
          rx={1}
        />
      ))}
    </Svg>
  );
}
