
import React, { createContext, useContext, useState } from 'react';

interface UIContextType {
    isProfileOpen: boolean;
    openProfile: () => void;
    closeProfile: () => void;
    toggleProfile: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const openProfile = () => setIsProfileOpen(true);
    const closeProfile = () => setIsProfileOpen(false);
    const toggleProfile = () => setIsProfileOpen(prev => !prev);

    return (
        <UIContext.Provider value={{ isProfileOpen, openProfile, closeProfile, toggleProfile }}>
            {children}
        </UIContext.Provider>
    );
};

export const useUI = () => {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
};
