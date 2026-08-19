export interface RecoveredFile {
  index: number;
  filename: string;
  sizeBytes: number;
  blockCount: number;
  data: Uint8Array;
}

export function carveJpegFiles(rawBuffer: Uint8Array, blockSize: number = 512): RecoveredFile[] {
  const recovered: RecoveredFile[] = [];
  let currentFileBlocks: Uint8Array[] = [];
  let fileIndex = 0;

  for (let offset = 0; offset + blockSize <= rawBuffer.length; offset += blockSize) {
    const block = rawBuffer.subarray(offset, offset + blockSize);

    // JPEG header: 0xff 0xd8 0xff followed by 0xe0..0xef
    const isJpegHeader =
      block[0] === 0xff &&
      block[1] === 0xd8 &&
      block[2] === 0xff &&
      (block[3] & 0xf0) === 0xe0;

    if (isJpegHeader) {
      if (currentFileBlocks.length > 0) {
        const totalLen = currentFileBlocks.reduce((acc, b) => acc + b.length, 0);
        const merged = new Uint8Array(totalLen);
        let cursor = 0;
        for (const b of currentFileBlocks) {
          merged.set(b, cursor);
          cursor += b.length;
        }

        const paddedIdx = String(fileIndex).padStart(3, '0');
        recovered.push({
          index: fileIndex,
          filename: `${paddedIdx}.jpg`,
          sizeBytes: totalLen,
          blockCount: currentFileBlocks.length,
          data: merged
        });
        fileIndex++;
        currentFileBlocks = [];
      }
      currentFileBlocks.push(new Uint8Array(block));
    } else if (currentFileBlocks.length > 0) {
      currentFileBlocks.push(new Uint8Array(block));
    }
  }

  if (currentFileBlocks.length > 0) {
    const totalLen = currentFileBlocks.reduce((acc, b) => acc + b.length, 0);
    const merged = new Uint8Array(totalLen);
    let cursor = 0;
    for (const b of currentFileBlocks) {
      merged.set(b, cursor);
      cursor += b.length;
    }
    const paddedIdx = String(fileIndex).padStart(3, '0');
    recovered.push({
      index: fileIndex,
      filename: `${paddedIdx}.jpg`,
      sizeBytes: totalLen,
      blockCount: currentFileBlocks.length,
      data: merged
    });
  }

  return recovered;
}
