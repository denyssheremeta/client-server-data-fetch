import axios from 'axios';

import { TOTAL_REQUESTS, MILLISECOND } from './constants';
import { getBaseUrl } from './getBaseUrl';

// Function to send an individual request
const sendRequest = async (
  index: number,
  baseUrl: string,
  setResults: React.Dispatch<React.SetStateAction<string[]>>,
  scheduleNextRequest: () => void,
  completedRequests: { count: number },
  activeRequests: { count: number },
  setIsStarted: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    const response = await axios.get(`${baseUrl}/api`, { params: { index } });
    setResults((prevResults) => [
      ...prevResults,
      `Request ${response.data.index} completed`,
    ]);
  } catch (error) {
    console.error('Request failed:', error);
  } finally {
    completedRequests.count += 1;
    activeRequests.count -= 1;
    if (completedRequests.count < TOTAL_REQUESTS) {
      scheduleNextRequest();
    } else if (completedRequests.count === TOTAL_REQUESTS) {
      setIsStarted(false);
    }
  }
};

// Function to schedule the next request
const scheduleNextRequest = (
  concurrency: number,
  requestQueue: number[],
  baseUrl: string,
  setResults: React.Dispatch<React.SetStateAction<string[]>>,
  completedRequests: { count: number },
  activeRequests: { count: number },
  setIsStarted: React.Dispatch<React.SetStateAction<boolean>>,
  requestsPerSecond: number
) => {
  if (activeRequests.count < concurrency && requestQueue.length > 0) {
    const nextIndex = requestQueue.shift()!;
    activeRequests.count += 1;

    setTimeout(() => {
      sendRequest(
        nextIndex,
        baseUrl,
        setResults,
        () =>
          scheduleNextRequest(
            concurrency,
            requestQueue,
            baseUrl,
            setResults,
            completedRequests,
            activeRequests,
            setIsStarted,
            requestsPerSecond
          ),
        completedRequests,
        activeRequests,
        setIsStarted
      );
    }, MILLISECOND / requestsPerSecond);
  }
};

// Main function to fetch requests with given concurrency and rate limit
export const fetchRequests = async (
  concurrency: number,
  setResults: React.Dispatch<React.SetStateAction<string[]>>,
  setIsStarted: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const baseUrl = getBaseUrl();
  const requestQueue: number[] = Array.from(
    { length: TOTAL_REQUESTS },
    (_, i) => i + 1
  );

  const completedRequests = { count: 0 };
  const activeRequests = { count: 0 };

  for (let i = 0; i < concurrency; i++) {
    scheduleNextRequest(
      concurrency,
      requestQueue,
      baseUrl,
      setResults,
      completedRequests,
      activeRequests,
      setIsStarted,
      concurrency // Use concurrency as the requests per second limit
    );
  }
};
