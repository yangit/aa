import express from 'express';
import director from './helpers/director';
import state from './helpers/state';
import playInst from './helpers/playInst';
import cleanUp from './helpers/cleanup';

const app: express.Application = express();
const port = 3012;

app.get('/click', (_req: express.Request, res: express.Response) => {
  director({ alfredClick: true }).catch((err) => {
    cleanUp();
    state.set('alfredClick', 'rest');
    console.log('Err:', err);
    playInst('water.mp3');
  });
  res.send('click ok');
});

app.listen(port, () => {
  console.log(`AA on port ${port}`);
});
