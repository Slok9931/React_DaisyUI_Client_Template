export interface TypographyVariant {
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  fontFamily?: string;
  letterSpacing?: string;
  wordSpacing?: string;
  textTransform?: string;
}

export interface TypographyConfig {
  h1: TypographyVariant;
  h2: TypographyVariant;
  h3: TypographyVariant;
  h4: TypographyVariant;
  h5: TypographyVariant;
  h6: TypographyVariant;
  body1: TypographyVariant;
  body2: TypographyVariant;
  caption: TypographyVariant;
  div: TypographyVariant;
  span: TypographyVariant;
}

export interface TypographyCustomization {
  fontFamily: string;
  fontScale: number; // 0.5 to 2.0
  fontWeightScale: number; // 0.5 to 1.5
  lineHeightScale: number; // 0.8 to 1.8
  letterSpacing: number; // -0.05 to 0.1
  wordSpacing: number; // -0.1 to 0.5
}