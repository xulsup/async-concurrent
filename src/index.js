/**
 * @desc the method of concurrency control
 * @param {Array<any>} array
 * @param {function} iterator
 * @param {number} concurrency - number of concurrent tasks
 */
async function asyncConcurrent(array, iterator, concurrency = 5) {
  const allAsyncTasks = [];
  const executingAsyncTasks = [];
  const executeResult = {};
  for (const [index, item] of array.entries()) {
    const asyncTask = Promise.resolve()
      .then(() => iterator(item, index, array))
      .then((value) => {
        executeResult[index] = { status: 'fulfilled', value };
      })
      .catch((error) => {
        executeResult[index] = { status: 'rejected', error };
      })
      .finally(() => {
        executingAsyncTasks.splice(executingAsyncTasks.indexOf(asyncTask), 1);
      });
    allAsyncTasks.push(asyncTask)
    if (concurrency <= array.length) {
      executingAsyncTasks.push(asyncTask);
      if (executingAsyncTasks.length >= concurrency) {
        await Promise.race(executingAsyncTasks);
      }
    }
  }
  await Promise.all(allAsyncTasks);
  return array.map((_, index) => executeResult[index]);
}

module.exports = asyncConcurrent
