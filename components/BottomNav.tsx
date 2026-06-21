import React from 'react';
import { Tab } from '../types';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  hiddenTabs?: string[];
  glassEffect?: boolean;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, hiddenTabs = [], glassEffect = true }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 safe-area-pb">
       <nav className={`${glassEffect ? 'bg-surface/95 backdrop-blur-xl' : 'bg-surface'} border-t border-theme-border/50 px-2 py-2 flex items-center justify-around`}>
         
         {!hiddenTabs.includes('android') && (
             <button 
                onClick={() => onTabChange('android')}
                className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-2xl transition-all duration-200 ${activeTab === 'android' ? 'text-primary' : 'text-theme-sub hover:text-theme-text'}`}
             >
                <span className="material-icons-round text-base">{activeTab === 'android' ? 'apps' : 'apps_outage'}</span>
                <span className="text-[10px] font-medium">Apps</span>
             </button>
         )}

         {!hiddenTabs.includes('pc') && (
             <button 
                onClick={() => onTabChange('pc')}
                className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-2xl transition-all duration-200 ${activeTab === 'pc' ? 'text-primary' : 'text-theme-sub hover:text-theme-text'}`}
             >
                <span className="material-icons-round text-base">{activeTab === 'pc' ? 'desktop_windows' : 'computer'}</span>
                <span className="text-[10px] font-medium">PC</span>
             </button>
         )}

         {!hiddenTabs.includes('tv') && (
             <button 
                onClick={() => onTabChange('tv')}
                className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-2xl transition-all duration-200 ${activeTab === 'tv' ? 'text-primary' : 'text-theme-sub hover:text-theme-text'}`}
             >
                <span className="material-icons-round text-base">{activeTab === 'tv' ? 'live_tv' : 'tv'}</span>
                <span className="text-[10px] font-medium">TV</span>
             </button>
         )}

         <button 
            onClick={() => onTabChange('about')}
            className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-2xl transition-all duration-200 ${activeTab === 'about' ? 'text-primary' : 'text-theme-sub hover:text-theme-text'}`}
         >
            <span className="material-icons-round text-base">{activeTab === 'about' ? 'code' : 'developer_mode'}</span>
            <span className="text-[10px] font-medium">Dev</span>
         </button>
      </nav>
    </div>
  );
};

export default React.memo(BottomNav);
