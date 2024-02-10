import express from 'express';

const app = express();
const PORT = 3000;

app.get('/', async (req, res) => {
  // Add the logic for handling the request here
  const result = {
    statusCode: 200,
    body: { message: 'Hello from ECS!' },
  };

  // Send the response from the endpoint
  res.status(200).json(result);
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
