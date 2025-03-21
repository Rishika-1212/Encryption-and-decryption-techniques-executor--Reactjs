
import React, { useState } from 'react';
import { Check, Unlock, Key, Search } from 'lucide-react';
import MethodCard from './MethodCard';
import ProcessVisualization from './ProcessVisualization';
import { 
  EncryptionMethod, 
  DecryptionMethod,
  DecryptionResult,
  encryptionMethods,
  decryptionMethods
} from '@/utils/cryptoMethods';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const DecryptView: React.FC = () => {
  const { toast } = useToast();
  const [selectedMethod, setSelectedMethod] = useState<EncryptionMethod | DecryptionMethod | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [inputKey, setInputKey] = useState('');
  const [result, setResult] = useState<DecryptionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [methodType, setMethodType] = useState<'standard' | 'attack'>('standard');

  const handleSelectMethod = (method: EncryptionMethod | DecryptionMethod, type: 'standard' | 'attack') => {
    setSelectedMethod(method);
    setMethodType(type);
    setResult(null);
    setCurrentStepIndex(0);
  };

  const handleDecrypt = async () => {
    if (!selectedMethod) {
      toast({
        title: "Error",
        description: "Please select a decryption method first",
        variant: "destructive"
      });
      return;
    }

    if (!inputMessage.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message to decrypt",
        variant: "destructive"
      });
      return;
    }

    if (selectedMethod.needsKey && !inputKey.trim()) {
      toast({
        title: "Error",
        description: `Please enter a ${(selectedMethod as EncryptionMethod).keyName?.toLowerCase() || 'key'}`,
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      let decryptionResult;
      
      if (methodType === 'standard') {
        decryptionResult = await (selectedMethod as EncryptionMethod).decrypt(inputMessage, inputKey);
      } else {
        decryptionResult = await (selectedMethod as DecryptionMethod).attack(inputMessage);
      }
      
      setResult(decryptionResult);
      setCurrentStepIndex(0);
    } catch (error) {
      toast({
        title: "Decryption Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            className={cn(
              "spy-toggle-button",
              methodType === 'standard' && "spy-toggle-button-active"
            )}
            onClick={() => setMethodType('standard')}
          >
            <Key className="inline-block mr-2" size={16} />
            Standard Decryption
          </button>
          <button
            className={cn(
              "spy-toggle-button",
              methodType === 'attack' && "spy-toggle-button-active"
            )}
            onClick={() => setMethodType('attack')}
          >
            <Search className="inline-block mr-2" size={16} />
            Cryptanalysis Attack
          </button>
        </div>
        
        <div className="p-4 border border-spy-purple/20 rounded-md bg-spy-dark/80">
          <h2 className="text-xl font-bold text-spy-purple mb-4 flex items-center">
            {methodType === 'standard' ? (
              <>
                <Key className="mr-2" /> Select Decryption Method
              </>
            ) : (
              <>
                <Search className="mr-2" /> Select Attack Method
              </>
            )}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {methodType === 'standard' ? (
              encryptionMethods.map((method) => (
                <MethodCard
                  key={method.id}
                  title={method.name}
                  description={method.description}
                  isSelected={selectedMethod?.id === method.id && methodType === 'standard'}
                  onClick={() => handleSelectMethod(method, 'standard')}
                  icon={method.id === 'caesar' ? <Key size={20} /> : <Unlock size={20} />}
                />
              ))
            ) : (
              decryptionMethods.map((method) => (
                <MethodCard
                  key={method.id}
                  title={method.name}
                  description={method.description}
                  isSelected={selectedMethod?.id === method.id && methodType === 'attack'}
                  onClick={() => handleSelectMethod(method, 'attack')}
                  icon={<Search size={20} />}
                />
              ))
            )}
          </div>
        </div>
      </div>
      
      {selectedMethod && (
        <div className="mb-6 p-4 border border-spy-purple/20 rounded-md bg-spy-dark/80">
          <h2 className="text-xl font-bold text-spy-purple mb-4 flex items-center">
            <Unlock className="mr-2" /> Decryption Input
          </h2>
          
          <div className="flex flex-col space-y-4">
            <div>
              <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-300">
                Message to Decrypt
              </label>
              <textarea
                id="message"
                rows={3}
                className={cn(
                  "w-full p-2.5 bg-muted text-white rounded-lg border",
                  isProcessing ? "border-gray-600" : "border-spy-blue/30 focus:ring-spy-blue focus:border-spy-blue"
                )}
                placeholder="Enter the encrypted message here..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isProcessing}
              />
            </div>
            
            {selectedMethod.needsKey && (
              <div>
                <label htmlFor="key" className="block mb-2 text-sm font-medium text-gray-300">
                  {(selectedMethod as EncryptionMethod).keyName || 'Key'}
                </label>
                <input
                  type="text"
                  id="key"
                  className={cn(
                    "w-full p-2.5 bg-muted text-white rounded-lg border",
                    isProcessing ? "border-gray-600" : "border-spy-blue/30 focus:ring-spy-blue focus:border-spy-blue"
                  )}
                  placeholder={(selectedMethod as EncryptionMethod).keyPlaceholder || 'Enter decryption key...'}
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  disabled={isProcessing}
                />
              </div>
            )}
            
            <button
              className="spy-button w-full flex items-center justify-center"
              onClick={handleDecrypt}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin mr-2">⟳</div>
                  Processing...
                </>
              ) : (
                <>
                  <Unlock className="mr-2" />
                  Decrypt Message
                </>
              )}
            </button>
          </div>
        </div>
      )}
      
      {result && (
        <div className="mb-6 p-4 border border-spy-purple/20 rounded-md bg-spy-dark/80">
          <h2 className="text-xl font-bold text-spy-purple mb-4 flex items-center">
            <Check className="mr-2" /> Decryption Result
          </h2>
          
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Decrypted Message
            </label>
            <div className="p-4 bg-black/50 text-spy-blue rounded-md border border-spy-blue/30 font-mono break-all">
              {result.plaintext}
            </div>
          </div>
          
          <button
            className="spy-button w-full mb-4"
            onClick={() => {
              navigator.clipboard.writeText(result.plaintext);
              toast({
                title: "Copied!",
                description: "Decrypted message copied to clipboard",
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
              <h3 className="text-lg font-bold text-spy-purple">Decryption Process</h3>
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

export default DecryptView;
