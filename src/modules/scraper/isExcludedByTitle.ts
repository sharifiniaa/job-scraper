export function isExcludedByTitle(title: string): boolean {
  const keywords = ['junior', 'no visa sponsorship'];
  for (const keyword of keywords) {
    if (title.includes(keyword)) {
      return false;
    }
  }
  return true;
}