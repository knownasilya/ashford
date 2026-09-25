import { readFileSync } from 'node:fs';
import { basename, dirname, resolve } from 'node:path';
import { Compiler, CompilerOptions, JsonFileHandler } from 'inkjs/full';
import { defineConfig, type Plugin } from 'vite';

/**
 * Compiles an imported .ink file (and every file it INCLUDEs) to ink JSON.
 * Ink errors show in the terminal and the browser overlay, with file and line.
 */
function ink(): Plugin {
  return {
    name: 'ink',
    transform(_code, id) {
      if (!id.endsWith('.ink')) return;
      const dir = dirname(id);
      const files: Record<string, string> = {};
      const collect = (name: string) => {
        if (name in files) return;
        const path = resolve(dir, name);
        files[name] = readFileSync(path, 'utf8');
        this.addWatchFile(path);
        for (const m of files[name].matchAll(/^\s*INCLUDE\s+(.+?)\s*$/gm)) collect(m[1]);
      };
      const main = basename(id);
      collect(main);

      const errors: string[] = [];
      const onMessage = (message: string, type: number) => {
        if (type === 2) errors.push(message); // ErrorType.Error
        else this.warn(message);
      };
      const options = new CompilerOptions(main, [], false, onMessage, new JsonFileHandler(files));
      const story = new Compiler(files[main], options).Compile();
      if (errors.length || !story) this.error(`Ink compile failed:\n${errors.join('\n')}`);
      return { code: `export default ${JSON.stringify(story.ToJson())};`, map: null };
    },
  };
}

// Relative asset paths, so the build works under any sub-path (GitHub Pages: /ashford/).
export default defineConfig({ base: './', plugins: [ink()] });
