import React, { useState } from 'react';
import { Button, TextField, Typography, List, ListItem } from '@mui/material';
import ThemeProvider from './ThemeProvider';

const App: React.FC = () => {
  // State to store the concurrency value (number of simultaneous requests)
  const [concurrency, setConcurrency] = useState<number>(0);
  // State to track if the requests have started
  const [isStarted, setIsStarted] = useState<boolean>(false);
  // State to store the results of the requests
  const [results, setResults] = useState<string[]>([]);

  // Function to handle the start button click
  const handleStart = () => {
    // Validate concurrency input
    if (concurrency < 1 || concurrency > 100) {
      alert('Please enter a valid number between 1 and 100.');
      return;
    }

    // Set the state to indicate that requests have started
    setIsStarted(true);
    // Clear previous results
    setResults([]);
    // Start sending requests
    fetchRequests(concurrency);
  };

  // Function to manage sending requests with a given concurrency
  const fetchRequests = async (concurrency: number) => {
    const totalRequests = 1000; // Total number of requests to send
    let activeRequests = 0; // Number of currently active requests
    let completedRequests = 0; // Number of completed requests

    // Function to send an individual request
    const sendRequest = async (index: number) => {
      try {
        // Send the request to the API endpoint
        const response = await fetch(`/api?index=${index}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Parse the response data
        const data = await response.json();
        // Render the result on successful response
        renderResult(data.index);
      } catch (error) {
        console.error('Request failed:', error);
      } finally {
        // Update active and completed request counts
        completedRequests += 1;
        activeRequests -= 1;

        // Schedule the next request if there are remaining requests
        if (completedRequests < totalRequests) {
          scheduleNextRequest();
        }
      }
    };

    // Function to schedule the next request
    const scheduleNextRequest = () => {
      if (activeRequests < concurrency && completedRequests < totalRequests) {
        const nextIndex = completedRequests + 1; // Use the next index
        activeRequests += 1;
        // Send the request with a delay based on concurrency
        setTimeout(() => {
          sendRequest(nextIndex);
        }, 1000 / concurrency);
      }
    };

    // Initial requests launch
    for (let i = 0; i < concurrency; i++) {
      scheduleNextRequest();
    }
  };

  // Function to render the result in the results list
  const renderResult = (index: number) => {
    setResults((prevResults) => [...prevResults, `Request ${index} completed`]);
  };

  return (
    <ThemeProvider>
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Client-Server Data Fetch
        </Typography>
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
          onClick={handleStart}
          disabled={isStarted}
          style={{ margin: '20px' }}
        >
          Start
        </Button>
        <div style={{ marginInline: 'auto', width: 'max-content' }}>
          <List>
            {results.map((result, index) => (
              <ListItem key={index}>{result}</ListItem>
            ))}
          </List>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
