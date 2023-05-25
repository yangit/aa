import exec from './exec';

export default async ({ workflow, trigger }: { workflow: string, trigger: string }): Promise<void> => {
  await exec(`osascript -e 'tell application id "com.runningwithcrayons.Alfred" to run trigger "${trigger}" in workflow "${workflow}"'`);
};
