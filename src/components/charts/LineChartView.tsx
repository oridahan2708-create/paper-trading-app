import { useMemo } from 'react';
import Svg, { Defs, LinearGradient, Path, Stop, Line as SvgLine } from 'react-native-svg';

import { colors } from '@/theme/colors';
import type { LinePoint } from '@/api/types';

interface Props {
  data: LinePoint[];
  width: number;
  height: number;
  positive: boolean;
}

export function LineChartView({ data, width, height, positive }: Props) {
  const stroke = positive ? colors.positive : colors.negative;
  const gradientId = positive ? 'lineGradientPositive' : 'lineGradientNegative';

  const { linePath, areaPath, gridLines } = useMemo(() => {
    if (data.length < 2) return { linePath: '', areaPath: '', gridLines: [] as number[] };

    const values = data.map((p) => p.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;
    const stepX = width / (data.length - 1);
    const padY = height * 0.08;

    const points = data.map((p, i) => {
      const x = i * stepX;
      const y = padY + (1 - (p.value - min) / span) * (height - padY * 2);
      return [x, y] as const;
    });

    const line = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
    const area = `${line} L${width},${height} L0,${height} Z`;
    const grid = [0.25, 0.5, 0.75].map((f) => padY + f * (height - padY * 2));

    return { linePath: line, areaPath: area, gridLines: grid };
  }, [data, width, height]);

  if (!linePath) return null;

  return (
    <Svg width={width} height={height}>
      <Defs>
        <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={stroke} stopOpacity={0.35} />
          <Stop offset="1" stopColor={stroke} stopOpacity={0} />
        </LinearGradient>
      </Defs>
      {gridLines.map((y, i) => (
        <SvgLine key={i} x1={0} y1={y} x2={width} y2={y} stroke={colors.divider} strokeWidth={1} />
      ))}
      <Path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
      <Path d={linePath} stroke={stroke} strokeWidth={2} fill="none" strokeLinejoin="round" strokeLinecap="round" />
    </Svg>
  );
}
