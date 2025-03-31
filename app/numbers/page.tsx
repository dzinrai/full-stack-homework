import { Typography, Box, Paper } from '@mui/material';
import NumberForm from '../components/NumberForm';
import NumberPairsTable from '../components/NumberPairsTable';

export const dynamic = 'force-dynamic';

export default function NumbersPage() {
  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Numbers Management
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Add a New Number
        </Typography>
        <NumberForm />
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Number Pairs and Sums
        </Typography>
        <NumberPairsTable />
      </Paper>
    </Box>
  );
} 