import React from 'react';
import { Tab } from '../types';

interface HeaderProps {
  onTitleClick: () => void;
  storeUpdateAvailable: boolean;
  onUpdateStore: () => void;
  theme: 'light' | 'dusk' | 'dark' | 'oled';
  toggleTheme: () => void;
  activeTab: Tab;
  onOpenSettings: () => void;
  onOpenSettingsPreload?: () => void;
  onOpenReleaseNotes: () => void;
  updateCount?: number;
  activeDownloadCount?: number;
}

const Header: React.FC<HeaderProps> = ({ 
  onTitleClick, 
  storeUpdateAvailable, 
  onUpdateStore, 
  theme, 
  toggleTheme,
  activeTab,
  onOpenSettings,
  onOpenSettingsPreload,
  onOpenReleaseNotes,
  updateCount = 0,
  activeDownloadCount = 0
}) => {
  const hasNotifications = updateCount > 0 || activeDownloadCount > 0 || storeUpdateAvailable;

  return (
      <header className="sticky top-0 z-30 w-full bg-surface/80 backdrop-blur-xl border-b border-theme-border/50 transition-all duration-300">
          <div className="flex items-center justify-between px-4 py-3 safe-area-pt">
              {/* Logo & Title */}
              <div 
                  onClick={onTitleClick}
                  className="flex items-center gap-2.5 cursor-pointer active:scale-[0.96] transition-transform"
              >
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                      <span className="material-icons-round text-white text-xl">rocket_launch</span>
                  </div>
                  <h1 className="text-xl font-semibold tracking-tight text-theme-text">
                      Orion
                  </h1>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-1.5">
                  {storeUpdateAvailable && (
                      <button
                          onClick={onUpdateStore}
                          className="relative flex items-center justify-center w-10 h-10 rounded-full bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-400 hover:scale-105 active:scale-95 transition-all"
                          title="Update Orion Store"
                      >
                          <span className="material-icons-round text-base">system_update</span>
                          <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-lime-500"></span>
                          </span>
                      </button>
                  )}

                  {/* Release Notes Button */}
                  {activeTab === 'about' && (
                      <button 
                          onClick={onOpenReleaseNotes}
                          className="flex items-center justify-center w-10 h-10 rounded-full bg-theme-element hover:bg-theme-hover text-theme-sub hover:text-primary transition-all hover:scale-105 active:scale-95"
                          title="Release Notes"
                      >
                          <span className="material-icons-round text-base">campaign</span>
                      </button>
                  )}

                  {/* Settings Button */}
                  <div className="relative">
                      <button 
                          onClick={onOpenSettings}
                          onPointerEnter={onOpenSettingsPreload}
                          onFocus={onOpenSettingsPreload}
                          className={`flex items-center justify-center w-10 h-10 rounded-full bg-theme-element hover:bg-theme-hover text-theme-sub hover:text-primary transition-all hover:scale-105 active:scale-95 ${activeDownloadCount > 0 ? 'animate-pulse text-primary' : ''}`}
                          title="Settings & Updates"
                      >
                          <span className="material-icons-round text-base">{activeDownloadCount > 0 ? 'downloading' : 'settings'}</span>
                      </button>
                      {hasNotifications && (
                          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center">
                              <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${activeDownloadCount > 0 ? 'bg-indigo-500' : 'bg-acid'}`}></span>
                              <span className={`relative inline-flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white ${activeDownloadCount > 0 ? 'bg-indigo-500' : 'bg-acid text-black'}`}>
                                  {activeDownloadCount > 0 ? activeDownloadCount : updateCount > 0 ? updateCount : '!'}
                              </span>
                          </span>
                      )}
                  </div>

                  {/* Theme Toggle */}
                  {activeTab !== 'about' && (
                      <button 
                          onClick={toggleTheme}
                          className="flex items-center justify-center w-10 h-10 rounded-full bg-theme-element hover:bg-theme-hover text-theme-sub hover:text-amber-500 transition-all hover:scale-105 active:scale-95"
                          title={`Theme: ${theme}`}
                      >
                          <span className="material-icons-round text-base">
                              {theme === 'light' ? 'light_mode' : theme === 'dusk' ? 'cloud_queue' : 'dark_mode'}
                          </span>
                      </button>
                  )}
              </div>
          </div>
      </header>
  );
};

export default React.memo(Header);
