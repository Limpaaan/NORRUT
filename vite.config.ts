import {defineConfig} from 'vite';
import {readFileSync} from 'node:fs';
const metadata=JSON.parse(readFileSync(new URL('./package.json',import.meta.url),'utf8'));
export default defineConfig({base:'./',define:{__BUILD_VERSION__:JSON.stringify(metadata.version)}});
