import { build } from 'esbuild';
import { glob } from 'glob';

const files = await glob('graphql/ts-resolvers/**/*.ts');

await build({
  sourcemap: 'inline',
  sourcesContent: false,
  format: 'esm',
  target: 'esnext',
  platform: 'node',
  external: ['@aws-appsync/utils'],
  outdir: 'graphql/js-resolvers',
  entryPoints: files,
  bundle: true,
});
