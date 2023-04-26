export function companyLogoMapper(location: string) {
  const countryLogo = {
    Netherlands: '🇳🇱',
    'united kingdom': '🇬🇧',
    finland: '🇫🇮',
    sweden: '🇸🇪',
    france: '🇫🇷',
    denmark: '🇦🇹',
  };
  const country = location.toLocaleLowerCase().split(',');
  const countryName = country[country.length - 1];
  const logo = countryLogo[countryName.trim() as keyof typeof countryLogo] ?? '🏳️';
  return `${logo} ${countryName}`;
}
