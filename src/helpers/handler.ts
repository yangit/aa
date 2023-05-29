
import cleanUp from './cleanup';
import state from './state';
import playInst from './playInst';

export default (err: any): void => {
  cleanUp();
  state.set('alfredClick', 'rest');
  state.set('running', false);
  console.log(err);

  playInst('water.mp3');
};
