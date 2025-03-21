
import React, { useEffect, useState } from 'react';
import CodeCharacter from './CodeCharacter';

interface AnimatedTextProps {
  originalText: string;
  transformedText?: string;
  transformDelay?: number;
  highlightIndices?: number[];
  transformIndices?: number[];
  className?: string;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  originalText,
  transformedText,
  transformDelay = 500,
  highlightIndices = [],
  transformIndices = [],
  className = ''
}) => {
  const [characters, setCharacters] = useState<string[]>(
    originalText.split('')
  );
  
  useEffect(() => {
    setCharacters(originalText.split(''));
  }, [originalText]);
  
  const getTransformedChar = (index: number) => {
    if (!transformedText || !transformIndices.includes(index)) return undefined;
    return transformedText.charAt(index);
  };
  
  return (
    <div className={className}>
      {characters.map((char, index) => (
        <CodeCharacter
          key={`char-${index}`}
          character={char}
          highlighted={highlightIndices.includes(index)}
          transformedChar={getTransformedChar(index)}
          delay={transformIndices.includes(index) ? transformDelay + (index * 100) : 0}
        />
      ))}
    </div>
  );
};

export default AnimatedText;
