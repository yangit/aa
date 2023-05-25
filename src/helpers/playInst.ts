import play from './play';

export default (file: string): void => {
  play(file).then(() => {}, (err) => { throw err; });
};
