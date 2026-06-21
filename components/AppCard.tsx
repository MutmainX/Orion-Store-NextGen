import React, { useMemo, useState } from 'react';
import { shallow } from 'zustand/shallow';
import { AppItem } from '../types';
import { CATEGORY_GRADIENTS } from '../constants';
import { getOptimizedImageUrl } from '../utils/image';
import { useDataStore, useSettingsStore } from '../store/useAppStore';
import { hasAvailableUpdate } from '../utils/appVersioning';

interface AppCardProps {
  app: AppItem;
  onClick: (app: AppItem) => void;
  priority?: boolean;
}

const AppCard: React.FC<AppCardProps> = React.memo(({ app, onClick, priority = false }) => {
  const [imgStatus, setImgStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const { localVersion, preferredStream } = useSettingsStore((state) => ({
    localVersion: state.installedVersions[app.id],
    preferredStream: state.appStreams[app.id] || 'Stable'
  }), shallow);
  const {
    isFavorite,
    downloadProgress,
    isReadyToInstall,
    isDownloading
  } = useDataStore((state) => ({
    isFavorite: state.favorites.includes(app.id),
    downloadProgress: state.downloadProgress[app.id] || 0,
    isReadyToInstall: !!state.readyToInstall[app.id],
    isDownloading: !!state.activeDownloads[app.id]
  }), shallow);

  const isInstalled = !!localVersion;
  const isUpdateAvailable = useMemo(
    () => hasAvailableUpdate(app, localVersion, preferredStream),
    [app, localVersion, preferredStream]
  );
  const bgGradient = CATEGORY_GRADIENTS[app.category] || CATEGORY_GRADIENTS.Default;
  const optimizedUrl = getOptimizedImageUrl(app.icon, 128, 128);
  const fallbackIconUrl = app.icon;

  const handleClick = () => onClick(app);

  return (
    <div className="app-card-optimized app-card orion-shadow-frame relative rounded-[20px] group isolate">
      <div
        onClick={handleClick}
        className="orion-shadow-surface relative flex cursor-pointer items-center gap-3.5 rounded-[inherit] bg-card p-3.5 transition-all active:scale-[0.98] hover:shadow-lg"
      >
        {/* App Icon */}
        <div className="relative shrink-0 w-14 h-14">
          {imgStatus !== 'loaded' && (
            <div className={`absolute inset-0 rounded-[14px] flex items-center justify-center text-white text-xl font-semibold shadow-inner ${imgStatus === 'error' ? bgGradient : 'bg-theme-element'}`}>
              {imgStatus === 'error' && app.name.charAt(0).toUpperCase()}
            </div>
          )}

          <img
            src={optimizedUrl}
            alt={app.name}
            onLoad={() => setImgStatus('loaded')}
            onError={(event) => {
              const target = event.currentTarget;
              if (fallbackIconUrl && target.dataset.fallback !== 'raw') {
                target.dataset.fallback = 'raw';
                target.src = fallbackIconUrl;
                setImgStatus('loading');
                return;
              }
              setImgStatus('error');
            }}
            decoding={priority ? 'sync' : 'async'}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'low'}
            className={`w-full h-full object-cover rounded-[14px] transition-opacity duration-300 ${imgStatus === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
            style={{ background: 'transparent' }}
          />

          {/* Update Badge */}
          {isUpdateAvailable && !isDownloading && !isReadyToInstall && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 z-10">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-acid opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-acid border-2 border-surface-light dark:border-surface-dark items-center justify-center">
                <span className="material-icons-round text-[10px] text-black">update</span>
              </span>
            </span>
          )}

          {/* Download Progress */}
          {isDownloading && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] rounded-[14px] flex items-center justify-center z-10 animate-fade-in overflow-hidden">
              <svg className="w-10 h-10 transform -rotate-90">
                <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/20" />
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={100}
                  strokeDashoffset={100 - downloadProgress}
                  strokeLinecap="round"
                  className="text-acid transition-all duration-300"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">{downloadProgress}%</span>
              </div>
            </div>
          )}

          {/* Ready to Install */}
          {isReadyToInstall && (
            <div className="absolute inset-0 bg-primary/20 backdrop-blur-[1px] rounded-[14px] flex items-center justify-center z-10 animate-pulse border-2 border-primary/50">
              <span className="material-icons-round text-primary text-xl">download_done</span>
            </div>
          )}

          {/* Favorite Badge */}
          {isFavorite && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center text-rose-500 shadow-sm z-20">
              <span className="material-icons-round text-[10px]">favorite</span>
            </div>
          )}

          {/* Installed Badge */}
          {isInstalled && !isUpdateAvailable && !isDownloading && !isReadyToInstall && (
            <div className="absolute -bottom-1 -left-1 w-5 h-5 bg-green-500 rounded-full border-2 border-card flex items-center justify-center text-white text-[10px] z-10 shadow-sm">
              <span className="material-icons-round text-[10px]">check</span>
            </div>
          )}
        </div>

        {/* App Info */}
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <h3 className="text-base font-semibold text-theme-text truncate tracking-tight">{app.name}</h3>
          <p className="text-xs font-medium text-theme-sub">{app.author}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide ${
              app.category === 'Media' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300' :
              app.category === 'Social' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' :
              'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
            }`}>
              {app.category}
            </span>
            {isDownloading ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-primary/20 text-primary border border-primary/30">
                DL...
              </span>
            ) : isReadyToInstall ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-primary text-white shadow-lg shadow-primary/20">
                INSTALL
              </span>
            ) : isUpdateAvailable ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-acid/20 text-acid-dark dark:text-acid border border-acid/30">
                UPDATE
              </span>
            ) : isInstalled ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
                v{localVersion}
              </span>
            ) : null}
          </div>
        </div>

        {/* Chevron */}
        <div className="shrink-0 pl-1">
          <div className="w-8 h-8 rounded-full bg-theme-element flex items-center justify-center transition-colors group-hover:bg-theme-hover">
            <span className="material-icons-round text-theme-sub/60 text-sm">chevron_right</span>
          </div>
        </div>
      </div>
    </div>
  );
}, (prev, next) => prev.app === next.app && prev.priority === next.priority);

export default AppCard;
