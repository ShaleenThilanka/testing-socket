// server.js
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// Generate lottery numbers function
function generateLotteryNumbers() {
    // Generate 6 random numbers between 1 and 49
    return Array.from({ length: 6 }, () => Math.floor(Math.random() * 49) + 1);
}

// WebSocket connection for real-time updates
io.on('connection', (socket) => {
    console.log('A user connected');

    // Send lottery numbers to all connected clients
    io.emit('lotteryNumbers', generateLotteryNumbers());

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 5000;
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

