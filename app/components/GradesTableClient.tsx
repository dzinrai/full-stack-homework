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
  CircularProgress,
  Button,
  Stack,
  Typography
} from '@mui/material';

type GradeItem = {
  id: string;
  class: 'Math' | 'Science' | 'History';
  grade: number;
};

type AverageItem = {
  class: 'Math' | 'Science' | 'History';
  average: number | null;
};

type DisplayMode = 'all' | 'averages' | 'passing' | 'high';

export default function GradesTableClient() {
  const [data, setData] = useState<GradeItem[] | AverageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayMode, setDisplayMode] = useState<DisplayMode>('all');

  useEffect(() => {
    setLoading(true);
    let endpoint;
    switch (displayMode) {
      case 'all':
        endpoint = '/api/grades';
        break;
      case 'averages':
        endpoint = '/api/grades/averages';
        break;
      case 'passing':
        endpoint = '/api/grades/passing';
        break;
      case 'high':
        endpoint = '/api/grades/high-performing';
        break;
      default:
        endpoint = '/api/grades';
    }

    // Create EventSource with credentials
    const eventSource = new EventSource(endpoint, { withCredentials: true });

    eventSource.onmessage = (event) => {
      try {
        const responseData = JSON.parse(event.data);
        if (responseData.error) {
          setError(responseData.error);
        } else {
          console.log('responseData', responseData);
          
          // Ensure average values are numbers
          if (displayMode !== 'all') {
            const processedData = responseData.map((item: AverageItem) => ({
              ...item,
              average: typeof item.average === 'number' ? item.average : null
            }));
            setData(processedData);
          } else {
            setData(responseData);
          }
          setError(null);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to parse data');
      }
      setLoading(false);
    };

    eventSource.onerror = (err) => {
      console.error('EventSource error:', err);
      setError('Connection error');
      setLoading(false);
    };

    // Clean up on unmount or when displayMode changes
    return () => {
      eventSource.close();
    };
  }, [displayMode]);

  const handleDisplayModeChange = (mode: DisplayMode) => {
    setDisplayMode(mode);
  };

  const renderTableContent = () => {
    if (displayMode === 'all') {
      return (
        <>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Grade</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(data as GradeItem[]).length > 0 ? (
              (data as GradeItem[]).map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.class}</TableCell>
                  <TableCell>{item.grade}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No grades data available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </>
      );
    } else {
      return (
        <>
          <TableHead>
            <TableRow>
              <TableCell>Class</TableCell>
              <TableCell>Average Grade</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(data as AverageItem[]).length > 0 ? (
              (data as AverageItem[]).map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.class}</TableCell>
                  <TableCell>
                    {item.average ? item.average.toFixed(2) : 'N/A'}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  No average data available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </>
      );
    }
  };

  return (
    <div>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 3 }}>
        <Button 
          variant={displayMode === 'all' ? 'contained' : 'outlined'} 
          onClick={() => handleDisplayModeChange('all')}
        >
          Show All Data
        </Button>
        <Button 
          variant={displayMode === 'averages' ? 'contained' : 'outlined'} 
          onClick={() => handleDisplayModeChange('averages')}
        >
          Class Averages
        </Button>
        <Button 
          variant={displayMode === 'passing' ? 'contained' : 'outlined'} 
          onClick={() => handleDisplayModeChange('passing')}
        >
          Passing Average
        </Button>
        <Button 
          variant={displayMode === 'high' ? 'contained' : 'outlined'} 
          onClick={() => handleDisplayModeChange('high')}
        >
          High Performing Classes
        </Button>
      </Stack>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
            {displayMode === 'all' && 'Showing all grades'}
            {displayMode === 'averages' && 'Showing average grade per class'}
            {displayMode === 'passing' && 'Showing class averages for grades > 55'}
            {displayMode === 'high' && 'Showing classes with averages > 70'}
          </Typography>
          <TableContainer component={Paper}>
            <Table size="medium">
              {renderTableContent()}
            </Table>
          </TableContainer>
        </>
      )}
    </div>
  );
} 