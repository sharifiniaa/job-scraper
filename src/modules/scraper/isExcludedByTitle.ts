export function isExcludedByTitle(title: string): boolean {
  const keywords = ['junior', 'no visa sponsorship', 'no visasponsorship', 'no visa', 'entry level', 'remote'];
  return !keywords.some(keyword => title.includes(keyword));
}
