export function isExcludedByTitle(title: string): boolean {
  const keywords = ['junior', 'no visa sponsorship', 'no visasponsorship'];
  for (const keyword of keywords) {
    if (title.includes(keyword)) {
      return false;
    }
  }
  return true;
}
