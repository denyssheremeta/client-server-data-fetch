import React from 'react';
import { List, ListItem, ListItemText, Paper } from '@mui/material';

interface ResultsListProps {
  results: string[];
  listEndRef: React.RefObject<HTMLDivElement>;
}

export const ResultsList: React.FC<ResultsListProps> = ({
  results,
  listEndRef,
}) => (
  <Paper
    elevation={10}
    style={{
      maxWidth: '300px',
      margin: 'auto',
    }}
  >
    <List>
      {results.map((result, index) => (
        <ListItem key={index} divider style={{ paddingInline: '50px' }}>
          <ListItemText primary={result} />
        </ListItem>
      ))}
      <div ref={listEndRef} />
    </List>
  </Paper>
);
