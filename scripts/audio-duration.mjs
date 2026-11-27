const bitrates = {
  mpeg1: {
    1: [0, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448],
    2: [0, 32, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384],
    3: [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320],
  },
  mpeg2: {
    1: [0, 32, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 224, 256],
    2: [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160],
    3: [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160],
  },
};

const sampleRates = [44100, 48000, 32000];

const readFrameHeader = (buffer, offset) => {
  if (offset + 4 > buffer.length || buffer[offset] !== 0xff || (buffer[offset + 1] & 0xe0) !== 0xe0) {
    return undefined;
  }

  const versionBits = (buffer[offset + 1] >> 3) & 0x03;
  const layerBits = (buffer[offset + 1] >> 1) & 0x03;
  const bitrateIndex = (buffer[offset + 2] >> 4) & 0x0f;
  const sampleRateIndex = (buffer[offset + 2] >> 2) & 0x03;
  if (versionBits === 1 || layerBits === 0 || bitrateIndex === 0 || bitrateIndex === 15 || sampleRateIndex === 3) {
    return undefined;
  }

  const version = versionBits === 3 ? 'mpeg1' : 'mpeg2';
  const layer = 4 - layerBits;
  const bitrate = bitrates[version][layer][bitrateIndex] * 1000;
  const sampleRate = sampleRates[sampleRateIndex] / (versionBits === 3 ? 1 : versionBits === 2 ? 2 : 4);
  const padding = (buffer[offset + 2] >> 1) & 1;
  const samplesPerFrame = layer === 1 ? 384 : layer === 3 && versionBits !== 3 ? 576 : 1152;
  const frameLength = (layer === 1 ? 12 : layer === 3 && versionBits !== 3 ? 72 : 144) *
    (bitrate / sampleRate) + padding;

  return {frameLength: Math.floor(frameLength * (layer === 1 ? 4 : 1)), sampleRate, samplesPerFrame};
};

const getAudioStart = (buffer) => {
  if (buffer.length >= 10 && buffer.toString('ascii', 0, 3) === 'ID3') {
    const tagSize = (buffer[6] << 21) | (buffer[7] << 14) | (buffer[8] << 7) | buffer[9];
    return 10 + tagSize + ((buffer[5] & 0x10) ? 10 : 0);
  }
  return 0;
};

export const getMp3DurationSeconds = (buffer) => {
  let offset = getAudioStart(buffer);
  while (offset + 4 <= buffer.length && !readFrameHeader(buffer, offset)) {
    offset += 1;
  }

  let duration = 0;
  let frameCount = 0;
  while (offset + 4 <= buffer.length) {
    const header = readFrameHeader(buffer, offset);
    if (!header || offset + header.frameLength > buffer.length) {
      break;
    }
    duration += header.samplesPerFrame / header.sampleRate;
    frameCount += 1;
    offset += header.frameLength;
  }

  if (!frameCount || !Number.isFinite(duration) || duration <= 0) {
    throw new Error('ElevenLabs returned audio that does not contain a valid MP3 stream.');
  }
  return duration;
};
