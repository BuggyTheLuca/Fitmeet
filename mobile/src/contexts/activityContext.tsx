import { createContext, useContext, useState, ReactNode } from 'react';

interface RefreshContextType {
    shouldRefresh: boolean;
    triggerRefresh: () => void;
}

const RefreshContext = createContext<RefreshContextType | undefined>(undefined);

export function RefreshProvider({ children }: { children: ReactNode }) {
    const [shouldRefresh, setShouldRefresh] = useState(false);

    const triggerRefresh = () => {
        setShouldRefresh(prev => !prev);
    };

    return (
        <RefreshContext.Provider value={{ shouldRefresh, triggerRefresh }}>
            {children}
        </RefreshContext.Provider>
    );
}

export function useRefreshContext() {
    const context = useContext(RefreshContext);
    if (context === undefined) {
        throw new Error('useActivityContext must be used within an ActivityProvider');
    }
    return context;
} 