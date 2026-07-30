import { readdir, readFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";

const ENTRY_MAX_BYTES = 194_853;
const ENTRY_MAX_GZIP_BYTES = 61_373;
const assetDirectory = new URL("../dist/assets/", import.meta.url);
const entryFiles = (await readdir(assetDirectory))
  .filter((file) => /^index-[A-Za-z0-9_-]+\.js$/.test(file));

if (entryFiles.length !== 1) {
  throw new Error(
    `Očekáván právě jeden vstupní index chunk, nalezeno ${entryFiles.length}: ${entryFiles.join(", ")}`,
  );
}

const entryFile = entryFiles[0];
const contents = await readFile(new URL(entryFile, assetDirectory));
const rawBytes = contents.byteLength;
const gzipBytes = gzipSync(contents, { level: 9 }).byteLength;

if (rawBytes > ENTRY_MAX_BYTES || gzipBytes > ENTRY_MAX_GZIP_BYTES) {
  throw new Error(
    `${entryFile}: ${rawBytes} B / ${gzipBytes} B gzip překračuje limit `
    + `${ENTRY_MAX_BYTES} B / ${ENTRY_MAX_GZIP_BYTES} B gzip.`,
  );
}

process.stdout.write(
  `Vstupní chunk ${entryFile}: ${rawBytes} B / ${gzipBytes} B gzip `
  + `(limit ${ENTRY_MAX_BYTES} B / ${ENTRY_MAX_GZIP_BYTES} B gzip).\n`,
);
