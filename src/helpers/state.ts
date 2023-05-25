import { type State } from '../types';

import * as _ from 'lodash';

const defaultState: State = {
  alfredClick: 'rest',
  clip: '',
  lastClick: new Date(),
};

const state: State = JSON.parse(JSON.stringify(defaultState));

const get = (): State => state;
const set = (path: string, value: any): void => {
  console.log('Set state', path, value);

  _.set(state, path, value);
};
export default { get, set };
