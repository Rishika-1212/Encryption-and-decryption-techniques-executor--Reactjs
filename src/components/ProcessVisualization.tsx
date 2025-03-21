
import React from 'react';
import { EncryptionStep, DecryptionStep } from '@/utils/cryptoMethods';
import AnimatedText from './AnimatedText';
import { cn } from '@/lib/utils';

interface ProcessVisualizationProps {
  steps: EncryptionStep[] | DecryptionStep[];
  currentStepIndex: number;
  onStepChange: (index: number) => void;
}

const ProcessVisualization: React.FC<ProcessVisualizationProps> = ({
  steps,
  currentStepIndex,
  onStepChange
}) => {
  const currentStep = steps[currentStepIndex];
  
  return (
    <div className="mt-4 w-full">
      <div className="flex mb-4 overflow-x-auto py-2 scrollbar-hide">
        {steps.map((step, index) => (
          <button
            key={index}
            className={cn(
              "spy-toggle-button mr-2 whitespace-nowrap min-w-max",
              index === currentStepIndex && "spy-toggle-button-active"
            )}
            onClick={() => onStepChange(index)}
          >
            Step {index + 1}: {step.title}
          </button>
        ))}
      </div>
      
      <div className="encryption-step">
        <h3 className="text-lg font-bold text-spy-purple mb-2">{currentStep.title}</h3>
        <p className="mb-4 text-gray-300">{currentStep.description}</p>
        
        {(currentStep.originalText || currentStep.transformedText) && (
          <div className="mb-4 spy-terminal">
            {currentStep.originalText && !currentStep.transformedText && (
              <AnimatedText
                originalText={currentStep.originalText}
                highlightIndices={currentStep.highlightIndices || []}
                className="mb-2"
              />
            )}
            
            {currentStep.originalText && currentStep.transformedText && (
              <>
                <div className="mb-2">
                  <span className="text-gray-400 mr-2">Original:</span>
                  <AnimatedText
                    originalText={currentStep.originalText}
                    highlightIndices={currentStep.highlightIndices || []}
                  />
                </div>
                <div>
                  <span className="text-gray-400 mr-2">Transformed:</span>
                  <AnimatedText
                    originalText={currentStep.originalText}
                    transformedText={currentStep.transformedText}
                    highlightIndices={currentStep.highlightIndices || []}
                    transformIndices={currentStep.transformIndices || []}
                  />
                </div>
              </>
            )}
          </div>
        )}
        
        {currentStep.code && (
          <div className="spy-terminal overflow-x-auto whitespace-pre-wrap">
            <code>{currentStep.code}</code>
          </div>
        )}
      </div>
      
      <div className="flex justify-between mt-4">
        <button
          className="spy-button"
          disabled={currentStepIndex === 0}
          onClick={() => onStepChange(Math.max(0, currentStepIndex - 1))}
        >
          Previous Step
        </button>
        <button
          className="spy-button"
          disabled={currentStepIndex === steps.length - 1}
          onClick={() => onStepChange(Math.min(steps.length - 1, currentStepIndex + 1))}
        >
          Next Step
        </button>
      </div>
    </div>
  );
};

export default ProcessVisualization;
