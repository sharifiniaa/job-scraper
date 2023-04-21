export function cleanedText(text: string) {
  return text.replace(/(\r\n|\n|\r)/gm, '');
}
