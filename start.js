#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🎬 Starting FrameFetch Development Environment...\n');

// Function to run command and stream output
function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Command failed with exit code ${code}`));
      } else {
        resolve();
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function startDevelopment() {
  try {
    console.log('📦 Installing frontend dependencies...');
    await runCommand('npm', ['install']);
    
    console.log('\n🐍 Installing backend dependencies...');
    await runCommand('pip', ['install', '-r', 'requirements.txt'], {
      cwd: path.join(process.cwd(), 'backend')
    });
    
    console.log('\n🚀 Starting development servers...');
    console.log('Frontend: http://localhost:3000');
    console.log('Backend: http://localhost:8000');
    console.log('\nPress Ctrl+C to stop both servers\n');
    
    // Start both servers concurrently
    const frontend = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      shell: true
    });
    
    const backend = spawn('npm', ['run', 'backend'], {
      stdio: 'inherit', 
      shell: true
    });
    
    // Handle cleanup on exit
    process.on('SIGINT', () => {
      console.log('\n\n🛑 Shutting down servers...');
      frontend.kill();
      backend.kill();
      process.exit(0);
    });
    
    // Wait for either to exit
    await Promise.race([
      new Promise((resolve, reject) => {
        frontend.on('close', (code) => {
          if (code !== 0) reject(new Error('Frontend server failed'));
          else resolve();
        });
      }),
      new Promise((resolve, reject) => {
        backend.on('close', (code) => {
          if (code !== 0) reject(new Error('Backend server failed'));
          else resolve();
        });
      })
    ]);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

startDevelopment();