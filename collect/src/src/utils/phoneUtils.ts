import { Country, countries } from '../../components/CountrySelector';

/**
 * Utilitaires pour la gestion des numéros de téléphone internationaux
 */

/**
 * Formate un numéro de téléphone selon le pays
 * @param phone - Le numéro de téléphone brut
 * @param country - Le pays sélectionné
 * @returns Le numéro formaté selon le format du pays
 */
export const formatPhoneNumber = (phone: string, country: Country): string => {
  // Supprimer tous les caractères non numériques sauf le +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Si le numéro commence par l'indicatif du pays, le retirer pour formater
  let normalizedPhone = cleaned;
  if (cleaned.startsWith(country.dialCode)) {
    normalizedPhone = cleaned.substring(country.dialCode.length);
  }
  
  // Appliquer le formatage selon le pays
  switch (country.code) {
    case 'SN': // Sénégal - XX XXX XX XX
      if (normalizedPhone.length === 9) {
        return normalizedPhone.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4');
      }
      if (normalizedPhone.length === 8) {
        const fullNumber = '7' + normalizedPhone;
        return fullNumber.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4');
      }
      break;
      
    case 'CI': // Côte d'Ivoire - XX XX XX XX XX
      if (normalizedPhone.length === 10) {
        return normalizedPhone.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
      }
      break;
      
    case 'BF': // Burkina Faso - XX XX XX XX
    case 'ML': // Mali - XX XX XX XX
    case 'NE': // Niger - XX XX XX XX
    case 'TG': // Togo - XX XX XX XX
    case 'BJ': // Bénin - XX XX XX XX
    case 'MR': // Mauritanie - XX XX XX XX
      if (normalizedPhone.length === 8) {
        return normalizedPhone.replace(/(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4');
      }
      break;
      
    case 'GN': // Guinée - XXX XX XX XX
      if (normalizedPhone.length === 9) {
        return normalizedPhone.replace(/(\d{3})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4');
      }
      break;
      
    case 'GM': // Gambie - XXX XXXX
    case 'GW': // Guinée-Bissau - XXX XXXX
      if (normalizedPhone.length === 7) {
        return normalizedPhone.replace(/(\d{3})(\d{4})/, '$1 $2');
      }
      break;
      
    case 'CV': // Cap-Vert - XXX XX XX
      if (normalizedPhone.length === 7) {
        return normalizedPhone.replace(/(\d{3})(\d{2})(\d{2})/, '$1 $2 $3');
      }
      break;
      
    case 'SL': // Sierra Leone - XX XXX XXX
      if (normalizedPhone.length === 8) {
        return normalizedPhone.replace(/(\d{2})(\d{3})(\d{3})/, '$1 $2 $3');
      }
      break;
      
    case 'LR': // Liberia - XX XXX XXXX
      if (normalizedPhone.length === 8) {
        return normalizedPhone.replace(/(\d{2})(\d{3})(\d{4})/, '$1 $2 $3');
      }
      break;
      
    case 'FR': // France - XX XX XX XX XX
      if (normalizedPhone.length === 9) {
        return normalizedPhone.replace(/(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})/, '0$1 $2 $3 $4 $5');
      }
      break;
      
    case 'MA': // Maroc - XXX XX XX XX
    case 'DZ': // Algérie - XXX XX XX XX
      if (normalizedPhone.length === 9) {
        return normalizedPhone.replace(/(\d{3})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4');
      }
      break;
      
    case 'TN': // Tunisie - XX XXX XXX
      if (normalizedPhone.length === 8) {
        return normalizedPhone.replace(/(\d{2})(\d{3})(\d{3})/, '$1 $2 $3');
      }
      break;
  }
  
  // Retourner le numéro tel quel si pas de format reconnu
  return phone;
};

/**
 * Valide un numéro de téléphone selon le pays
 * @param phone - Le numéro de téléphone à valider
 * @param country - Le pays sélectionné
 * @returns true si le numéro est valide
 */
export const validatePhoneNumber = (phone: string, country: Country): boolean => {
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Patterns de validation par pays
  const patterns: Record<string, RegExp> = {
    'SN': /^(\+221)?[7][0-9]{8}$|^[0-9]{8}$/, // Sénégal
    'CI': /^(\+225)?[0-9]{10}$/, // Côte d'Ivoire
    'BF': /^(\+226)?[0-9]{8}$/, // Burkina Faso
    'ML': /^(\+223)?[0-9]{8}$/, // Mali
    'NE': /^(\+227)?[0-9]{8}$/, // Niger
    'TG': /^(\+228)?[0-9]{8}$/, // Togo
    'BJ': /^(\+229)?[0-9]{8}$/, // Bénin
    'GN': /^(\+224)?[0-9]{9}$/, // Guinée
    'MR': /^(\+222)?[0-9]{8}$/, // Mauritanie
    'GM': /^(\+220)?[0-9]{7}$/, // Gambie
    'GW': /^(\+245)?[0-9]{7}$/, // Guinée-Bissau
    'CV': /^(\+238)?[0-9]{7}$/, // Cap-Vert
    'SL': /^(\+232)?[0-9]{8}$/, // Sierra Leone
    'LR': /^(\+231)?[0-9]{8}$/, // Liberia
    'FR': /^(\+33)?[1-9][0-9]{8}$/, // France
    'MA': /^(\+212)?[0-9]{9}$/, // Maroc
    'DZ': /^(\+213)?[0-9]{9}$/, // Algérie
    'TN': /^(\+216)?[0-9]{8}$/, // Tunisie
  };
  
  const pattern = patterns[country.code];
  return pattern ? pattern.test(cleaned) : false;
};

/**
 * Normalise un numéro de téléphone pour le stockage
 * @param phone - Le numéro de téléphone à normaliser
 * @param country - Le pays sélectionné
 * @returns Le numéro normalisé (format international)
 */
export const normalizePhoneNumber = (phone: string, country: Country): string => {
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Si déjà au format international avec le bon indicatif
  if (cleaned.startsWith(country.dialCode)) {
    return cleaned;
  }
  
  // Traitement spécial pour le Sénégal
  if (country.code === 'SN') {
    if (cleaned.length === 8) {
      return country.dialCode + '7' + cleaned;
    }
    if (cleaned.length === 9 && cleaned.startsWith('7')) {
      return country.dialCode + cleaned;
    }
  }
  
  // Traitement pour la France
  if (country.code === 'FR' && cleaned.startsWith('0') && cleaned.length === 10) {
    return country.dialCode + cleaned.substring(1);
  }
  
  // Pour les autres pays, ajouter simplement l'indicatif
  if (!cleaned.startsWith('+')) {
    return country.dialCode + cleaned;
  }
  
  return phone;
};

/**
 * Formater un numéro pour l'affichage
 * @param phone - Le numéro de téléphone stocké
 * @param country - Le pays (optionnel, déduit du numéro si absent)
 * @returns Le numéro formaté pour l'affichage
 */
export const displayPhoneNumber = (phone: string, country?: Country): string => {
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Si pas de pays fourni, essayer de le déduire
  if (!country) {
    for (const c of countries) {
      if (cleaned.startsWith(c.dialCode)) {
        country = c;
        break;
      }
    }
  }
  
  // Si un pays est trouvé, utiliser son formatage
  if (country) {
    return formatPhoneNumber(phone, country);
  }
  
  // Fallback: retourner tel quel
  return phone;
};