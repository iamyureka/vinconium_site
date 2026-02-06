import { Client, ClientChannel } from 'ssh2';

interface SSHSession {
    client: Client;
    channel: ClientChannel;
    lastActive: number;
}

const globalSessions = global as unknown as { sshSessions: Map<string, SSHSession> };
if (!globalSessions.sshSessions) {
    globalSessions.sshSessions = new Map();
}

export const sessions = globalSessions.sshSessions;

export function cleanupSession(id: string) {
    const session = sessions.get(id);
    if (session) {
        try {
            session.channel.close();
        } catch (e) { }
        try {
            session.client.end();
        } catch (e) { }
        sessions.delete(id);
    }
}

setInterval(() => {
    const now = Date.now();
    for (const [id, session] of sessions.entries()) {
        if (now - session.lastActive > 60 * 60 * 1000) {
            cleanupSession(id);
        }
    }
}, 10 * 60 * 1000);
