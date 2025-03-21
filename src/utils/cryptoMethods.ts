
// Encryption methods
export interface EncryptionMethod {
  id: string;
  name: string;
  description: string;
  encrypt: (message: string, key: string) => Promise<EncryptionResult>;
  decrypt: (ciphertext: string, key: string) => Promise<DecryptionResult>;
  needsKey: boolean;
  keyName: string;
  keyPlaceholder: string;
}

export interface EncryptionStep {
  title: string;
  description: string;
  originalText?: string;
  transformedText?: string;
  highlightIndices?: number[];
  transformIndices?: number[];
  code?: string;
}

export interface EncryptionResult {
  ciphertext: string;
  steps: EncryptionStep[];
}

export interface DecryptionStep {
  title: string;
  description: string;
  originalText?: string;
  transformedText?: string;
  highlightIndices?: number[];
  transformIndices?: number[];
  code?: string;
}

export interface DecryptionResult {
  plaintext: string;
  steps: DecryptionStep[];
}

// Caesar Cipher
const caesarCipher: EncryptionMethod = {
  id: 'caesar',
  name: 'Caesar Cipher',
  description: 'Shifts each letter in the message by a fixed number of positions in the alphabet.',
  needsKey: true,
  keyName: 'Shift Value',
  keyPlaceholder: 'Enter a number (1-25)',
  
  encrypt: async (message: string, key: string) => {
    const shift = parseInt(key, 10) % 26;
    const steps: EncryptionStep[] = [];
    let ciphertext = '';
    
    // Validation step
    steps.push({
      title: 'Input Validation',
      description: `We'll encrypt the message "${message}" using a shift value of ${shift}.`,
    });
    
    // Explanation step
    steps.push({
      title: 'How Caesar Cipher Works',
      description: 'The Caesar cipher shifts each letter in the plaintext by a fixed number of positions in the alphabet. For example, with a shift of 3, A becomes D, B becomes E, and so on.',
    });
    
    // Processing step
    const originalIndices: number[] = [];
    const transformIndices: number[] = [];
    
    for (let i = 0; i < message.length; i++) {
      const char = message[i];
      
      if (/[a-zA-Z]/.test(char)) {
        originalIndices.push(i);
        transformIndices.push(i);
      }
    }
    
    steps.push({
      title: 'Character Shifting',
      description: 'Each letter in the message will be shifted by ' + shift + ' positions:',
      originalText: message,
      highlightIndices: originalIndices,
    });
    
    // Actual encryption
    ciphertext = message.split('').map(char => {
      if (!/[a-zA-Z]/.test(char)) return char;
      
      const code = char.charCodeAt(0);
      const isUpperCase = code >= 65 && code <= 90;
      const base = isUpperCase ? 65 : 97;
      
      return String.fromCharCode(((code - base + shift) % 26) + base);
    }).join('');
    
    steps.push({
      title: 'Final Encryption',
      description: 'After shifting each letter, we get the encrypted message:',
      originalText: message,
      transformedText: ciphertext,
      highlightIndices: originalIndices,
      transformIndices: transformIndices,
    });
    
    // Technical explanation
    steps.push({
      title: 'Technical Details',
      description: 'The Caesar cipher is a substitution cipher where each letter is replaced by another letter a fixed number of positions away in the alphabet. Mathematically, it can be expressed as: C = (P + K) mod 26, where C is the ciphertext letter, P is the plaintext letter, and K is the shift value.',
      code: `function caesarEncrypt(plaintext, shift) {
  return plaintext.split('').map(char => {
    if (!/[a-zA-Z]/.test(char)) return char;
    
    const code = char.charCodeAt(0);
    const isUpperCase = code >= 65 && code <= 90;
    const base = isUpperCase ? 65 : 97;
    
    return String.fromCharCode(((code - base + shift) % 26) + base);
  }).join('');
}`
    });
    
    return { ciphertext, steps };
  },
  
  decrypt: async (ciphertext: string, key: string) => {
    const shift = parseInt(key, 10) % 26;
    const steps: DecryptionStep[] = [];
    
    // Validation step
    steps.push({
      title: 'Input Validation',
      description: `We'll decrypt the ciphertext "${ciphertext}" using a shift value of ${shift}.`,
    });
    
    // Explanation step
    steps.push({
      title: 'How Caesar Decryption Works',
      description: 'To decrypt a Caesar cipher, we shift each letter in the opposite direction by the same shift value. For example, with a shift of 3, D becomes A, E becomes B, and so on.',
    });
    
    // Processing step
    const originalIndices: number[] = [];
    const transformIndices: number[] = [];
    
    for (let i = 0; i < ciphertext.length; i++) {
      const char = ciphertext[i];
      
      if (/[a-zA-Z]/.test(char)) {
        originalIndices.push(i);
        transformIndices.push(i);
      }
    }
    
    steps.push({
      title: 'Character Reverse Shifting',
      description: 'Each letter in the ciphertext will be shifted back by ' + shift + ' positions:',
      originalText: ciphertext,
      highlightIndices: originalIndices,
    });
    
    // Actual decryption
    let plaintext = ciphertext.split('').map(char => {
      if (!/[a-zA-Z]/.test(char)) return char;
      
      const code = char.charCodeAt(0);
      const isUpperCase = code >= 65 && code <= 90;
      const base = isUpperCase ? 65 : 97;
      
      return String.fromCharCode(((code - base - shift + 26) % 26) + base);
    }).join('');
    
    steps.push({
      title: 'Final Decryption',
      description: 'After reverse shifting each letter, we get the original message:',
      originalText: ciphertext,
      transformedText: plaintext,
      highlightIndices: originalIndices,
      transformIndices: transformIndices,
    });
    
    // Technical explanation
    steps.push({
      title: 'Technical Details',
      description: 'The Caesar cipher decryption can be expressed as: P = (C - K + 26) mod 26, where P is the plaintext letter, C is the ciphertext letter, and K is the shift value. We add 26 before taking the modulo to handle negative shifts.',
      code: `function caesarDecrypt(ciphertext, shift) {
  return ciphertext.split('').map(char => {
    if (!/[a-zA-Z]/.test(char)) return char;
    
    const code = char.charCodeAt(0);
    const isUpperCase = code >= 65 && code <= 90;
    const base = isUpperCase ? 65 : 97;
    
    return String.fromCharCode(((code - base - shift + 26) % 26) + base);
  }).join('');
}`
    });
    
    return { plaintext, steps };
  }
};

// Vigenere Cipher
const vigenereCipher: EncryptionMethod = {
  id: 'vigenere',
  name: 'Vigenère Cipher',
  description: 'Uses a keyword to determine multiple shift values for encrypting a message.',
  needsKey: true,
  keyName: 'Keyword',
  keyPlaceholder: 'Enter a keyword (letters only)',
  
  encrypt: async (message: string, key: string) => {
    const steps: EncryptionStep[] = [];
    let ciphertext = '';
    
    // Clean the key (only letters)
    const cleanKey = key.replace(/[^a-zA-Z]/g, '').toUpperCase();
    
    if (!cleanKey) {
      throw new Error('Vigenère cipher requires a keyword with at least one letter.');
    }
    
    // Input validation
    steps.push({
      title: 'Input Validation',
      description: `We'll encrypt the message "${message}" using the keyword "${cleanKey}".`,
    });
    
    // Explanation step
    steps.push({
      title: 'How Vigenère Cipher Works',
      description: 'The Vigenère cipher is a method of encrypting text by using a series of Caesar ciphers based on the letters of a keyword. Each letter in the keyword determines the shift value for a corresponding letter in the plaintext.',
    });
    
    // Key extension step
    let extendedKey = '';
    let keyIndex = 0;
    
    for (let i = 0; i < message.length; i++) {
      if (/[a-zA-Z]/.test(message[i])) {
        extendedKey += cleanKey[keyIndex % cleanKey.length];
        keyIndex++;
      } else {
        extendedKey += ' ';
      }
    }
    
    steps.push({
      title: 'Key Extension',
      description: 'The keyword is repeated to match the length of the message (ignoring non-alphabetic characters):',
      originalText: message,
      transformedText: extendedKey,
    });
    
    // Processing step
    const originalIndices: number[] = [];
    const transformIndices: number[] = [];
    
    for (let i = 0; i < message.length; i++) {
      if (/[a-zA-Z]/.test(message[i])) {
        originalIndices.push(i);
        transformIndices.push(i);
      }
    }
    
    steps.push({
      title: 'Character Shifting',
      description: 'Each letter in the message will be shifted according to the corresponding letter in the extended key:',
      originalText: message,
      highlightIndices: originalIndices,
    });
    
    // Actual encryption
    ciphertext = message.split('').map((char, i) => {
      if (!/[a-zA-Z]/.test(char)) return char;
      
      const isUpperCase = char === char.toUpperCase();
      const plainChar = char.toUpperCase();
      const keyChar = extendedKey[i].toUpperCase();
      
      if (keyChar === ' ') return char;
      
      const plainCode = plainChar.charCodeAt(0) - 65;
      const keyCode = keyChar.charCodeAt(0) - 65;
      const cipherCode = (plainCode + keyCode) % 26;
      
      const cipherChar = String.fromCharCode(cipherCode + 65);
      return isUpperCase ? cipherChar : cipherChar.toLowerCase();
    }).join('');
    
    steps.push({
      title: 'Final Encryption',
      description: 'After applying the Vigenère cipher, we get the encrypted message:',
      originalText: message,
      transformedText: ciphertext,
      highlightIndices: originalIndices,
      transformIndices: transformIndices,
    });
    
    // Technical explanation
    steps.push({
      title: 'Technical Details',
      description: 'The Vigenère cipher can be expressed as: Ci = (Pi + Ki) mod 26, where Ci is the ciphertext letter, Pi is the plaintext letter, and Ki is the corresponding key letter. Each letter is represented by its position in the alphabet (A=0, B=1, etc.).',
      code: `function vigenereEncrypt(plaintext, keyword) {
  const key = keyword.toUpperCase().replace(/[^A-Z]/g, '');
  let result = '';
  let keyIndex = 0;
  
  for (let i = 0; i < plaintext.length; i++) {
    const char = plaintext[i];
    if (!/[a-zA-Z]/.test(char)) {
      result += char;
      continue;
    }
    
    const isUpperCase = char === char.toUpperCase();
    const plainChar = char.toUpperCase();
    const keyChar = key[keyIndex % key.length];
    
    const plainCode = plainChar.charCodeAt(0) - 65;
    const keyCode = keyChar.charCodeAt(0) - 65;
    const cipherCode = (plainCode + keyCode) % 26;
    
    const cipherChar = String.fromCharCode(cipherCode + 65);
    result += isUpperCase ? cipherChar : cipherChar.toLowerCase();
    keyIndex++;
  }
  
  return result;
}`
    });
    
    return { ciphertext, steps };
  },
  
  decrypt: async (ciphertext: string, key: string) => {
    const steps: DecryptionStep[] = [];
    
    // Clean the key (only letters)
    const cleanKey = key.replace(/[^a-zA-Z]/g, '').toUpperCase();
    
    if (!cleanKey) {
      throw new Error('Vigenère cipher requires a keyword with at least one letter.');
    }
    
    // Input validation
    steps.push({
      title: 'Input Validation',
      description: `We'll decrypt the ciphertext "${ciphertext}" using the keyword "${cleanKey}".`,
    });
    
    // Explanation step
    steps.push({
      title: 'How Vigenère Decryption Works',
      description: 'To decrypt the Vigenère cipher, we reverse the shifting process using the same keyword. For each letter in the ciphertext, we shift it back by the value of the corresponding letter in the keyword.',
    });
    
    // Key extension step
    let extendedKey = '';
    let keyIndex = 0;
    
    for (let i = 0; i < ciphertext.length; i++) {
      if (/[a-zA-Z]/.test(ciphertext[i])) {
        extendedKey += cleanKey[keyIndex % cleanKey.length];
        keyIndex++;
      } else {
        extendedKey += ' ';
      }
    }
    
    steps.push({
      title: 'Key Extension',
      description: 'The keyword is repeated to match the length of the ciphertext (ignoring non-alphabetic characters):',
      originalText: ciphertext,
      transformedText: extendedKey,
    });
    
    // Processing step
    const originalIndices: number[] = [];
    const transformIndices: number[] = [];
    
    for (let i = 0; i < ciphertext.length; i++) {
      if (/[a-zA-Z]/.test(ciphertext[i])) {
        originalIndices.push(i);
        transformIndices.push(i);
      }
    }
    
    steps.push({
      title: 'Character Reverse Shifting',
      description: 'Each letter in the ciphertext will be shifted back according to the corresponding letter in the extended key:',
      originalText: ciphertext,
      highlightIndices: originalIndices,
    });
    
    // Actual decryption
    let plaintext = ciphertext.split('').map((char, i) => {
      if (!/[a-zA-Z]/.test(char)) return char;
      
      const isUpperCase = char === char.toUpperCase();
      const cipherChar = char.toUpperCase();
      const keyChar = extendedKey[i].toUpperCase();
      
      if (keyChar === ' ') return char;
      
      const cipherCode = cipherChar.charCodeAt(0) - 65;
      const keyCode = keyChar.charCodeAt(0) - 65;
      const plainCode = (cipherCode - keyCode + 26) % 26;
      
      const plainChar = String.fromCharCode(plainCode + 65);
      return isUpperCase ? plainChar : plainChar.toLowerCase();
    }).join('');
    
    steps.push({
      title: 'Final Decryption',
      description: 'After applying the reverse Vigenère cipher, we get the original message:',
      originalText: ciphertext,
      transformedText: plaintext,
      highlightIndices: originalIndices,
      transformIndices: transformIndices,
    });
    
    // Technical explanation
    steps.push({
      title: 'Technical Details',
      description: 'The Vigenère cipher decryption can be expressed as: Pi = (Ci - Ki + 26) mod 26, where Pi is the plaintext letter, Ci is the ciphertext letter, and Ki is the corresponding key letter. We add 26 before taking the modulo to handle negative results.',
      code: `function vigenereDecrypt(ciphertext, keyword) {
  const key = keyword.toUpperCase().replace(/[^A-Z]/g, '');
  let result = '';
  let keyIndex = 0;
  
  for (let i = 0; i < ciphertext.length; i++) {
    const char = ciphertext[i];
    if (!/[a-zA-Z]/.test(char)) {
      result += char;
      continue;
    }
    
    const isUpperCase = char === char.toUpperCase();
    const cipherChar = char.toUpperCase();
    const keyChar = key[keyIndex % key.length];
    
    const cipherCode = cipherChar.charCodeAt(0) - 65;
    const keyCode = keyChar.charCodeAt(0) - 65;
    const plainCode = (cipherCode - keyCode + 26) % 26;
    
    const plainChar = String.fromCharCode(plainCode + 65);
    result += isUpperCase ? plainChar : plainChar.toLowerCase();
    keyIndex++;
  }
  
  return result;
}`
    });
    
    return { plaintext, steps };
  }
};

// Rail Fence Cipher
const railFenceCipher: EncryptionMethod = {
  id: 'railfence',
  name: 'Rail Fence Cipher',
  description: 'Writes the message in a zigzag pattern across multiple "rails" and then reads off by row.',
  needsKey: true,
  keyName: 'Number of Rails',
  keyPlaceholder: 'Enter a number (2-10)',
  
  encrypt: async (message: string, key: string) => {
    const rails = parseInt(key, 10);
    const steps: EncryptionStep[] = [];
    
    if (isNaN(rails) || rails < 2) {
      throw new Error('Rail Fence cipher requires at least 2 rails.');
    }
    
    // Input validation
    steps.push({
      title: 'Input Validation',
      description: `We'll encrypt the message "${message}" using ${rails} rails.`,
    });
    
    // Explanation step
    steps.push({
      title: 'How Rail Fence Cipher Works',
      description: 'The Rail Fence cipher is a transposition cipher that writes the message in a zigzag pattern across a number of "rails" and then reads off each rail to produce the ciphertext.',
    });
    
    // Create the rail fence pattern
    const fence: string[][] = Array.from({ length: rails }, () => Array(message.length).fill(''));
    let row = 0;
    let direction = 1; // 1 for down, -1 for up
    
    // Populate the fence with the message
    for (let i = 0; i < message.length; i++) {
      fence[row][i] = message[i];
      
      // Change direction when we hit the top or bottom rail
      if (row === 0) {
        direction = 1;
      } else if (row === rails - 1) {
        direction = -1;
      }
      
      row += direction;
    }
    
    // Visualize the rail fence pattern
    let patternVisualization = '';
    for (let i = 0; i < rails; i++) {
      patternVisualization += fence[i].map(char => char || '.').join('') + '\n';
    }
    
    steps.push({
      title: 'Rail Fence Pattern',
      description: 'The message is written in a zigzag pattern across ' + rails + ' rails:',
      code: patternVisualization,
    });
    
    // Read off the ciphertext from the fence
    let ciphertext = '';
    for (let i = 0; i < rails; i++) {
      for (let j = 0; j < message.length; j++) {
        if (fence[i][j]) {
          ciphertext += fence[i][j];
        }
      }
    }
    
    steps.push({
      title: 'Reading the Ciphertext',
      description: 'The ciphertext is read by going across each rail from top to bottom:',
      originalText: message,
      transformedText: ciphertext,
    });
    
    // Technical explanation
    steps.push({
      title: 'Technical Details',
      description: 'The Rail Fence cipher is a form of transposition cipher, where the order of the characters is changed but the characters themselves remain the same. This makes it different from substitution ciphers like Caesar or Vigenère where characters are replaced with different ones.',
      code: `function railFenceEncrypt(text, rails) {
  // Create the rail fence pattern
  const fence = Array.from({ length: rails }, () => Array(text.length).fill(''));
  let row = 0;
  let direction = 1;
  
  // Populate the fence with the message
  for (let i = 0; i < text.length; i++) {
    fence[row][i] = text[i];
    
    // Change direction when we hit the top or bottom rail
    if (row === 0) {
      direction = 1;
    } else if (row === rails - 1) {
      direction = -1;
    }
    
    row += direction;
  }
  
  // Read off the ciphertext
  let result = '';
  for (let i = 0; i < rails; i++) {
    for (let j = 0; j < text.length; j++) {
      if (fence[i][j]) {
        result += fence[i][j];
      }
    }
  }
  
  return result;
}`
    });
    
    return { ciphertext, steps };
  },
  
  decrypt: async (ciphertext: string, key: string) => {
    const rails = parseInt(key, 10);
    const steps: DecryptionStep[] = [];
    
    if (isNaN(rails) || rails < 2) {
      throw new Error('Rail Fence cipher requires at least 2 rails.');
    }
    
    // Input validation
    steps.push({
      title: 'Input Validation',
      description: `We'll decrypt the ciphertext "${ciphertext}" using ${rails} rails.`,
    });
    
    // Explanation step
    steps.push({
      title: 'How Rail Fence Decryption Works',
      description: 'To decrypt a Rail Fence cipher, we need to reconstruct the zigzag pattern and place the ciphertext letters in order on the rails. Then we read the message by traversing the pattern.',
    });
    
    // Create the empty fence
    const fence: string[][] = Array.from({ length: rails }, () => Array(ciphertext.length).fill(''));
    let row = 0;
    let direction = 1;
    
    // Mark the positions where letters will be
    for (let i = 0; i < ciphertext.length; i++) {
      fence[row][i] = '*'; // Placeholder
      
      if (row === 0) {
        direction = 1;
      } else if (row === rails - 1) {
        direction = -1;
      }
      
      row += direction;
    }
    
    // Fill the fence with the ciphertext
    let ciphertextIndex = 0;
    for (let i = 0; i < rails; i++) {
      for (let j = 0; j < ciphertext.length; j++) {
        if (fence[i][j] === '*' && ciphertextIndex < ciphertext.length) {
          fence[i][j] = ciphertext[ciphertextIndex++];
        }
      }
    }
    
    // Visualize the filled fence
    let filledFenceVisualization = '';
    for (let i = 0; i < rails; i++) {
      filledFenceVisualization += fence[i].map(char => char || '.').join('') + '\n';
    }
    
    steps.push({
      title: 'Filled Rail Fence',
      description: 'The ciphertext is distributed across the rails in the zigzag pattern:',
      code: filledFenceVisualization,
    });
    
    // Read the plaintext from the fence
    let plaintext = '';
    row = 0;
    direction = 1;
    
    for (let i = 0; i < ciphertext.length; i++) {
      plaintext += fence[row][i] || '';
      
      if (row === 0) {
        direction = 1;
      } else if (row === rails - 1) {
        direction = -1;
      }
      
      row += direction;
    }
    
    steps.push({
      title: 'Reading the Plaintext',
      description: 'The original message is read by following the zigzag pattern:',
      originalText: ciphertext,
      transformedText: plaintext,
    });
    
    // Technical explanation
    steps.push({
      title: 'Technical Details',
      description: 'Decrypting the Rail Fence cipher requires reversing the encryption process. First, we determine where the characters would appear in the pattern, then we fill these positions with the ciphertext characters in order, and finally read off the message by traversing the pattern.',
      code: `function railFenceDecrypt(ciphertext, rails) {
  // Create the empty fence
  const fence = Array.from({ length: rails }, () => Array(ciphertext.length).fill(''));
  let row = 0;
  let direction = 1;
  
  // Mark the positions where letters will be
  for (let i = 0; i < ciphertext.length; i++) {
    fence[row][i] = '*'; // Placeholder
    
    if (row === 0) {
      direction = 1;
    } else if (row === rails - 1) {
      direction = -1;
    }
    
    row += direction;
  }
  
  // Fill the fence with the ciphertext
  let index = 0;
  for (let i = 0; i < rails; i++) {
    for (let j = 0; j < ciphertext.length; j++) {
      if (fence[i][j] === '*' && index < ciphertext.length) {
        fence[i][j] = ciphertext[index++];
      }
    }
  }
  
  // Read the plaintext
  let result = '';
  row = 0;
  direction = 1;
  
  for (let i = 0; i < ciphertext.length; i++) {
    result += fence[row][i] || '';
    
    if (row === 0) {
      direction = 1;
    } else if (row === rails - 1) {
      direction = -1;
    }
    
    row += direction;
  }
  
  return result;
}`
    });
    
    return { plaintext, steps };
  }
};

// Exporting all encryption methods
export const encryptionMethods: EncryptionMethod[] = [
  caesarCipher,
  vigenereCipher,
  railFenceCipher,
];

// Attack methods for decryption
export interface DecryptionMethod {
  id: string;
  name: string;
  description: string;
  attack: (ciphertext: string, options?: any) => Promise<DecryptionResult>;
  needsKey: boolean;
  keyName?: string;
  keyPlaceholder?: string;
}

// Brute Force Attack for Caesar Cipher
const bruteForceAttack: DecryptionMethod = {
  id: 'bruteforce',
  name: 'Brute Force Attack',
  description: 'Tries all possible keys until the correct one is found.',
  needsKey: false,
  
  attack: async (ciphertext: string) => {
    const steps: DecryptionStep[] = [];
    
    // Input validation
    steps.push({
      title: 'Input Validation',
      description: `We'll attempt to decrypt the ciphertext "${ciphertext}" using brute force attack.`,
    });
    
    // Explanation step
    steps.push({
      title: 'How Brute Force Attack Works',
      description: 'A brute force attack tries all possible keys until the correct one is found. For a Caesar cipher, this means trying all 25 possible shift values (1-25).',
    });
    
    // Try all possible shift values
    const attempts: string[] = [];
    
    for (let shift = 1; shift < 26; shift++) {
      const attempt = ciphertext.split('').map(char => {
        if (!/[a-zA-Z]/.test(char)) return char;
        
        const code = char.charCodeAt(0);
        const isUpperCase = code >= 65 && code <= 90;
        const base = isUpperCase ? 65 : 97;
        
        return String.fromCharCode(((code - base - shift + 26) % 26) + base);
      }).join('');
      
      attempts.push(`Shift ${shift}: ${attempt}`);
    }
    
    steps.push({
      title: 'Trying All Shifts',
      description: 'Here are all 25 possible decryptions:',
      code: attempts.join('\n'),
    });
    
    // Result explanation
    steps.push({
      title: 'Analysis',
      description: 'The brute force attack has generated all possible decryptions. You need to look through them to find the one that makes sense in your language. For English text, look for common words and proper grammar.',
    });
    
    // Assuming the first attempt might be the correct one for the sake of the demo
    const plaintext = attempts[0].split(': ')[1];
    
    steps.push({
      title: 'Potential Solution',
      description: 'The most likely correct decryption might be:',
      originalText: ciphertext,
      transformedText: plaintext,
    });
    
    return { plaintext, steps };
  }
};

// Frequency Analysis
const frequencyAnalysis: DecryptionMethod = {
  id: 'frequency',
  name: 'Frequency Analysis',
  description: 'Analyzes the frequency of letters in the ciphertext to guess the key.',
  needsKey: false,
  
  attack: async (ciphertext: string) => {
    const steps: DecryptionStep[] = [];
    
    // Input validation
    steps.push({
      title: 'Input Validation',
      description: `We'll attempt to decrypt the ciphertext "${ciphertext}" using frequency analysis.`,
    });
    
    // Explanation step
    steps.push({
      title: 'How Frequency Analysis Works',
      description: 'Frequency analysis is based on the fact that certain letters appear more frequently than others in a language. In English, "E" is the most common letter, followed by "T", "A", "O", etc. By analyzing the frequency of letters in the ciphertext, we can guess which letters might represent which.',
    });
    
    // Count the frequency of each letter
    const frequency: Record<string, number> = {};
    let totalLetters = 0;
    
    for (const char of ciphertext) {
      if (/[a-zA-Z]/.test(char)) {
        const lowerChar = char.toLowerCase();
        frequency[lowerChar] = (frequency[lowerChar] || 0) + 1;
        totalLetters++;
      }
    }
    
    // Sort letters by frequency
    const sortedFrequency = Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .map(([letter, count]) => `${letter}: ${count} (${((count / totalLetters) * 100).toFixed(2)}%)`);
    
    steps.push({
      title: 'Letter Frequency Analysis',
      description: 'Here are the frequencies of letters in the ciphertext:',
      code: sortedFrequency.join('\n'),
    });
    
    // English letter frequency
    const englishFrequency = 'etaoinsrhdlucmfywgpbvkjxqz';
    
    steps.push({
      title: 'Frequency Comparison',
      description: 'In English, the most common letters are: E, T, A, O, I, N, S, R, H, D, L, U, C, M, F, Y, W, G, P, B, V, K, J, X, Q, Z (in decreasing order of frequency).',
    });
    
    // Create a simple mapping based on frequency
    const mapping: Record<string, string> = {};
    const sortedLetters = Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .map(([letter]) => letter);
    
    for (let i = 0; i < sortedLetters.length; i++) {
      if (i < englishFrequency.length) {
        mapping[sortedLetters[i]] = englishFrequency[i];
      }
    }
    
    steps.push({
      title: 'Letter Mapping',
      description: 'Based on frequency analysis, here\'s a possible mapping of ciphertext letters to plaintext letters:',
      code: Object.entries(mapping)
        .map(([cipherLetter, plainLetter]) => `${cipherLetter} -> ${plainLetter}`)
        .join('\n'),
    });
    
    // Apply the mapping to get a potential plaintext
    let plaintext = ciphertext.split('').map(char => {
      if (!/[a-zA-Z]/.test(char)) return char;
      
      const isUpperCase = char === char.toUpperCase();
      const lowerChar = char.toLowerCase();
      
      const mappedChar = mapping[lowerChar] || lowerChar;
      return isUpperCase ? mappedChar.toUpperCase() : mappedChar;
    }).join('');
    
    steps.push({
      title: 'Potential Decryption',
      description: 'Using the frequency-based mapping, the potential decryption is:',
      originalText: ciphertext,
      transformedText: plaintext,
    });
    
    // Result explanation
    steps.push({
      title: 'Analysis',
      description: 'This is just an initial attempt based on letter frequency. The result may not be perfect and might require further refinement. You can adjust the letter mapping based on context clues and try again.',
    });
    
    return { plaintext, steps };
  }
};

// Exporting all decryption methods
export const decryptionMethods: DecryptionMethod[] = [
  bruteForceAttack,
  frequencyAnalysis,
];
