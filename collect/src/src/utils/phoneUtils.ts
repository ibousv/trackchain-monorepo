/**
 * Utilitaires pour la gestion des numéros de téléphone
 */

/**
 * Formate un numéro de téléphone français
 * @param phone - Le numéro de téléphone brut
 * @returns Le numéro formaté (XX XX XX XX XX)
 */
export const formatPhoneNumber = (phone: string): string => {
  // Supprimer tous les caractères non numériques sauf le +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Si le numéro commence par +33, on le remplace par 0
  let normalizedPhone = cleaned;
  if (cleaned.startsWith('+33')) {
    normalizedPhone = '0' + cleaned.substring(3);
  }
  
  // Formater le numéro français (10 chiffres)
  if (normalizedPhone.length === 10 && normalizedPhone.startsWith('0')) {
    return normalizedPhone.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
  }
  
  // Retourner le numéro tel quel si pas de format reconnu
  return phone;
};

/**
 * Valide un numéro de téléphone français
 * @param phone - Le numéro de téléphone à valider
 * @returns true si le numéro est valide
 */
export const validatePhoneNumber = (phone: string): boolean => {
  // Supprimer tous les espaces et caractères non numériques sauf le +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Formats acceptés :
  // - 0XXXXXXXXX (10 chiffres, commence par 0, deuxième chiffre entre 1-9)
  // - +33XXXXXXXXX (12 caractères, commence par +33, puis 9 chiffres commençant par 1-9)
  const frenchMobileRegex = /^(0[1-9]\d{8}|\+33[1-9]\d{8})$/;
  
  return frenchMobileRegex.test(cleaned);
};

/**
 * Normalise un numéro de téléphone pour le stockage
 * @param phone - Le numéro de téléphone à normaliser
 * @returns Le numéro normalisé (format +33XXXXXXXXX)
 */
export const normalizePhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Si le numéro commence par 0, remplacer par +33
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    return '+33' + cleaned.substring(1);
  }
  
  // Si déjà au format international, retourner tel quel
  if (cleaned.startsWith('+33') && cleaned.length === 12) {
    return cleaned;
  }
  
  return phone; // Retourner tel quel si format non reconnu
};

/**
 * Formater un numéro pour l'affichage
 * @param phone - Le numéro de téléphone stocké
 * @returns Le numéro formaté pour l'affichage
 */
export const displayPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Convertir le format international en format local pour l'affichage
  if (cleaned.startsWith('+33') && cleaned.length === 12) {
    const localNumber = '0' + cleaned.substring(3);
    return formatPhoneNumber(localNumber);
  }
  
  return formatPhoneNumber(phone);
};