import express from 'express';
import { askAtCursor, toggleRecord } from './helpers/director';
// import state from './helpers/state';

const app: express.Application = express();
const port = 3012;

app.get('/askAtCursor', (_req: express.Request, res: express.Response) => {
  askAtCursor().then(() => { }, (err) => { throw err; });
  // director({ askAtCursor: true }).then(() => {}, (err) => { throw err; });
  res.send('askAtCursor ok');
});

app.get('/toggleRecord', (_req: express.Request, res: express.Response) => {
  toggleRecord().then(() => { }, (err) => { throw err; });
  res.send('toggleRecord ok');
});

// app.get('/state', (_req: express.Request, res: express.Response) => {
//   res.send(JSON.stringify(state.get(), null, '\t'));
// });

app.listen(port, () => {
  console.log(`AA on port ${port}`);
});
