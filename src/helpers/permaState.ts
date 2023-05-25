import { type Message, type Conversation, type PermaState } from '../types';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import * as _ from 'lodash';

const homeDir = os.homedir();
const permaStateFile = path.resolve(homeDir, './.aaState.json');

const defaultState: PermaState = [];

let permaState: PermaState = JSON.parse(JSON.stringify(defaultState));

try {
  permaState = JSON.parse(fs.readFileSync(permaStateFile, 'utf8'));
} catch {
  fs.writeFileSync(permaStateFile, JSON.stringify(permaState, null, '\t'));
}
const addIds = (permaState: PermaState): PermaState => permaState.map((conversation, cIndex): Conversation => ({
  conversationId: `c${cIndex}`,
  messages: conversation.messages.map((message, mIndex): Message => ({

    messageId: `c${cIndex}m${mIndex}`,
    ..._.omit(message, 'messageId'),
  })),
  ..._.omit(conversation, ['conversationId', 'messages']),
}));

const save = (): void => {
  fs.writeFileSync(permaStateFile, JSON.stringify(addIds(permaState), null, '\t'));
};

const get = (): PermaState => permaState;
const set = (path: string, value: any): void => {
  _.set(permaState, path, value);
  console.log(permaState);

  save();
};

const add = (conversation: Conversation): number => {
  permaState.push(conversation);
  save();
  return permaState.length - 1;
};
export default { get, set, add, save };
