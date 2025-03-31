import { NextRequest, NextResponse } from 'next/server';
import sql from '@/app/lib/db';

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const query = `
          SELECT class, ROUND(AVG(grade)::numeric, 2) as average
          FROM "Grade"
          GROUP BY class
          ORDER BY class
        `;

        const fetchAndSendData = async () => {
          const result = await sql.unsafe(query);
          console.log('result', result);
          const parsedResult = result.map(row => ({
            class: row.class,
            average: Number(row.average)
          }));
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(parsedResult)}\n\n`));
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
        console.error('Error in SSE averages:', error);
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