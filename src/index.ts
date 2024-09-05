import app from './app';

// Define the port (from environment variables or default to 3000)
const port = process.env.PORT || 3000;

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
