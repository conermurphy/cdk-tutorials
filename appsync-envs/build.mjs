import { build } from 'esbuild';
import { glob } from 'glob';

const files = await glob('graphql/resolvers/ts/**/*.ts');

await build({
  sourcemap: 'inline',
  sourcesContent: false,
  format: 'esm',
  target: 'esnext',
  platform: 'node',
  external: ['@aws-appsync/utils'],
  outdir: 'graphql/resolvers/js',
  entryPoints: files,
  bundle: true,
});
