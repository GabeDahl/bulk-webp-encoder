/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import { ImageFile } from 'models/ImageFile';
import { BasicOptions } from 'models/Options';
import { app } from 'electron';
import { spawn } from 'child_process';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export function getBinariesFolder() {
  switch (process.platform) {
    case 'win32':
      return 'windows-x64';
    case 'linux':
      if (process.arch === 'x64') {
        return 'linux-x86_64';
      } else if (process.arch === 'arm64') {
        return 'linux-aarch64';
      }
      break;
    case 'darwin':
      if (process.arch === 'x64') {
        return 'mac-x86_64';
      } else if (process.arch === 'arm64') {
        return 'mac-arm64';
      }
      break;
    default:
      throw new Error(`Unsupported platform: ${process.platform}`);
  }
}

export function encodeFiles(
  files: ImageFile[],
  options: BasicOptions,
  statusUpdateListener: (
    filePath: string,
    status: 'succeeded' | 'failed'
  ) => void,
  allJobsCompletedCallback: () => void
) {
  const folder = getBinariesFolder();
  if (!folder) return;

  const completedJobs: Set<string> = new Set();
  let allJobsCompleted = false;

  const checkAllJobsCompleted = () => {
    if (!allJobsCompleted && completedJobs.size === files.length) {
      allJobsCompleted = true;
      allJobsCompletedCallback();
    }
  };

  const executable = path.join(
    app.isPackaged ? path.dirname(process.execPath) : app.getAppPath(),
    'binaries',
    folder,
    'cwebp'
  );

  files.forEach((file) => {
    let outputName = replaceExtensionWithWebP(file.path);
    if (options.destinationFolder) {
      const basename = path.basename(file.path);
      outputName = path.join(
        options.destinationFolder,
        replaceExtensionWithWebP(basename)
      );
    }
    const args: string[] = generateArgs(options);
    try {
      const job = spawn(executable, [...args, file.path, '-o', outputName]);
      job.on('close', (code) => {
        if (code === 0) {
          // The job succeeded
          statusUpdateListener && statusUpdateListener(file.path, 'succeeded');
          completedJobs.add(file.path);
          checkAllJobsCompleted();
        } else {
          // The job failed
          statusUpdateListener && statusUpdateListener(file.path, 'failed');
          completedJobs.add(file.path);
          checkAllJobsCompleted();
        }
      });
    } catch (e) {
      statusUpdateListener && statusUpdateListener(file.path, 'failed');
      completedJobs.add(file.path);
      checkAllJobsCompleted();
    }
  });
}

function replaceExtensionWithWebP(fileName: string): string {
  const lastDotIndex = fileName.lastIndexOf('.');
  return fileName.substring(0, lastDotIndex) + '.webp';
}

function generateArgs(options: BasicOptions): string[] {
  const args: string[] = [];

  const addOption = (key: string, value: any) => {
    if (value) {
      args.push(`-${key}`);
      args.push(`${value}`);
    }
  };
  addOption('q', options.q);
  addOption('lossless', options.lossless);
  addOption('near_lossless', options.near_lossless);
  addOption('alpha_q', options.alpha_q);
  addOption('m', options.m);
  addOption('mt', options.mt);
  addOption('low_memory', options.low_memory);

  return args;
}
