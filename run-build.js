// Wrapper script to run commands from within the correct directory
// Fixes path resolution issues with [SALE] brackets in folder name
const { execSync } = require('child_process')
const path = require('path')

const WEB_DIR = __dirname
process.chdir(WEB_DIR)

const cmd = process.argv[2] || 'build'
const arg = process.argv.slice(3).join(' ')

try {
  switch (cmd) {
    case 'install':
      console.log('[wrapper] pnpm install in:', WEB_DIR)
      execSync('pnpm install', { stdio: 'inherit', cwd: WEB_DIR })
      break
    case 'build':
      console.log('[wrapper] next build in:', WEB_DIR)
      execSync('node node_modules/next/dist/bin/next build', { stdio: 'inherit', cwd: WEB_DIR })
      break
    case 'dev':
      console.log('[wrapper] next dev in:', WEB_DIR)
      execSync('node node_modules/next/dist/bin/next dev', { stdio: 'inherit', cwd: WEB_DIR })
      break
    case 'test':
      console.log('[wrapper] vitest in:', WEB_DIR)
      execSync('node node_modules/vitest/vitest.mjs run', { stdio: 'inherit', cwd: WEB_DIR })
      break
    case 'test:watch':
      console.log('[wrapper] vitest watch in:', WEB_DIR)
      execSync('node node_modules/vitest/vitest.mjs', { stdio: 'inherit', cwd: WEB_DIR })
      break
    case 'type-check':
      console.log('[wrapper] tsc --noEmit in:', WEB_DIR)
      execSync('node node_modules/typescript/bin/tsc --noEmit', { stdio: 'inherit', cwd: WEB_DIR })
      break
    case 'lint':
      console.log('[wrapper] next lint in:', WEB_DIR)
      execSync('node node_modules/next/dist/bin/next lint', { stdio: 'inherit', cwd: WEB_DIR })
      break
    case 'exec':
      if (!arg) {
        console.error('[wrapper] exec requires a command argument')
        process.exit(1)
      }
      console.log('[wrapper] exec:', arg, 'in:', WEB_DIR)
      execSync(arg, { stdio: 'inherit', cwd: WEB_DIR })
      break
    default:
      console.error('[wrapper] Unknown command:', cmd)
      console.error('Available: install, build, dev, test, test:watch, type-check, lint, exec "<cmd>"')
      process.exit(1)
  }
} catch (e) {
  process.exit(e.status || 1)
}
