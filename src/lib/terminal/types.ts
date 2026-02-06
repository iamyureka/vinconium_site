export type ThemeName = 'matrix' | 'neon' | 'amber' | 'ghost';

export interface ThemeStyles {
    text: string;
    border: string;
    bg: string;
    accent: string;
    caret: string;
    glow: string;
}

export interface TerminalProps {
    onClose: () => void;
}

export interface SystemInfo {
    os: string;
    host: string;
    kernel: string;
    uptime: string;
    cpu: string;
    gpu: string;
    memory: string;
    theme: string;
}

export type ActionType = 'OUTPUT' | 'CLEAR' | 'THEME' | 'EXIT' | 'PING' | 'SSH_CONNECT' | 'EASTER_EGG';

export interface CommandResult {
    type: ActionType;
    value?: string[] | string | any;
}

export interface SSHSessionInfo {
    id: string;
    user: string;
    host: string;
    isSecure: boolean;
}
