import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
  format: string;
  placeholder: string;
  maxLength: number;
}

export const countries: Country[] = [
  {
    code: 'SN',
    name: 'Sénégal',
    dialCode: '+221',
    flag: '🇸🇳',
    format: 'XX XXX XX XX',
    placeholder: '77 123 45 67',
    maxLength: 12
  },
  {
    code: 'CI',
    name: 'Côte d\'Ivoire',
    dialCode: '+225',
    flag: '🇨🇮',
    format: 'XX XX XX XX XX',
    placeholder: '07 12 34 56 78',
    maxLength: 14
  },
  {
    code: 'BF',
    name: 'Burkina Faso',
    dialCode: '+226',
    flag: '🇧🇫',
    format: 'XX XX XX XX',
    placeholder: '70 12 34 56',
    maxLength: 11
  },
  {
    code: 'ML',
    name: 'Mali',
    dialCode: '+223',
    flag: '🇲🇱',
    format: 'XX XX XX XX',
    placeholder: '70 12 34 56',
    maxLength: 11
  },
  {
    code: 'NE',
    name: 'Niger',
    dialCode: '+227',
    flag: '🇳🇪',
    format: 'XX XX XX XX',
    placeholder: '90 12 34 56',
    maxLength: 11
  },
  {
    code: 'TG',
    name: 'Togo',
    dialCode: '+228',
    flag: '🇹🇬',
    format: 'XX XX XX XX',
    placeholder: '90 12 34 56',
    maxLength: 11
  },
  {
    code: 'BJ',
    name: 'Bénin',
    dialCode: '+229',
    flag: '🇧🇯',
    format: 'XX XX XX XX',
    placeholder: '90 12 34 56',
    maxLength: 11
  },
  {
    code: 'GN',
    name: 'Guinée',
    dialCode: '+224',
    flag: '🇬🇳',
    format: 'XXX XX XX XX',
    placeholder: '622 12 34 56',
    maxLength: 12
  },
  {
    code: 'MR',
    name: 'Mauritanie',
    dialCode: '+222',
    flag: '🇲🇷',
    format: 'XX XX XX XX',
    placeholder: '22 12 34 56',
    maxLength: 11
  },
  {
    code: 'GM',
    name: 'Gambie',
    dialCode: '+220',
    flag: '🇬🇲',
    format: 'XXX XXXX',
    placeholder: '301 2345',
    maxLength: 8
  },
  {
    code: 'GW',
    name: 'Guinée-Bissau',
    dialCode: '+245',
    flag: '🇬🇼',
    format: 'XXX XXXX',
    placeholder: '955 1234',
    maxLength: 8
  },
  {
    code: 'CV',
    name: 'Cap-Vert',
    dialCode: '+238',
    flag: '🇨🇻',
    format: 'XXX XX XX',
    placeholder: '991 12 34',
    maxLength: 9
  },
  {
    code: 'SL',
    name: 'Sierra Leone',
    dialCode: '+232',
    flag: '🇸🇱',
    format: 'XX XXX XXX',
    placeholder: '76 123 456',
    maxLength: 10
  },
  {
    code: 'LR',
    name: 'Liberia',
    dialCode: '+231',
    flag: '🇱🇷',
    format: 'XX XXX XXXX',
    placeholder: '77 123 4567',
    maxLength: 11
  },
  {
    code: 'FR',
    name: 'France',
    dialCode: '+33',
    flag: '🇫🇷',
    format: 'XX XX XX XX XX',
    placeholder: '06 12 34 56 78',
    maxLength: 14
  },
  {
    code: 'MA',
    name: 'Maroc',
    dialCode: '+212',
    flag: '🇲🇦',
    format: 'XXX XX XX XX',
    placeholder: '612 34 56 78',
    maxLength: 12
  },
  {
    code: 'DZ',
    name: 'Algérie',
    dialCode: '+213',
    flag: '🇩🇿',
    format: 'XXX XX XX XX',
    placeholder: '551 23 45 67',
    maxLength: 12
  },
  {
    code: 'TN',
    name: 'Tunisie',
    dialCode: '+216',
    flag: '🇹🇳',
    format: 'XX XXX XXX',
    placeholder: '20 123 456',
    maxLength: 10
  }
];

interface CountrySelectorProps {
  selectedCountry: Country;
  onCountryChange: (country: Country) => void;
  className?: string;
}

export default function CountrySelector({ selectedCountry, onCountryChange, className }: CountrySelectorProps) {
  return (
    <Select 
      value={selectedCountry.code} 
      onValueChange={(code) => {
        const country = countries.find(c => c.code === code);
        if (country) {
          onCountryChange(country);
        }
      }}
    >
      <SelectTrigger className={`w-full border-black/20 focus:border-black ${className}`}>
        <SelectValue>
          <div className="flex items-center gap-2">
            <span className="text-lg">{selectedCountry.flag}</span>
            <span className="text-sm font-medium">{selectedCountry.dialCode}</span>
            <span className="text-sm text-black/60">{selectedCountry.name}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-60">
        {countries.map((country) => (
          <SelectItem key={country.code} value={country.code}>
            <div className="flex items-center gap-2 w-full">
              <span className="text-lg">{country.flag}</span>
              <span className="text-sm font-medium min-w-12">{country.dialCode}</span>
              <span className="text-sm">{country.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// Fonction helper pour obtenir le pays par défaut (Sénégal)
export const getDefaultCountry = (): Country => {
  return countries.find(c => c.code === 'SN') || countries[0];
};