import type { Format, Position } from './types.js';

export const FORMAT: Record<string, Format> = {
  NUMERIC: 'numeric',
  TWO_DIGIT: '2-digit',
};

export const POSITION: Record<string, Position> = {
  PRE: 'pre',
  POST: 'post',
};
