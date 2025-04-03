# 3d-printer-dashboard
## Overview
The 3D Printer Dashboard is a web application that allows users to monitor and control their 3D printer in real-time. It provides live updates on printer status, temperature readings, and print progress, all presented in an interactive and user-friendly interface.

## Setup Instructions

### Prerequisites
- Node.js (version 14 or higher)
- npm (Node Package Manager)

### Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/ChandraShekhar05/3d-printer-dashboard.git
   cd 3d-printer-dashboard
Install dependencies:

bash
Run
Copy code
npm install
Start the server:

bash
Run
Copy code
node server.js
Open your browser and navigate to http://localhost:3000 to access the dashboard.

Usage
Use the "Start Print" button to initiate a print job.
Monitor the temperatures of the extruder, bed, and Raspberry Pi.
View the print progress and status updates in real-time.
Assumptions and Design Decisions
Real-Time Communication: The application uses Socket.IO for real-time communication between the server and client, allowing for immediate updates on printer status and temperature.
Temperature Simulation: The server simulates temperature readings for the extruder, bed, and Raspberry Pi, which can be replaced with actual readings from a physical printer in a production environment.
Responsive Design: The dashboard is designed to be responsive, ensuring usability across different devices and screen sizes.
Challenges Faced and Solutions
Real-Time Data Handling:

Challenge: Implementing real-time updates for printer status and temperature data was initially complex.
Solution: Leveraged Socket.IO to establish a WebSocket connection, allowing the server to push updates to the client seamlessly.
Chart Integration:

Challenge: Displaying temperature data on a chart with dynamic updates was challenging.
Solution: Used Chart.js to create a line chart that updates in real-time based on the temperature history stored on the server.
UI Layout:

Challenge: Achieving a clean and organized layout for the dashboard.
Solution: Utilized CSS Flexbox for layout management, ensuring that elements are properly aligned and responsive.
Future Improvements
Integrate actual printer API for real-time data instead of simulated values.
Add user authentication for secure access to the dashboard.
Implement additional features such as print job history and error logging.
