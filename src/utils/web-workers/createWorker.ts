export const createWorker = <TRequest = any, TResponse = any>(
  workerFactory: () => Worker
) => {
  return (message: TRequest): Promise<TResponse> =>
    new Promise((resolve, reject) => {
      const worker = workerFactory();

      worker.onmessage = (e) => {
        resolve(e.data);
        worker.terminate();
      };

      worker.onerror = reject;
      worker.postMessage(message);
    });
};
