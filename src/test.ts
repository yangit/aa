import varToClip from './helpers/varToClip';

const main = async (): Promise<void> => {
  // const a = Array(10);
  const a = [];
  a.push('\'');
  a.push('"');
  a.push('```````');
  a.push('\\');
  a.push('-c:12 \n\n\n11');

  console.log('start: ');

  // // for (let i = 0; i < a.length; i++) {
  // //   await varToClip(a[i]);
  // // }
  // await varToClip('-c\:11');
  await varToClip(a.join('\n'));
};

main().then((r) => {
  console.log('done', r);
}).catch((err) => {
  console.log('err', err);
});
