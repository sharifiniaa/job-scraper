import {capitalizedString} from './delay';

export function companyLogoMapper(location: string) {
  const countryLogo = {
    netherlands: '🇳🇱',
    'united kingdom': '🇬🇧',
    finland: '🇫🇮',
    sweden: '🇸🇪',
    france: '🇫🇷',
    denmark: '🇦🇹',
  };
  const country = location.toLocaleLowerCase().split(',');
  const countryName = country[country.length - 1];
  const logo = countryLogo[countryName.trim() as keyof typeof countryLogo] ?? '🏳️';
  return `${logo} ${capitalizedString(countryName.trim())}`;
}
