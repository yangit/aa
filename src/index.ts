import express from 'express';
import director from './helpers/director';
import state from './helpers/state';

const app: express.Application = express();
const port = 3012;

app.get('/click', (_req: express.Request, res: express.Response) => {
  director({ alfredClick: true }).then(() => {}, (err) => { throw err; });
  res.send('click ok');
});

app.get('/state', (_req: express.Request, res: express.Response) => {
  res.send(JSON.stringify(state.get(), null, '\t'));
});

app.listen(port, () => {
  console.log(`AA on port ${port}`);
});

// process.on('unhandledRejection', (reason, p) => {
//   console.log('in unhadled state');

//   console.log(reason, p);
// });
