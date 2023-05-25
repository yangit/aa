import runAlfred from './runAlfred';

export default async (): Promise<void> => {
  await runAlfred({ workflow: 'av', trigger: 'avcopy' });
};
