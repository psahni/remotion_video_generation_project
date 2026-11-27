export const createCaptionCues = (alignedWords, fps, maxWords = 6) => {
  if (!Array.isArray(alignedWords) || !Number.isInteger(fps) || fps < 1 || maxWords < 1) {
    throw new Error('Caption timing requires aligned words, a positive FPS, and a positive word limit.');
  }

  const words = alignedWords.map((word) => {
    if (
      typeof word.text !== 'string' ||
      !Number.isFinite(word.start) ||
      !Number.isFinite(word.end) ||
      word.start < 0 ||
      word.end <= word.start
    ) {
      throw new Error('Forced alignment returned an invalid word timing.');
    }

    const startFrame = Math.floor(word.start * fps + 1e-7);
    const endFrame = Math.max(startFrame + 1, Math.ceil(word.end * fps - 1e-7));
    return {
      text: word.text,
      startFrame,
      durationInFrames: endFrame - startFrame,
    };
  }).filter((word) => word.text.trim());

  const cues = [];
  for (let start = 0; start < words.length;) {
    let end = Math.min(start + maxWords, words.length);
    if (end < words.length) {
      for (let index = end - 1; index >= start + 2; index -= 1) {
        if (/[.!?;:]$/.test(words[index].text)) {
          end = index + 1;
          break;
        }
      }
    }

    const cueWords = words.slice(start, end);
    const cueStart = cueWords[0].startFrame;
    const cueEnd = cueWords.at(-1).startFrame + cueWords.at(-1).durationInFrames;
    cues.push({
      startFrame: cueStart,
      durationInFrames: cueEnd - cueStart,
      text: cueWords.map((word) => word.text).join(' ').replace(/\s+([,.;:!?])/g, '$1'),
      words: cueWords,
    });
    start = end;
  }

  return cues;
};
