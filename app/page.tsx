import { Typography, Paper, Box, List, ListItem } from '@mui/material';

export default function Home() {
  return (
    <Box sx={{ my: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Alison Full Stack Developer Assessment
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Welcome to the Alison Full Stack Assessment application. This application demonstrates proficiency in:
        </Typography>
        <List>
          <ListItem>• Frontend development with React and Next.js</ListItem>
          <ListItem>• Raw SQL database operations</ListItem>
          <ListItem>• Data visualization</ListItem>
          <ListItem>• Form handling and validation</ListItem>
        </List>
      </Paper>
    </Box>
  );
}
