require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Routes
const usersRouter = require('./routes/users');
const machinesRouter = require('./routes/machines');
const organesRouter = require('./routes/organes');
const piecesRouter = require('./routes/pieces');
const problemsRouter = require('./routes/problems');
const prioritiesRouter = require('./routes/priorities');
const statusesRouter = require('./routes/statuses');
const ticketsRouter = require('./routes/tickets');

app.use(express.json());

// API routes
app.get('/', (req, res) => {
  res.json({
    message: 'API ITMS OK',
    endpoints: {
      users: '/api/users',
      machines: '/api/machines',
      organes: '/api/organes',
      pieces: '/api/pieces',
      problems: '/api/problems',
      priorities: '/api/priorities',
      statuses: '/api/statuses',
      tickets: '/api/tickets'
    }
  });
});

app.use('/api/users', usersRouter);
app.use('/api/machines', machinesRouter);
app.use('/api/organes', organesRouter);
app.use('/api/pieces', piecesRouter);
app.use('/api/problems', problemsRouter);
app.use('/api/priorities', prioritiesRouter);
app.use('/api/statuses', statusesRouter);
app.use('/api/tickets', ticketsRouter);

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
