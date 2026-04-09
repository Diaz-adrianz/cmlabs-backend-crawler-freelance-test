import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

export const toSlug = (str: string) => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const capitalize = (str: string = '') => {
  return str
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const obscureMiddle = (str: string = '') => {
  if (str.trim().length === 0) return str;
  if (str.length <= 3) return str;

  const start = str.slice(0, 2);
  const end = str.slice(-1);
  const middle = str
    .slice(2, -1)
    .split('')
    .map((ch) => (ch === ' ' ? ch : '*'))
    .join('');

  return `${start}${middle}${end}`;
};

export const generateId = () => crypto.randomUUID();

export const sha256 = (s: string) =>
  crypto.createHash('sha256').update(s, 'utf8').digest('hex');

export const generateUUID = () => uuidv4();

export const cleanUrl = (url: string, maxLength = 120): string => {
  return url
    .replace(/^https?:\/\//, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, maxLength)
    .toLowerCase();
};
