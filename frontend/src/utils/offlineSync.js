/**
 * Lightweight local offline sync utility.
 * Queues API requests in localStorage and dispatches them when online.
 */

const SYNC_QUEUE_KEY = 'sayansi_sync_queue';

export const queueOfflineRequest = (url, method, data) => {
  try {
    const queue = JSON.parse(localStorage.getItem(SYNC_QUEUE_KEY) || '[]');
    queue.push({
      url,
      method,
      data,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
    console.log('[Offline Sync] Request queued:', url);
  } catch (e) {
    console.error('Failed to queue offline request:', e);
  }
};

export const syncOfflineData = async () => {
  if (!navigator.onLine) return;
  
  const queue = JSON.parse(localStorage.getItem(SYNC_QUEUE_KEY) || '[]');
  if (queue.length === 0) return;

  console.log(`[Offline Sync] Attempting to sync ${queue.length} items...`);
  
  const failedQueue = [];

  for (const item of queue) {
    try {
      const res = await fetch(item.url, {
        method: item.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: item.data ? JSON.stringify(item.data) : undefined,
      });
      
      if (!res.ok) {
        throw new Error('Sync failed with status: ' + res.status);
      }
      console.log('[Offline Sync] Successfully synced:', item.url);
    } catch (e) {
      console.error('[Offline Sync] Failed to sync item:', item, e);
      failedQueue.push(item);
    }
  }

  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(failedQueue));
};

// Listen for connection restoration
window.addEventListener('online', () => {
  console.log('[Offline Sync] Network restored. Syncing data...');
  syncOfflineData();
});
