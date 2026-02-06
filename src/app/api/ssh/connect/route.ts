import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'ssh2';
import { sessions } from '@/lib/ssh/session-manager';

export async function POST(req: NextRequest) {
    try {
        const { host, user, password } = await req.json();

        if (!host || !user || !password) {
            return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
        }

        return new Promise((resolve) => {
            const conn = new Client();
            const sessionId = Math.random().toString(36).substring(7);

            conn.on('ready', () => {
                conn.shell({ term: 'xterm-256color' }, (err, stream) => {
                    if (err) {
                        conn.end();
                        return resolve(NextResponse.json({ error: 'Failed to open shell' }, { status: 500 }));
                    }

                    sessions.set(sessionId, {
                        client: conn,
                        channel: stream,
                        lastActive: Date.now(),
                    });

                    resolve(NextResponse.json({ sessionId }));
                });
            }).on('error', (err) => {
                resolve(NextResponse.json({ error: err.message || 'Connection failed' }, { status: 500 }));
            }).connect({
                host,
                port: 22,
                username: user,
                password,
                readyTimeout: 10000,
            });
        });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
