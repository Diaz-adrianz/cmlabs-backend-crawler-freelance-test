import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

export function getArg(name: string, defaultValue: string): string {
  const arg = process.argv.find((a) => a.startsWith(`--${name}=`));
  if (!arg) return defaultValue;

  return arg.split('=')[1] ?? defaultValue;
}

export function writeToData(
  subdir: string,
  filename: string,
  content: string
): string {
  const dir = join(process.cwd(), 'data', subdir);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  filename = `${Date.now()}-${filename}`;
  const filepath = join(dir, filename);

  writeFileSync(filepath, content, 'utf-8');
  return filepath;
}
