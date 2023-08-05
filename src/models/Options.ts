export interface CropOptions {
  enabled: boolean;
  x_position: number | null;
  y_position: number | null;
  width: number | null;
  height: number | null;
}

export interface ResizeOptions {
  enabled: boolean;
  width: number | null;
  height: number | null;
}
export type Preset =
  | 'none'
  | 'default'
  | 'photo'
  | 'picture'
  | 'drawing'
  | 'icon'
  | 'text';
export const PRESETS: Preset[] = [
  'none',
  'default',
  'photo',
  'picture',
  'drawing',
  'icon',
  'text',
];

export type NumericBasicOptionKey = 'q' | 'near_lossless' | 'alpha_q' | 'm';
// | 'z';
export type BooleanBasicOptionKey = 'lossless' | 'mt' | 'low_memory';
interface Option {
  displayName: string;
  description: string;
}
export interface BooleanBasicOption extends Option {
  key: BooleanBasicOptionKey;
}
export interface NumericalBasicOption extends Option {
  key: NumericBasicOptionKey;
  inputType: 'textField' | 'slider';
  min?: number;
  max?: number;
  marks?: boolean;
}
export interface BasicOptions {
  destinationFolder: string | null;
  q: number;
  preset: Preset;
  lossless: boolean;
  near_lossless: number;
  // z: number | null;
  alpha_q: number;
  m: number;
  mt: boolean;
  low_memory: boolean;
}

export interface LossyOptions {
  size: number | null;
  psnr: number | null;
  pass: number | null;
  af: boolean;
  jpeg_like: boolean;
}
export interface AdvancedLossyOptions {
  f: number | null;
  sharpness: number | null;
  strong: boolean;
  nostrong: boolean;
  sns: number | null;
  segments: number | null;
  partition_limit: number | null;
}
