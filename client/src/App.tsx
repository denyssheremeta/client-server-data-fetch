import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Box,
} from '@mui/material';
import { ThemeProvider } from './ThemeProvider';

export const App: React.FC = () => {
  // State to manage the concurrency level
  const [concurrency, setConcurrency] = useState<number>(0);
  // State to check if the process has started
  const [isStarted, setIsStarted] = useState<boolean>(false);
  // State to store the results of the requests
  const [results, setResults] = useState<string[]>([]);
  // State to manage auto-scroll feature
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  // Ref to handle the end of the list for auto-scroll
  const listEndRef = useRef<HTMLDivElement | null>(null);

  // Function to handle the start of the requests
  const handleStart = () => {
    if (concurrency < 1 || concurrency > 100) {
      alert('Please enter a valid number between 1 and 100.');
      return;
    }

    setIsStarted(true);
    setResults([]);
    fetchRequests(concurrency);
  };

  // Function to fetch requests with given concurrency
  const fetchRequests = async (concurrency: number) => {
    const totalRequests = 1000;
    let activeRequests = 0;
    let completedRequests = 0;

    // Function to send individual request
    const sendRequest = async (index: number) => {
      try {
        const response = await fetch(`/api?index=${index}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        renderResult(data.index);
      } catch (error) {
        console.error('Request failed:', error);
      } finally {
        completedRequests += 1;
        activeRequests -= 1;
        if (completedRequests < totalRequests) {
          scheduleNextRequest();
        } else if (completedRequests === totalRequests) {
          setIsStarted(false);
        }
      }
    };

    // Function to schedule the next request
    const scheduleNextRequest = () => {
      if (activeRequests < concurrency && completedRequests < totalRequests) {
        const nextIndex = completedRequests + 1;
        activeRequests += 1;
        setTimeout(() => {
          sendRequest(nextIndex);
        }, 1000 / concurrency);
      }
    };

    // Initial scheduling of requests based on concurrency
    for (let i = 0; i < concurrency; i++) {
      scheduleNextRequest();
    }
  };

  // Function to render the result of a completed request
  const renderResult = (index: number) => {
    setResults((prevResults) => [...prevResults, `Request ${index} completed`]);
  };

  // Function to handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleStart();
  };

  // Use effect to handle auto-scroll when results are updated
  useEffect(() => {
    if (autoScroll && listEndRef.current) {
      listEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [results, autoScroll]);

  // Function to toggle auto-scroll
  const toggleAutoScroll = () => {
    setAutoScroll(!autoScroll);
  };

  return (
    <ThemeProvider>
      <Box textAlign="center" padding="20px">
        <Typography variant="h4" gutterBottom>
          Client-Server Data Fetch
        </Typography>
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
        {results.length > 0 && (
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
        )}
        <Button
          variant="contained"
          color="secondary"
          onClick={toggleAutoScroll}
          style={{ position: 'fixed', top: '10px', right: '10px' }}
        >
          {autoScroll ? 'Disable AutoScroll' : 'Enable AutoScroll'}
        </Button>
      </Box>
    </ThemeProvider>
  );
};
