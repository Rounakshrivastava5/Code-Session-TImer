const esbuild = require('esbuild');

const isProduction = process.argv.includes('--production');
const isWatch = process.argv.includes('--watch');

async function main() {
  const context = await esbuild.context({
    entryPoints: ['src/extension.ts'],
    bundle: true,
    format: 'cjs',
    minify: isProduction,
    sourcemap: !isProduction,
    sourcesContent: false,
    platform: 'node',
    outfile: 'dist/extension.js',
    external: ['vscode'],
    logLevel: 'error',
    plugins: [],
  });

  if (isWatch) {
    await context.watch();
    console.log('[watch] build finished, watching for changes...');
  } else {
    await context.rebuild();
    await context.dispose();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
