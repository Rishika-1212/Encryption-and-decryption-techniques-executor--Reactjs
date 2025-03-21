
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface CodeCharacterProps {
  character: string;
  highlighted?: boolean;
  transformedChar?: string;
  delay?: number;
}

const CodeCharacter: React.FC<CodeCharacterProps> = ({
  character,
  highlighted = false,
  transformedChar,
  delay = 0
}) => {
  const [isTransformed, setIsTransformed] = useState(false);
  const [displayChar, setDisplayChar] = useState(character);
  
  useEffect(() => {
    if (transformedChar !== undefined) {
      const timer = setTimeout(() => {
        setIsTransformed(true);
        
        // Wait for animation to start before changing the character
        const changeTimer = setTimeout(() => {
          setDisplayChar(transformedChar);
        }, 250); // Half of the flip animation duration
        
        return () => clearTimeout(changeTimer);
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [transformedChar, delay]);
  
  return (
    <span 
      className={cn(
        'code-char',
        highlighted && 'code-char-highlighted',
        isTransformed && 'code-char-transformed'
      )}
    >
      {displayChar === ' ' ? '\u00A0' : displayChar}
    </span>
  );
};

export default CodeCharacter;
