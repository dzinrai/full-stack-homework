'use client';

import { useState } from 'react';
import { TextField, Button, Box, Alert, CircularProgress } from '@mui/material';
import { addNumber } from '../actions/addNumber';

export default function NumberForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const result = await addNumber(formData);
    
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
    
    setIsLoading(false);
  }

  return (
    <Box component="form" action={handleSubmit} sx={{ mt: 2 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>Number added successfully!</Alert>}
      
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <TextField
          name="value"
          label="Number"
          type="number"
          required
          fullWidth
          placeholder="Enter a positive or negative integer"
        />
        
        <Button 
          type="submit" 
          variant="contained" 
          disabled={isLoading} 
          sx={{ height: 56 }}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Add Number'}
        </Button>
      </Box>
    </Box>
  );
} 