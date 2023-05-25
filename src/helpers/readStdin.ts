module.exports = async () => {
  return await new Promise((resolve) => {
    // Set encoding for standard input
    process.stdin.setEncoding('utf8');

    let inputData = '';

    // Update inputData with each chunk read from standard input stream
    process.stdin.on('data', (chunk) => {
      inputData = `${inputData}${chunk.toString()}`;
    });

    // Resolve the promise with inputData when end of standard input stream is reached
    process.stdin.on('end', () => {
      resolve(inputData);
    });

    // Start reading from standard input stream
    process.stdin.resume();
  });
};
