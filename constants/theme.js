export const COLORS = {
  background: '#0A0A0F',
  surface: '#13131A',
  surface2: '#1C1C26',
  primary: '#6C63FF',
  primaryLight: '#8B85FF',
  secondary: '#FF6584',
  success: '#43E97B',
  warning: '#FFB347',
  text: '#FFFFFF',
  textMuted: '#8888AA',
  textFaint: '#444466',
  border: '#2A2A3A',
  gold: '#FFD700',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  card: 16,
  button: 12,
  pill: 50,
};

export const FONTS = {
  bold: { fontWeight: '700' },
  medium: { fontWeight: '500' },
  regular: { fontWeight: '400' },
};

export const BUTTON = {
  primary: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: RADIUS.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    color: COLORS.text,
    fontSize: 16,
    ...FONTS.bold,
  },
};

export const CARD = {
  backgroundColor: COLORS.surface,
  borderRadius: RADIUS.card,
  borderWidth: 1,
  borderColor: COLORS.border,
  padding: SPACING.md,
};
