import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';

export type SessionStatus = 'completed' | 'stopped_early';

export type FastingSession = {
  id: string;
  startedAt: string;
  endedAt: string;
  targetSeconds: number;
  actualSeconds: number;
  status: SessionStatus;
};

type FastingContextValue = {
  sessions: FastingSession[];
  addSession: (session: FastingSession) => void;
  clearSessions: () => void;
};

const FastingContext = createContext<FastingContextValue | undefined>(undefined);

export function FastingProvider({ children }: PropsWithChildren) {
  const [sessions, setSessions] = useState<FastingSession[]>([]);

  const value = useMemo(
    () => ({
      sessions,
      addSession: (session: FastingSession) => {
        setSessions((prevSessions) => [session, ...prevSessions]);
      },
      clearSessions: () => {
        setSessions([]);
      },
    }),
    [sessions],
  );

  return <FastingContext.Provider value={value}>{children}</FastingContext.Provider>;
}

export function useFasting() {
  const context = useContext(FastingContext);

  if (!context) {
    throw new Error('useFasting must be used within a FastingProvider');
  }

  return context;
}
