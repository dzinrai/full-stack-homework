import { NextRequest } from 'next/server';
import { POST, GET } from '../app/api/numbers/route';
import sql from '../app/lib/db';

// Mock the database module
jest.mock('../app/lib/db', () => ({
  unsafe: jest.fn(),
}));

describe('Numbers API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/numbers', () => {
    it('should successfully add a number', async () => {
      const mockNumber = { id: '123', value: 42 };
      (sql.unsafe as jest.Mock).mockResolvedValueOnce([mockNumber]);

      const request = new NextRequest('http://localhost:3000/api/numbers', {
        method: 'POST',
        body: JSON.stringify({ value: 42 }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual(mockNumber);
      expect(sql.unsafe).toHaveBeenCalledWith(
        'INSERT INTO "Number" (id, value) VALUES (gen_random_uuid(), $1) RETURNING *',
        [42]
      );
    });

    it('should return 400 for missing value', async () => {
      const request = new NextRequest('http://localhost:3000/api/numbers', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('Value is required');
    });

    it('should return 400 for invalid integer', async () => {
      const request = new NextRequest('http://localhost:3000/api/numbers', {
        method: 'POST',
        body: JSON.stringify({ value: 'not-a-number' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('Value must be a valid integer');
    });
  });

  describe('GET /api/numbers', () => {
    it('should return all numbers', async () => {
      const mockNumbers = [
        { id: '1', value: 42 },
        { id: '2', value: 24 },
      ];
      (sql.unsafe as jest.Mock).mockResolvedValueOnce(mockNumbers);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockNumbers);
      expect(sql.unsafe).toHaveBeenCalledWith('SELECT * FROM "Number" ORDER BY id');
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      (sql.unsafe as jest.Mock).mockRejectedValueOnce(error);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.message).toBe('Failed to get numbers');
      expect(data.error).toBe('Database error');
    });
  });
}); 