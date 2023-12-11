require('dotenv').config();
require('express-async-errors');
const express = require('express');
const { logger, logEvents } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const app = express();
const connectDB = require('./config/dbConn');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3500;

console.log(process.env.NODE_ENV);

connectDB();

app.use(logger);

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('api running');
});

app.use('/auth', require('./routes/authRoutes'));
app.use('/users', require('./routes/userRoutes'));
app.use('/managers', require('./routes/managerRoutes'));
app.use('/drivers', require('./routes/driverRoutes'));
app.use('/sites', require('./routes/siteRoutes'));
app.use('/transportationTasks', require('./routes/transportationTaskRoutes'));
app.use('/vehicles', require('./routes/vehicleRoutes'));

app.all('*', (req, res) => {
  res.status(404);
  res.json({ message: '404 Not Found' });
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on('error', (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    'mongoErrLog.log'
  );
});
