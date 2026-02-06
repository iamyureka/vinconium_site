import { NextRequest, NextResponse } from 'next/server';
import { sessions } from '@/lib/ssh/session-manager';

export async function POST(req: NextRequest) {
    try {
        const { sessionId, input } = await req.json();
        const session = sessionId ? sessions.get(sessionId) : null;

        if (!session) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        session.lastActive = Date.now();
        session.channel.write(input);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to write input' }, { status: 500 });
    }
}
