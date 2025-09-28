require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const seed = require('./utils/seed');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const traceRoutes = require('./routes/traces');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/traces', traceRoutes);

app.get('/', (req, res) => res.send({ ok: true, version: 'trackchain-backend-v1' }));

const PORT = process.env.PORT || 4000;

mongoose.connect("mongodb+srv://ibousv:kim6dEzBJrN8GpzW@cluster0.ktacm2c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');
    await seed();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Backend running on port ${PORT}`);
    });
    
  })
  .catch(err => console.error('Mongo connection error', err));
