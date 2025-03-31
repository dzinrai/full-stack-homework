'use client';

import { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Alert, 
  CircularProgress 
} from '@mui/material';

type NumberPair = {
  id1: string;
  number1: number;
  id2: string;
  number2: number;
  sum: number;
};

export default function NumberPairsTable() {
  const [pairs, setPairs] = useState<NumberPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const eventSource = new EventSource('/api/numbers/pairs/stream');

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.error) {
          setError(data.error);
        } else {
          setPairs(data);
          setError(null);
        }
      } catch (err) {
        setError('Failed to parse data');
      }
      setLoading(false);
    };

    eventSource.onerror = (err) => {
      console.error('EventSource error:', err);
      setError('Connection error');
      setLoading(false);
    };

    // Clean up on unmount
    return () => {
      eventSource.close();
    };
  }, []);

  if (loading && pairs.length === 0) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <TableContainer component={Paper}>
      <Table size="medium">
        <TableHead>
          <TableRow>
            <TableCell>ID 1</TableCell>
            <TableCell>Number 1</TableCell>
            <TableCell>ID 2</TableCell>
            <TableCell>Number 2</TableCell>
            <TableCell>Sum</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pairs.length > 0 ? (
            pairs.map((pair, index) => (
              <TableRow key={index}>
                <TableCell>{pair.id1}</TableCell>
                <TableCell>{pair.number1}</TableCell>
                <TableCell>{pair.id2}</TableCell>
                <TableCell>{pair.number2}</TableCell>
                <TableCell>{pair.sum}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No number pairs available. Add at least two numbers to see pairs.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
} 