type CompactAdvisorAnswerOptions = {
  maxSentences?: number;
  maxCharacters?: number;
};

const DEFAULT_MAX_SENTENCES = 3;
const DEFAULT_MAX_CHARACTERS = 260;

function getCharacterLength(value: string) {
  return Array.from(value).length;
}

function normalizeLines(value: string) {
  return value
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function splitSentences(value: string) {
  const sentences: string[] = [];

  for (const line of normalizeLines(value)) {
    const matches = line.match(/[^。！？!?]+[。！？!?]+|[^。！？!?]+$/gu);
    sentences.push(...(matches || [line]).map((item) => item.trim()).filter(Boolean));
  }

  return sentences;
}

function truncateByCharacters(value: string, maxCharacters: number) {
  if (maxCharacters <= 0) return "";
  if (getCharacterLength(value) <= maxCharacters) return value;

  const clipped = Array.from(value)
    .slice(0, maxCharacters)
    .join("")
    .replace(/[、,，:：\s]+$/u, "")
    .trim();
  const lastSentenceEnd = Math.max(
    clipped.lastIndexOf("。"),
    clipped.lastIndexOf("！"),
    clipped.lastIndexOf("？"),
    clipped.lastIndexOf("!"),
    clipped.lastIndexOf("?"),
  );

  if (lastSentenceEnd >= Math.floor(maxCharacters * 0.55)) {
    return clipped.slice(0, lastSentenceEnd + 1).trim();
  }

  if (
    clipped.endsWith("。") ||
    clipped.endsWith("！") ||
    clipped.endsWith("？") ||
    clipped.endsWith("!") ||
    clipped.endsWith("?")
  ) {
    return clipped;
  }

  if (maxCharacters <= 1) return clipped;

  const clippedWithPunctuation = Array.from(clipped)
    .slice(0, maxCharacters - 1)
    .join("")
    .replace(/[、,，:：\s]+$/u, "")
    .trim();

  return `${clippedWithPunctuation}。`;
}

export function compactAdvisorAnswer(answer: string, options: CompactAdvisorAnswerOptions = {}) {
  const maxSentences = Math.max(0, Math.floor(options.maxSentences ?? DEFAULT_MAX_SENTENCES));
  const maxCharacters = Math.max(0, Math.floor(options.maxCharacters ?? DEFAULT_MAX_CHARACTERS));
  const sentences = splitSentences(answer).slice(0, maxSentences);
  const compacted = sentences.join("\n").trim();

  if (!compacted) return "";

  return truncateByCharacters(compacted, maxCharacters);
}
