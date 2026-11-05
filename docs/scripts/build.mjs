import { spawn } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const vitepressBin = resolve(scriptDir, '../node_modules/.bin/vitepress');

let buildComplete = false;
let outputBuffer = '';
let terminateTimer;
let forceKillTimer;

const child = spawn(vitepressBin, ['build'], {
  stdio: ['ignore', 'pipe', 'pipe'],
  env: process.env,
});

const markBuildComplete = () => {
  if (buildComplete) {
    return;
  }

  buildComplete = true;
  terminateTimer = setTimeout(() => {
    if (!child.killed) {
      child.kill('SIGTERM');
      forceKillTimer = setTimeout(() => {
        if (!child.killed) {
          child.kill('SIGKILL');
        }
      }, 2000);
    }
  }, 1000);
};

const relayOutput = (chunk, writer) => {
  const text = chunk.toString();
  writer.write(text);

  outputBuffer = `${outputBuffer}${text}`.slice(-512);
  if (outputBuffer.includes('build complete in')) {
    markBuildComplete();
  }
};

child.stdout.on('data', (chunk) => relayOutput(chunk, process.stdout));
child.stderr.on('data', (chunk) => relayOutput(chunk, process.stderr));

child.on('error', (error) => {
  console.error(error);
  process.exit(1);
});

child.on('exit', (code) => {
  if (terminateTimer) {
    clearTimeout(terminateTimer);
  }
  if (forceKillTimer) {
    clearTimeout(forceKillTimer);
  }

  process.exit(buildComplete ? 0 : (code ?? 1));
});
