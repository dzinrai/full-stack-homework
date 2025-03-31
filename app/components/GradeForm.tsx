'use client';

import { useState, useRef } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Alert, 
  CircularProgress, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  SelectChangeEvent 
} from '@mui/material';
import { addGrade } from '../actions/gradeActions';

type ClassType = 'Math' | 'Science' | 'History';

export default function GradeForm() {
  const [classValue, setClassValue] = useState<ClassType | ''>('');
  const [grade, setGrade] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleClassChange = (event: SelectChangeEvent) => {
    setClassValue(event.target.value as ClassType);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    try {
      if (!classValue) {
        throw new Error('Please select a class');
      }

      const gradeValue = parseInt(grade, 10);
      if (isNaN(gradeValue)) {
        throw new Error('Please enter a valid grade');
      }

      if (gradeValue < 0 || gradeValue > 100) {
        throw new Error('Grade must be between 0 and 100');
      }

      // Create FormData and submit to server action
      const formData = new FormData();
      formData.append('class', classValue);
      formData.append('grade', grade);

      const result = await addGrade(formData);

      if (!result.success) {
        throw new Error(result.error || 'Failed to add grade');
      }

      setClassValue('');
      setGrade('');
      setSuccess(true);
      
      // Reset form
      if (formRef.current) {
        formRef.current.reset();
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box component="form" ref={formRef} onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>Grade added successfully!</Alert>}
      
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
        <FormControl fullWidth required>
          <InputLabel id="class-select-label">Class</InputLabel>
          <Select
            labelId="class-select-label"
            value={classValue}
            label="Class"
            name="class"
            onChange={handleClassChange}
          >
            <MenuItem value="Math">Math</MenuItem>
            <MenuItem value="Science">Science</MenuItem>
            <MenuItem value="History">History</MenuItem>
          </Select>
        </FormControl>
        
        <TextField
          label="Grade"
          type="number"
          name="grade"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          required
          fullWidth
          placeholder="Enter a grade (0-100)"
        />
      </Box>
      
      <Button 
        type="submit" 
        variant="contained" 
        disabled={isLoading}
      >
        {isLoading ? <CircularProgress size={24} /> : 'Add Grade'}
      </Button>
    </Box>
  );
} 