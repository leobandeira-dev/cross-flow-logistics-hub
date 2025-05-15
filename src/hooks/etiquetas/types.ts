
export type GenerationOptions = {
  tipo?: string;
  altura?: number;
  largura?: number;
  comprimento?: number;
  peso?: number;
  fragil?: boolean;
  unidade?: string;
};

export type PrintOptions = {
  layout: LayoutStyle;
  copies: number;
  printer?: string;
};

export enum LayoutStyle {
  MINIMAL = 'minimal',
  STANDARD = 'standard',
  DETAILED = 'detailed',
  THERMAL_SMALL = 'thermal_small',
  THERMAL_MEDIUM = 'thermal_medium',
  CUSTOM = 'custom'
}
