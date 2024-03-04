const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

let lastGeneratedTime = null; // Variable to store the timestamp of the last generation
let lastGeneratedNumbers = null; // Variable to store the last generated lottery numbers

// Function to generate lottery numbers
function generateLotteryNumbers() {
    // Generate 6 random numbers between 1 and 49
    return Array.from({ length: 6 }, () => Math.floor(Math.random() * 49) + 1);
}

// Function to check if 24 hours have passed since the last generation
function is24HoursPassed() {
    if (!lastGeneratedTime) return true; // If never generated, return true
    const currentTime = new Date().getTime();
    return (currentTime - lastGeneratedTime) >= (24 * 60 * 60 * 1000); // Check if 24 hours have passed
}

// WebSocket connection for real-time updates
io.on('connection', (socket) => {
    console.log('A user connected');

    // Send lottery numbers to the client
    if (is24HoursPassed()) {
        lastGeneratedNumbers = generateLotteryNumbers(); // Generate new numbers
        lastGeneratedTime = new Date().getTime(); // Update last generated time
    }
    socket.emit('lotteryNumbers', lastGeneratedNumbers); // Send the numbers to the client

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 5000;
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.use('/test', req => {
    console.log("test")
});
