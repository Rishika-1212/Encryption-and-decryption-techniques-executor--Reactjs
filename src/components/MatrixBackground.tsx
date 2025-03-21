
import React, { useEffect, useState } from 'react';

const MatrixBackground = () => {
  const [columns, setColumns] = useState<React.ReactNode[]>([]);
  
  useEffect(() => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
    const columnCount = Math.floor(window.innerWidth / 20); // Approximately one column per 20px
    
    const createColumn = (index: number) => {
      const length = 10 + Math.floor(Math.random() * 20);
      const content = Array.from({ length }, () => 
        characters.charAt(Math.floor(Math.random() * characters.length))
      ).join('');
      
      const left = (index / columnCount) * 100;
      const animationDelay = Math.random() * 2;
      const animationDuration = 2 + Math.random() * 3;
      
      return (
        <div 
          key={`column-${index}`}
          className="matrix-column"
          style={{
            left: `${left}%`,
            animationDelay: `${animationDelay}s`,
            animationDuration: `${animationDuration}s`
          }}
        >
          {content}
        </div>
      );
    };
    
    const newColumns = Array.from({ length: columnCount }, (_, i) => createColumn(i));
    setColumns(newColumns);
    
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * columnCount);
      setColumns(prev => {
        const updated = [...prev];
        updated[randomIndex] = createColumn(randomIndex);
        return updated;
      });
    }, 500);
    
    return () => clearInterval(interval);
  }, []);
  
  return <div className="matrix-background">{columns}</div>;
};

export default MatrixBackground;
