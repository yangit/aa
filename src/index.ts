import express from 'express';
import { askAtCursor, toggleRecord } from './helpers/director';

const app: express.Application = express();
const port = 3012;

app.get('/askAtCursor', (_req: express.Request, res: express.Response) => {
  console.log('askAtCursor');

  askAtCursor().then(() => { }, (err) => { throw err; });
  // director({ askAtCursor: true }).then(() => {}, (err) => { throw err; });
  res.send('askAtCursor ok');
});

app.get('/toggleRecord', (_req: express.Request, res: express.Response) => {
  console.log('toggleRecord');
  toggleRecord().then(() => { }, (err) => { throw err; });
  res.send('toggleRecord ok');
});

app.listen(port, () => {
  console.log(`AA on port ${port}`);
});
