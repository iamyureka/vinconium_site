import { useState, useRef, useEffect, useMemo } from 'react';
import { ThemeName, CommandResult } from '../lib/terminal/types';
import { THEMES } from '../lib/terminal/themes';
import { INITIAL_HISTORY, COMMANDS } from '../lib/terminal/constants';
import { executeCommand } from '../lib/terminal/commands';
import { useSSH } from './useSSH';
import { UAParser } from 'ua-parser-js';

export function useTerminal(onClose: () => void) {
    const [input, setInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentTheme, setCurrentTheme] = useState<ThemeName>('matrix');
    const [history, setHistory] = useState<string[]>(INITIAL_HISTORY);
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [isEasterEgg, setIsEasterEgg] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const theme = THEMES[currentTheme];


    const sysContext = useMemo(() => {
        if (typeof window === 'undefined') return undefined;
        const parser = new UAParser();
        const res = parser.getResult();
        return {
            os: `${res.os.name} ${res.os.version}`,
            browser: `${res.browser.name} ${res.browser.version}`,
            cpu: res.cpu.architecture || 'x64',
            device: res.device.model || 'Desktop_Station',
            resolution: `${window.screen.width}x${window.screen.height}`
        };
    }, []);


    const ssh = useSSH({
        currentTheme,
        setCurrentTheme,
        onData: (data) => {
            setHistory(prev => {
                const newHistory = [...prev];
                const incomingLines = data.split('\n');
                newHistory[newHistory.length - 1] += incomingLines[0];
                for (let j = 1; j < incomingLines.length; j++) {
                    newHistory.push(incomingLines[j]);
                }
                return newHistory.length > 500 ? newHistory.slice(-500) : newHistory;
            });
        },
        onClose: (msg) => {
            setHistory(['']);
            appendHistory(msg);
        }
    });

    const suggestion = useMemo(() => {
        if (!input.trim() || isProcessing || ssh.isAuthenticating || ssh.sshSession) return '';
        const match = COMMANDS.find(c => c.startsWith(input.toLowerCase()));
        return match && match !== input.toLowerCase() ? match : '';
    }, [input, isProcessing, ssh.isAuthenticating, ssh.sshSession]);

    useEffect(() => {
        if (!isProcessing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isProcessing, history, ssh.sshSession]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    const appendHistory = (lines: string | string[]) => {
        const newLines = Array.isArray(lines) ? lines : [lines];
        setHistory(prev => [...prev, ...newLines]);
    };

    const handleCommand = async (cmd: string) => {
        const fullCmd = cmd.trim();

        if (ssh.sshSession) {
            if (fullCmd === 'clear') setHistory(['']);
            await ssh.sendInput(cmd + '\n');
            return;
        }

        if (!fullCmd) return;

        appendHistory(`vinco@system:~$ ${fullCmd}`);
        setCommandHistory(prev => [fullCmd, ...prev]);
        setHistoryIndex(-1);
        setIsProcessing(true);

        const result: CommandResult = await executeCommand(
            fullCmd,
            currentTheme,
            (n) => !!THEMES[n as ThemeName],
            sysContext
        );

        switch (result.type) {
            case 'SSH_CONNECT':
                ssh.connect(result.value.user, result.value.host);
                appendHistory(`Password for ${result.value.user}@${result.value.host}: `);
                break;
            case 'CLEAR':
                setHistory([]);
                break;
            case 'THEME':
                const nt = result.value as ThemeName;
                setCurrentTheme(nt);
                appendHistory(`SYSTEM: Theme changed to [${nt.toUpperCase()}]`);
                break;
            case 'EXIT':
                onClose();
                break;
            case 'PING':
                appendHistory(`PINGING ${fullCmd.split(' ')[1] || 'google.com'}...`);
                for (const line of result.value as string[]) {
                    await new Promise(r => setTimeout(r, 200));
                    appendHistory(line);
                }
                break;
            case 'OUTPUT':
                if (result.value) appendHistory(result.value);
                break;
            case 'EASTER_EGG':
                setIsEasterEgg(true);
                break;
        }
        setIsProcessing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (isProcessing) return;

        if (ssh.sshSession && !ssh.isAuthenticating && e.key === 'c' && e.ctrlKey) {
            handleCommand('\x03');
            return;
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            const next = historyIndex + 1;
            if (next < commandHistory.length) {
                setHistoryIndex(next);
                setInput(commandHistory[next]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            const next = historyIndex - 1;
            if (next >= 0) {
                setHistoryIndex(next);
                setInput(commandHistory[next]);
            } else {
                setHistoryIndex(-1);
                setInput('');
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            if (suggestion) setInput(suggestion);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isProcessing || (!input.trim() && !ssh.sshSession && !ssh.isAuthenticating)) return;
        if (ssh.isAuthenticating) {
            ssh.authenticate(input).then(success => {
                if (success) setHistory(['']);
            });
        }
        else handleCommand(input);
        setInput('');
    };

    return {
        input, setInput, history, theme, currentTheme, isProcessing,
        suggestion, isSecureInput: ssh.isSecureInput, sshSession: ssh.sshSession,
        inputRef, scrollRef, handleKeyDown, handleSubmit, isEasterEgg
    };
}
