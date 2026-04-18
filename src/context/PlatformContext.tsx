import React, { createContext, useContext, useEffect, useState } from 'react';
import { type } from '@tauri-apps/plugin-os';

type Platform = 'macos' | 'windows' | 'linux' | 'other';

interface PlatformContextType {
  platform: Platform;
  isMac: boolean;
  isWin: boolean;
  getPlatformKey: (key: 'mod' | 'opt' | 'cmd' | 'shift') => string;
  resolvePlaceholders: (text: string) => string;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [platform, setPlatform] = useState<Platform>('other');

  useEffect(() => {
    const detectPlatform = async () => {
      try {
        const osType = await type();
        if (osType === 'macos') setPlatform('macos');
        else if (osType === 'windows') setPlatform('windows');
        else if (osType === 'linux') setPlatform('linux');
      } catch (e) {
        const ua = navigator.userAgent.toLowerCase();
        if (ua.includes('mac')) setPlatform('macos');
        else if (ua.includes('win')) setPlatform('windows');
        else if (ua.includes('linux')) setPlatform('linux');
      }
    };
    detectPlatform();
  }, []);

  const isMac = platform === 'macos';
  const isWin = platform === 'windows';

  const getPlatformKey = (key: 'mod' | 'opt' | 'cmd' | 'shift'): string => {
    switch (key) {
      case 'mod':
        return isMac ? '⌘' : 'Ctrl';
      case 'cmd':
        return isMac ? 'Cmd' : 'Ctrl';
      case 'opt':
        return isMac ? '⌥' : 'Alt';
      case 'shift':
        return isMac ? '⇧' : 'Shift';
      default:
        return key;
    }
  };

  const resolvePlaceholders = (text: string) => {
    const storagePath = isMac
      ? '~/Library/Application Support/com.snippetbox.app/snippets.json'
      : '%APPDATA%\\com.snippetbox.app\\snippets.json';

    return text
      .replace(/{mod}/g, getPlatformKey('mod'))
      .replace(/{modIcon}/g, getPlatformKey('mod'))
      .replace(/{osName}/g, isMac ? 'macOS' : 'Windows')
      .replace(/{storagePath}/g, storagePath);
  };

  return (
    <PlatformContext.Provider value={{ platform, isMac, isWin, getPlatformKey, resolvePlaceholders }}>
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => {
  const context = useContext(PlatformContext);
  if (!context) throw new Error('usePlatform must be used within PlatformProvider');
  return context;
};
