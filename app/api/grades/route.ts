import { NextRequest } from 'next/server';
import sql from '@/app/lib/db';

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const query = 'SELECT * FROM "Grade" ORDER BY id';
        let lastData: string | null = null;

        const fetchAndSendData = async () => {
          const result = await sql.unsafe(query);
          console.log('result', result);
          
          const currentData = JSON.stringify(result);
          
          if (currentData !== lastData) {
            controller.enqueue(encoder.encode(`data: ${currentData}\n\n`));
            lastData = currentData;
          }
        };

        await fetchAndSendData();

        const pollInterval = setInterval(fetchAndSendData, 5000);
        
        const keepAlive = setInterval(() => {
          controller.enqueue(encoder.encode(': keepalive\n\n'));
        }, 30000);

        request.signal.addEventListener('abort', () => {
          clearInterval(pollInterval);
          clearInterval(keepAlive);
          controller.close();
        });
      } catch (error: any) {
        console.error('Error in SSE grades:', error);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: error.message })}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
} 