import express from 'express';
import cors from 'cors';
import { connectWithRetry } from './models'; // Import the connect function
import routes from './routes'; // Import the routes

const app = express();
const PORT = process.env.PORT || 5000; // Set port

// Middleware
app.use(cors());
app.use(express.json());

// Use the routes
app.use(routes);

// Start the connection to the database
connectWithRetry();

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
