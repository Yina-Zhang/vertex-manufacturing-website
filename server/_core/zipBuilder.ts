/**
 * Pure Node.js ZIP builder using built-in zlib module.
 * No external dependencies required.
 * Implements ZIP local file header + data descriptor + central directory + end of central directory.
 */
import { deflateRawSync } from "zlib";

interface ZipEntry {
  filename: string;
  content: Buffer;
}

function crc32(buf: Buffer): number {
  const table = makeCrcTable();
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

let _crcTable: number[] | null = null;
function makeCrcTable(): number[] {
  if (_crcTable) return _crcTable;
  _crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    _crcTable[n] = c;
  }
  return _crcTable;
}

function writeUInt32LE(buf: Buffer, val: number, offset: number) {
  buf.writeUInt32LE(val >>> 0, offset);
}

function writeUInt16LE(buf: Buffer, val: number, offset: number) {
  buf.writeUInt16LE(val & 0xffff, offset);
}

/**
 * Build a ZIP buffer from an array of file entries.
 * Uses DEFLATE compression for each file.
 */
export function buildZip(entries: ZipEntry[]): Buffer {
  const localHeaders: Buffer[] = [];
  const centralDirs: Buffer[] = [];
  let offset = 0;

  const now = new Date();
  const dosTime =
    ((now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1)) & 0xffff;
  const dosDate =
    (((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate()) & 0xffff;

  for (const entry of entries) {
    const nameBytes = Buffer.from(entry.filename, "utf8");
    const compressed = deflateRawSync(entry.content, { level: 6 });
    const crc = crc32(entry.content);

    // Local file header (30 bytes + filename)
    const localHeader = Buffer.alloc(30 + nameBytes.length);
    writeUInt32LE(localHeader, 0x04034b50, 0); // signature
    writeUInt16LE(localHeader, 20, 4);          // version needed
    writeUInt16LE(localHeader, 0x0800, 6);      // flags (UTF-8)
    writeUInt16LE(localHeader, 8, 8);           // compression method: DEFLATE
    writeUInt16LE(localHeader, dosTime, 10);
    writeUInt16LE(localHeader, dosDate, 12);
    writeUInt32LE(localHeader, crc, 14);
    writeUInt32LE(localHeader, compressed.length, 18);
    writeUInt32LE(localHeader, entry.content.length, 22);
    writeUInt16LE(localHeader, nameBytes.length, 26);
    writeUInt16LE(localHeader, 0, 28);          // extra field length
    nameBytes.copy(localHeader, 30);

    localHeaders.push(localHeader);
    localHeaders.push(compressed);

    // Central directory header (46 bytes + filename)
    const centralDir = Buffer.alloc(46 + nameBytes.length);
    writeUInt32LE(centralDir, 0x02014b50, 0);   // signature
    writeUInt16LE(centralDir, 20, 4);           // version made by
    writeUInt16LE(centralDir, 20, 6);           // version needed
    writeUInt16LE(centralDir, 0x0800, 8);       // flags (UTF-8)
    writeUInt16LE(centralDir, 8, 10);           // compression method: DEFLATE
    writeUInt16LE(centralDir, dosTime, 12);
    writeUInt16LE(centralDir, dosDate, 14);
    writeUInt32LE(centralDir, crc, 16);
    writeUInt32LE(centralDir, compressed.length, 20);
    writeUInt32LE(centralDir, entry.content.length, 24);
    writeUInt16LE(centralDir, nameBytes.length, 28);
    writeUInt16LE(centralDir, 0, 30);           // extra field length
    writeUInt16LE(centralDir, 0, 32);           // file comment length
    writeUInt16LE(centralDir, 0, 34);           // disk number start
    writeUInt16LE(centralDir, 0, 36);           // internal attributes
    writeUInt32LE(centralDir, 0, 38);           // external attributes
    writeUInt32LE(centralDir, offset, 42);      // relative offset of local header
    nameBytes.copy(centralDir, 46);

    centralDirs.push(centralDir);
    offset += localHeader.length + compressed.length;
  }

  const centralDirBuffer = Buffer.concat(centralDirs);
  const centralDirSize = centralDirBuffer.length;
  const centralDirOffset = offset;

  // End of central directory record (22 bytes)
  const eocd = Buffer.alloc(22);
  writeUInt32LE(eocd, 0x06054b50, 0);           // signature
  writeUInt16LE(eocd, 0, 4);                    // disk number
  writeUInt16LE(eocd, 0, 6);                    // disk with central dir
  writeUInt16LE(eocd, entries.length, 8);        // entries on this disk
  writeUInt16LE(eocd, entries.length, 10);       // total entries
  writeUInt32LE(eocd, centralDirSize, 12);       // size of central dir
  writeUInt32LE(eocd, centralDirOffset, 16);     // offset of central dir
  writeUInt16LE(eocd, 0, 20);                    // comment length

  return Buffer.concat([...localHeaders, centralDirBuffer, eocd]);
}
