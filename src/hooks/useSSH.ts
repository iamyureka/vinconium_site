import { useState, useRef, useEffect } from 'react';
import { SSHSessionInfo, ThemeName } from '../lib/terminal/types';

interface UseSshProps {
    onData: (data: string) => void;
    onClose: (msg: string) => void;
    currentTheme: ThemeName;
    setCurrentTheme: (t: ThemeName) => void;
}

export function useSSH({ onData, onClose, currentTheme, setCurrentTheme }: UseSshProps) {
    const [sshSession, setSshSession] = useState<SSHSessionInfo | null>(null);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [isSecureInput, setIsSecureInput] = useState(false);
    const eventSourceRef = useRef<EventSource | null>(null);
    const prevThemeRef = useRef<ThemeName | null>(null);

    useEffect(() => {
        return () => {
            if (eventSourceRef.current) eventSourceRef.current.close();
        };
    }, []);

    const startStream = (sessionId: string) => {
        if (eventSourceRef.current) eventSourceRef.current.close();
        const eventSource = new EventSource(`/api/ssh/stream?sessionId=${sessionId}`);
        eventSourceRef.current = eventSource;

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data) onData(data);
            } catch (e) { }
        };

        eventSource.onerror = () => {
            stopSession();
            onClose('SYSTEM: SSH Connection closed.');
        };
    };

    const connect = (user: string, host: string) => {
        setSshSession({ user, host, id: '', isSecure: true });
        setIsAuthenticating(true);
        setIsSecureInput(true);
    };

    const authenticate = async (password: string) => {
        if (!sshSession) return;
        setIsAuthenticating(false);
        setIsSecureInput(false);

        try {
            const res = await fetch('/api/ssh/connect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ host: sshSession.host, user: sshSession.user, password }),
            });

            const data = await res.json();
            if (data.sessionId) {
                prevThemeRef.current = currentTheme;
                setCurrentTheme('ghost');
                setSshSession({ ...sshSession, id: data.sessionId });
                startStream(data.sessionId);
                return true;
            } else {
                onClose(`ERROR: ${data.error || 'Authentication failed'}`);
                setSshSession(null);
                return false;
            }
        } catch (e) {
            onClose('ERROR: Network failure during SSH handshake.');
            setSshSession(null);
            return false;
        }
    };

    const sendInput = async (input: string) => {
        if (!sshSession?.id) return;
        await fetch('/api/ssh/input', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId: sshSession.id, input }),
        });
    };

    const stopSession = () => {
        if (eventSourceRef.current) eventSourceRef.current.close();
        eventSourceRef.current = null;
        setSshSession(null);
        if (prevThemeRef.current) {
            setCurrentTheme(prevThemeRef.current);
            prevThemeRef.current = null;
        }
    };

    return {
        sshSession,
        isAuthenticating,
        isSecureInput,
        connect,
        authenticate,
        sendInput,
        stopSession
    };
}
