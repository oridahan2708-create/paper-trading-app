// Dark-only theme. There is no light mode in this app by design.
export const colors = {
  background: '#05060A',
  backgroundElevated: '#0D0F16',
  surface: '#12141C',
  surfaceAlt: '#191C27',
  border: '#232635',
  borderSubtle: '#1A1D28',

  textPrimary: '#F5F6FA',
  textSecondary: '#9AA0B4',
  textTertiary: '#6B7086',
  textInverse: '#05060A',

  accent: '#6E5BFF',
  accentMuted: '#6E5BFF33',
  accentSecondary: '#00D1FF',

  positive: '#1FD97C',
  positiveMuted: '#1FD97C22',
  negative: '#FF4D67',
  negativeMuted: '#FF4D6722',
  warning: '#FFB13D',

  gold: '#FFC94D',
  silver: '#C9CDDB',
  bronze: '#E08B4E',

  overlay: 'rgba(5, 6, 10, 0.82)',
  divider: '#1E212C',
} as const;

export const gradients = {
  accent: ['#6E5BFF', '#00D1FF'] as const,
  positive: ['#1FD97C', '#0EA968'] as const,
  negative: ['#FF4D67', '#C22A44'] as const,
};

export function changeColor(value: number): string {
  if (value > 0) return colors.positive;
  if (value < 0) return colors.negative;
  return colors.textSecondary;
}

export function changeMutedColor(value: number): string {
  if (value > 0) return colors.positiveMuted;
  if (value < 0) return colors.negativeMuted;
  return colors.surfaceAlt;
}
