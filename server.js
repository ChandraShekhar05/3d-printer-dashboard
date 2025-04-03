// server.js - 3D Printer Simulation Server
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

// Initialize express app
const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from public directory

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.io
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true
    }
});

// 3D Printer state
let printerState = {
    status: 'Idle', // idle, printing, homing
    printProgress: 0,
    temperature: {
        hotend: 25,   // in °C
        bed: 25       // in °C
    },
    tempHistory: {
        timestamps: [],
        extruderData: [],
        bedData: [],
        piData: []
    }
};

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    
    // Send current printer state to the newly connected client
    socket.emit('printerState', printerState);
    
    // Handle print job start
    socket.on('startPrint', (jobData) => {
        if (printerState.status === 'Idle') {
            printerState.status = 'Printing';
            printerState.printProgress = 0;
            // Start heating simulation
            simulateHeating();
            // Broadcast updated state to all clients
            io.emit('printerState', printerState);
            console.log('Print job started:', jobData.name);
        } else {
            socket.emit('error', { message: 'Printer is busy' });
        }
    });
    
    // Handle print job cancel
    socket.on('cancelPrint', () => {
        if (printerState.status === 'Printing') {
            printerState.status = 'Idle';
            printerState.printProgress = 0;
            io.emit('printerState', printerState);
            console.log('Print job canceled');
        }
    });

    // Handle homing
    socket.on('startHoming', () => {
        printerState.status = 'Homing';
        io.emit('printerState', printerState);
        setTimeout(() => {
            printerState.status = 'Idle';
            io.emit('printerState', printerState);
            console.log('Homing completed');
        }, 5000); // Simulate homing time
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Simulate printer heating process
function simulateHeating() {
    const heatingInterval = setInterval(() => {
        // Simulate hotend heating (target: 200°C)
        if (printerState.temperature.hotend < 200) {
            printerState.temperature.hotend += 5;
            if (printerState.temperature.hotend > 200) printerState.temperature.hotend = 200;
        }
        
        // Simulate bed heating (target: 60°C)
        if (printerState.temperature.bed < 60) {
            printerState.temperature.bed += 2;
            if (printerState.temperature.bed > 60) printerState.temperature.bed = 60;
        }
        
        io.emit('printerState', printerState);
        
        // Once target temperatures are reached, start the print simulation
        if (printerState.temperature.hotend >= 200 && printerState.temperature.bed >= 60) {
            clearInterval(heatingInterval);
            simulatePrinting();
        }
    }, 1000);
}

// Simulate the printing process
// Simulate the printing process
function simulatePrinting() {
    const printInterval = setInterval(() => {
        if (printerState.status === 'Printing') {
            // Update progress
            printerState.printProgress += 0.1;
            if (printerState.printProgress > 100) {
                printerState.printProgress = 100;
                printerState.status = 'Idle'; // Mark as idle when done
                clearInterval(printInterval);
                console.log('Print job completed');
            }

            // Update temperature history
            const now = new Date();
            const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
            printerState.tempHistory.timestamps.push(timeStr);
            printerState.tempHistory.extruderData.push(printerState.temperature.hotend);
            printerState.tempHistory.bedData.push(printerState.temperature.bed);
            printerState.tempHistory.piData.push(44); // Simulated Pi temperature

            // Emit updated state
            io.emit('printerState', printerState);
        }
    }, 1000);
}

// API Routes
app.get('/api/printer', (req, res) => {
    res.json(printerState);
});

// Default route for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`3D Printer Simulation Server running on port ${PORT}`);
});