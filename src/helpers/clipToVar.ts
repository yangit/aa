import exec from './exec';

export default async (): Promise<string> => await exec('pbpaste').then(result => result.stdout.trim());
