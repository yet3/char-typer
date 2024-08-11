// SplitMix32
// https://stackoverflow.com/a/47593316
export const randomWithSeed = (seed: number) => {
  seed |= 0;
  seed = (seed + 0x9e3779b9) | 0;
  let t = seed ^ (seed >>> 16);
  t = Math.imul(t, 0x21f0aaad);
  t = t ^ (t >>> 15);
  t = Math.imul(t, 0x735a2d97);
  return ((t = t ^ (t >>> 15)) >>> 0) / 4294967296;
};

type IRandomInt = (opts: {
  min: number;
  max?: number;
  seed?: number;
}) => number;

export const randomInt: IRandomInt = (opts) => {
  const min = opts.min;
  const max = opts.max ?? opts.min;

  if (opts.seed == null) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  return Math.floor(randomWithSeed(opts.seed) * (max - min + 1)) + min;
};
