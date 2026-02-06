import { NextRequest } from 'next/server';
import { sessions } from '@/lib/ssh/session-manager';
import { stripAnsi } from '@/lib/terminal/utils';

export async function GET(req: NextRequest) {
    const sessionId = req.nextUrl.searchParams.get('sessionId');
    const session = sessionId ? sessions.get(sessionId) : null;

    if (!session) {
        return new Response('Session not found', { status: 404 });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        start(controller) {
            let isClosed = false;
            let keepAlive: NodeJS.Timeout;

            const onData = (data: Buffer) => {
                if (isClosed) return;
                session.lastActive = Date.now();
                try {
                    const clean = stripAnsi(data.toString());
                    if (clean) {
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify(clean)}\n\n`));
                    }
                } catch (e) {
                    onClose();
                }
            };

            const onClose = () => {
                if (isClosed) return;
                isClosed = true;
                if (keepAlive) clearInterval(keepAlive);

                session.channel.off('data', onData);
                session.channel.off('close', onClose);

                try {
                    controller.close();
                } catch (e) {
                }
            };

            session.channel.on('data', onData);
            session.channel.on('close', onClose);

            keepAlive = setInterval(() => {
                if (isClosed) return;
                try {
                    controller.enqueue(encoder.encode(': keep-alive\n\n'));
                } catch (e) {
                    onClose();
                }
            }, 15000);

            req.signal.addEventListener('abort', () => {
                onClose();
            });
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}
