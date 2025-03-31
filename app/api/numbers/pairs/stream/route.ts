import { NextRequest } from 'next/server';
import sql from '@/app/lib/db';

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const sendData = async () => {
        try {
          const query = `
            SELECT 
              n1.id as id1, n1.value as number1,
              n2.id as id2, n2.value as number2,
              (n1.value + n2.value) as sum
            FROM "Number" n1
            CROSS JOIN "Number" n2
            WHERE n1.id < n2.id
            ORDER BY n1.id, n2.id
          `;
          const result = await sql.unsafe(query);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(result)}\n\n`));
        } catch (error) {
          console.error('Error fetching pairs:', error);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Failed to fetch pairs' })}\n\n`));
        }
      };

      await sendData();

      const interval = setInterval(sendData, 5000);

      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
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