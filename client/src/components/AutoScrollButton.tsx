import React from 'react';
import { Button } from '@mui/material';

interface AutoScrollButtonProps {
  autoScroll: boolean;
  toggleAutoScroll: () => void;
}

export const AutoScrollButton: React.FC<AutoScrollButtonProps> = React.memo(
  ({ autoScroll, toggleAutoScroll }) => (
    <Button
      variant="contained"
      color="secondary"
      onClick={toggleAutoScroll}
      style={{ position: 'fixed', top: '10px', right: '10px' }}
    >
      {autoScroll ? 'Disable AutoScroll' : 'Enable AutoScroll'}
    </Button>
  )
);
