// This file can be used for any setup needed before tests run
const { spawn } = require('child_process');
const path = require('path');

// Start the server before tests
module.exports = async () => {
  console.log('Starting server for tests...');
  
  // You can uncomment this if you want to start the server automatically
  // But for now, we'll assume the server is already running
  
  /*
  const serverPath = path.join(__dirname, '../index.js');
  const server = spawn('node', [serverPath], {
    stdio: 'inherit',
    detached: true
  });
  
  // Store the server process to kill it after tests
  global.__SERVER__ = server;
  
  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 3000));
  */
};

// Clean up after tests
module.exports.teardown = async () => {
  console.log('Cleaning up after tests...');
  
  // Kill the server if we started it
  /*
  if (global.__SERVER__) {
    process.kill(-global.__SERVER__.pid);
  }
  */
};