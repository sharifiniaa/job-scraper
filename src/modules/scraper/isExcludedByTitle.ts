export function isExcludedByTitle(title: string): boolean {
  // const keywords = ['junior', 'no visa sponsorship', 'no visasponsorship', 'no visa', 'entry level', 'remote'];
  const keywords = (process.env.TITLE_FILTER_KEYWORDS as string).split(',').map(el => el.trim());
  return !keywords.some(keyword => title.includes(keyword));
}
