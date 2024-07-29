import React from 'react';
import { Button, TextField } from '@mui/material';

interface RequestFormProps {
  concurrency: number;
  isStarted: boolean;
  setConcurrency: (value: number) => void;
  handleSubmit: (event: React.FormEvent) => void;
}

export const RequestForm: React.FC<RequestFormProps> = ({
  concurrency,
  isStarted,
  setConcurrency,
  handleSubmit,
}) => (
  <form onSubmit={handleSubmit}>
    <TextField
      label="Concurrency (1-100)"
      type="number"
      InputProps={{ inputProps: { min: 1, max: 100 } }}
      value={concurrency}
      onChange={(e) => setConcurrency(Number(e.target.value))}
      required
      variant="outlined"
      style={{ margin: '10px', width: '160px' }}
    />
    <Button
      variant="contained"
      color="primary"
      type="submit"
      disabled={isStarted}
      style={{ margin: '20px' }}
    >
      Start
    </Button>
  </form>
);
