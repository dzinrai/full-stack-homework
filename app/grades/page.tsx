import { Typography, Box, Paper } from '@mui/material';
import GradeForm from '../components/GradeForm';
import GradesDataTable from '../components/GradesDataTable';

export const dynamic = 'force-dynamic';

export default function GradesPage() {
  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Grades Management
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Add a New Grade
        </Typography>
        <GradeForm />
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Grades Data
        </Typography>
        <GradesDataTable />
      </Paper>
    </Box>
  );
} 