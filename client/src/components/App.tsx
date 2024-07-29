import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Typography, Box } from '@mui/material';

import { RequestForm } from './RequestForm';
import { ResultsList } from './ResultsList';
import { AutoScrollButton } from './AutoScrollButton';
import { fetchRequests } from '../utils/fetchRequests';
import { ThemeProvider } from './ThemeProvider';

// Helper function to validate concurrency value
const validateConcurrency = (value: number): boolean =>
  value >= 1 && value <= 100;

export const App: React.FC = () => {
  const [concurrency, setConcurrency] = useState<number>(0);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [results, setResults] = useState<string[]>([]);
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const listEndRef = useRef<HTMLDivElement | null>(null);

  // Callback to handle starting the requests
  const handleStart = useCallback(() => {
    if (!validateConcurrency(concurrency)) {
      // Display error message or handle invalid concurrency value
      alert('Please enter a valid number between 1 and 100.');
      return;
    }

    setIsStarted(true);
    setResults([]);
    // Fetch requests with the given concurrency level
    fetchRequests(concurrency, setResults, () => setIsStarted(false));
  }, [concurrency]);

  // Effect to handle auto-scroll when results are updated
  useEffect(() => {
    if (autoScroll && listEndRef.current) {
      listEndRef.current.scrollIntoView({ behavior: 'auto' });
    }
  }, [results, autoScroll]);

  // Callback to toggle auto-scroll feature
  const toggleAutoScroll = useCallback(() => {
    setAutoScroll((prev) => !prev);
  }, []);

  return (
    <ThemeProvider>
      <Box textAlign="center" padding="20px">
        <Typography variant="h4" gutterBottom>
          Client-Server Data Fetch
        </Typography>
        {/* Form for starting the requests */}
        <RequestForm
          concurrency={concurrency}
          isStarted={isStarted}
          setConcurrency={setConcurrency}
          handleSubmit={(event) => {
            event.preventDefault();
            handleStart();
          }}
        />
        {/* List of results */}
        {results.length > 0 && (
          <ResultsList results={results} listEndRef={listEndRef} />
        )}
        {/* Button to toggle auto-scroll */}
        <AutoScrollButton
          autoScroll={autoScroll}
          toggleAutoScroll={toggleAutoScroll}
        />
      </Box>
    </ThemeProvider>
  );
};
