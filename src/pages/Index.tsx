
import React, { useState } from 'react';
import { Shield, Lock, Unlock, GithubIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import EncryptView from '@/components/EncryptView';
import DecryptView from '@/components/DecryptView';
import MatrixBackground from '@/components/MatrixBackground';

const Index = () => {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');

  return (
    <div className="min-h-screen relative overflow-hidden pb-10">
      {/* Matrix-like background animation */}
      <MatrixBackground />
      
      {/* Header */}
      <header className="relative z-10 pt-8 pb-4 px-4 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="inline-block p-3 rounded-full bg-spy-dark border-2 border-spy-purple mb-4">
            <Shield className="w-10 h-10 text-spy-purple" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-spy-blue mb-2">SECRET CODE CRAFTER</h1>
          <p className="text-lg text-gray-300 mb-6 font-spy">Encrypt and decrypt messages with advanced cryptographic methods</p>
          
          <div className="inline-flex bg-spy-dark/70 border border-spy-purple/30 rounded-lg p-1 text-white">
            <button
              className={cn(
                "px-4 py-2 rounded-md transition-all duration-300",
                mode === 'encrypt' ? "bg-spy-purple text-white" : "hover:bg-spy-purple/20"
              )}
              onClick={() => setMode('encrypt')}
            >
              <Lock className="inline-block mr-2" size={16} />
              Encrypt
            </button>
            <button
              className={cn(
                "px-4 py-2 rounded-md transition-all duration-300",
                mode === 'decrypt' ? "bg-spy-purple text-white" : "hover:bg-spy-purple/20"
              )}
              onClick={() => setMode('decrypt')}
            >
              <Unlock className="inline-block mr-2" size={16} />
              Decrypt
            </button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {mode === 'encrypt' ? <EncryptView /> : <DecryptView />}
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 pt-6 pb-10 text-center text-sm text-gray-400">
        <p>SECRET CODE CRAFTER v1.0 - Learn cryptography through visualization</p>
        <div className="flex justify-center items-center mt-2 space-x-4">
          <a href="#" className="text-spy-blue hover:text-spy-purple transition-colors">
            About
          </a>
          <a href="#" className="text-spy-blue hover:text-spy-purple transition-colors">
            <GithubIcon className="inline-block mr-1" size={16} />
            GitHub
          </a>
          <a href="#" className="text-spy-blue hover:text-spy-purple transition-colors">
            Privacy
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Index;
