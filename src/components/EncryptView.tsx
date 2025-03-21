
import React, { useState } from 'react';
import { Check, Lock, Key, Wand2 } from 'lucide-react';
import MethodCard from './MethodCard';
import ProcessVisualization from './ProcessVisualization';
import { 
  EncryptionMethod, 
  EncryptionResult,
  EncryptionStep,
  encryptionMethods 
} from '@/utils/cryptoMethods';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const EncryptView: React.FC = () => {
  const { toast } = useToast();
  const [selectedMethod, setSelectedMethod] = useState<EncryptionMethod | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [inputKey, setInputKey] = useState('');
  const [result, setResult] = useState<EncryptionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSelectMethod = (method: EncryptionMethod) => {
    setSelectedMethod(method);
    setResult(null);
    setCurrentStepIndex(0);
  };

  const handleEncrypt = async () => {
    if (!selectedMethod) {
      toast({
        title: "Error",
        description: "Please select an encryption method first",
        variant: "destructive"
      });
      return;
    }

    if (!inputMessage.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message to encrypt",
        variant: "destructive"
      });
      return;
    }

    if (selectedMethod.needsKey && !inputKey.trim()) {
      toast({
        title: "Error",
        description: `Please enter a ${selectedMethod.keyName.toLowerCase()}`,
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      const encryptionResult = await selectedMethod.encrypt(inputMessage, inputKey);
      setResult(encryptionResult);
      setCurrentStepIndex(0);
    } catch (error) {
      toast({
        title: "Encryption Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6 p-4 border border-spy-purple/20 rounded-md bg-spy-dark/80">
        <h2 className="text-xl font-bold text-spy-purple mb-4 flex items-center">
          <Lock className="mr-2" /> Select Encryption Method
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {encryptionMethods.map((method) => (
            <MethodCard
              key={method.id}
              title={method.name}
              description={method.description}
              isSelected={selectedMethod?.id === method.id}
              onClick={() => handleSelectMethod(method)}
              icon={method.id === 'caesar' ? <Key size={20} /> : <Wand2 size={20} />}
            />
          ))}
        </div>
      </div>
      
      {selectedMethod && (
        <div className="mb-6 p-4 border border-spy-purple/20 rounded-md bg-spy-dark/80">
          <h2 className="text-xl font-bold text-spy-purple mb-4 flex items-center">
            <Wand2 className="mr-2" /> Encryption Input
          </h2>
          
          <div className="flex flex-col space-y-4">
            <div>
              <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-300">
                Message to Encrypt
              </label>
              <textarea
                id="message"
                rows={3}
                className={cn(
                  "w-full p-2.5 bg-muted text-white rounded-lg border",
                  isProcessing ? "border-gray-600" : "border-spy-blue/30 focus:ring-spy-blue focus:border-spy-blue"
                )}
                placeholder="Enter your secret message here..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isProcessing}
              />
            </div>
            
            {selectedMethod.needsKey && (
              <div>
                <label htmlFor="key" className="block mb-2 text-sm font-medium text-gray-300">
                  {selectedMethod.keyName}
                </label>
                <input
                  type="text"
                  id="key"
                  className={cn(
                    "w-full p-2.5 bg-muted text-white rounded-lg border",
                    isProcessing ? "border-gray-600" : "border-spy-blue/30 focus:ring-spy-blue focus:border-spy-blue"
                  )}
                  placeholder={selectedMethod.keyPlaceholder}
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  disabled={isProcessing}
                />
              </div>
            )}
            
            <button
              className="spy-button w-full flex items-center justify-center"
              onClick={handleEncrypt}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin mr-2">⟳</div>
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="mr-2" />
                  Encrypt Message
                </>
              )}
            </button>
          </div>
        </div>
      )}
      
      {result && (
        <div className="mb-6 p-4 border border-spy-purple/20 rounded-md bg-spy-dark/80">
          <h2 className="text-xl font-bold text-spy-purple mb-4 flex items-center">
            <Check className="mr-2" /> Encryption Result
          </h2>
          
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Encrypted Message
            </label>
            <div className="p-4 bg-black/50 text-spy-blue rounded-md border border-spy-blue/30 font-mono break-all">
              {result.ciphertext}
            </div>
          </div>
          
          <button
            className="spy-button w-full mb-4"
            onClick={() => {
              navigator.clipboard.writeText(result.ciphertext);
              toast({
                title: "Copied!",
                description: "Encrypted message copied to clipboard",
              });
            }}
          >
            Copy to Clipboard
          </button>
          
          <div>
            <div 
              className="flex justify-between items-center mb-2 cursor-pointer"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <h3 className="text-lg font-bold text-spy-purple">Encryption Process</h3>
              <span className="text-spy-blue">{isExpanded ? '▲' : '▼'}</span>
            </div>
            
            {isExpanded && (
              <ProcessVisualization
                steps={result.steps}
                currentStepIndex={currentStepIndex}
                onStepChange={setCurrentStepIndex}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EncryptView;
