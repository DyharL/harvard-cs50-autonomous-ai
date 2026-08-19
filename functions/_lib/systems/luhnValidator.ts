export interface CardValidationResult {
  isValid: boolean;
  brand: 'AMEX' | 'MASTERCARD' | 'VISA' | 'INVALID';
  sanitizedNumber: string;
}

export function validateCardNumber(rawNumber: string): CardValidationResult {
  const sanitized = rawNumber.replace(/\D/g, '');
  if (!sanitized || sanitized.length < 13 || sanitized.length > 19) {
    return { isValid: false, brand: 'INVALID', sanitizedNumber: sanitized };
  }

  let sum = 0;
  let shouldDouble = false;

  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  const isValid = sum % 10 === 0;
  if (!isValid) {
    return { isValid: false, brand: 'INVALID', sanitizedNumber: sanitized };
  }

  const len = sanitized.length;
  const prefix2 = parseInt(sanitized.slice(0, 2), 10);
  const prefix1 = sanitized.charAt(0);

  let brand: 'AMEX' | 'MASTERCARD' | 'VISA' | 'INVALID' = 'INVALID';
  if (len === 15 && (prefix2 === 34 || prefix2 === 37)) {
    brand = 'AMEX';
  } else if (len === 16 && prefix2 >= 51 && prefix2 <= 55) {
    brand = 'MASTERCARD';
  } else if ((len === 13 || len === 16 || len === 19) && prefix1 === '4') {
    brand = 'VISA';
  }

  return { isValid: brand !== 'INVALID', brand, sanitizedNumber: sanitized };
}
