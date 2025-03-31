import { NextRequest } from 'next/server';
import { GET } from '../app/api/grades/route';
import sql from '../app/lib/db';

// Mock the database module
jest.mock('../app/lib/db', () => ({
  unsafe: jest.fn(),
}));

describe('Grades API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('GET /api/grades', () => {
    it('should establish SSE connection and send initial data', async () => {
      const mockGrades = [
        { id: '1', grade: 85 },
        { id: '2', grade: 92 },
      ];
      (sql.unsafe as jest.Mock).mockResolvedValueOnce(mockGrades);

      const request = new NextRequest('http://localhost:3000/api/grades');
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('text/event-stream');
      expect(response.headers.get('Cache-Control')).toBe('no-cache');
      expect(response.headers.get('Connection')).toBe('keep-alive');

      // Get the stream and read the first chunk
      const reader = response.body?.getReader();
      const { value } = await reader!.read();
      const text = new TextDecoder().decode(value);
      
      expect(text).toContain(`data: ${JSON.stringify(mockGrades)}`);
      reader?.cancel();
    });

    it('should handle database errors gracefully', async () => {
      const error = new Error('Database error');
      (sql.unsafe as jest.Mock).mockRejectedValueOnce(error);

      const request = new NextRequest('http://localhost:3000/api/grades');
      const response = await GET(request);

      const reader = response.body?.getReader();
      const { value } = await reader!.read();
      const text = new TextDecoder().decode(value);
      
      expect(text).toContain(`data: ${JSON.stringify({ error: 'Database error' })}`);
      reader?.cancel();
    });

    it('should send keepalive messages every 30 seconds', async () => {
      const mockGrades = [{ id: '1', grade: 85 }];
      (sql.unsafe as jest.Mock).mockResolvedValue(mockGrades);

      const request = new NextRequest('http://localhost:3000/api/grades');
      const response = await GET(request);
      const reader = response.body?.getReader();

      // Read initial data
      await reader!.read();

      // Fast forward 30 seconds
      jest.advanceTimersByTime(30000);

      // Read keepalive message
      const { value } = await reader!.read();
      const text = new TextDecoder().decode(value);
      
      expect(text).toContain(': keepalive');
      reader?.cancel();
    });

    it('should poll for new data every 5 seconds', async () => {
      const initialGrades = [{ id: '1', grade: 85 }];
      const updatedGrades = [{ id: '1', grade: 90 }];
      
      (sql.unsafe as jest.Mock)
        .mockResolvedValueOnce(initialGrades)
        .mockResolvedValueOnce(updatedGrades);

      const request = new NextRequest('http://localhost:3000/api/grades');
      const response = await GET(request);
      const reader = response.body?.getReader();

      // Read initial data
      await reader!.read();

      // Fast forward 5 seconds
      jest.advanceTimersByTime(5000);
      await Promise.resolve(); // Let any pending promises resolve

      // Read updated data
      const { value } = await reader!.read();
      const text = new TextDecoder().decode(value);
      
      expect(text).toContain(`data: ${JSON.stringify(updatedGrades)}`);
      reader?.cancel();
    });

    it('should close connection when request is aborted', async () => {
      const controller = new AbortController();
      const request = new NextRequest('http://localhost:3000/api/grades', {
        signal: controller.signal,
      });
      const response = await GET(request);
      const reader = response.body?.getReader();

      // Read initial data
      await reader!.read();

      // Abort the request
      controller.abort();
      await Promise.resolve(); // Let any pending promises resolve

      // Try to read after abort
      const { done } = await reader!.read();
      expect(done).toBe(true);
    });
  });
}); 