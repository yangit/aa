import cleanUp from './cleanup';
import playInst from './playInst';

export default (err: any): void => {
  cleanUp();
  console.log(err);

  playInst('water.mp3');
};
