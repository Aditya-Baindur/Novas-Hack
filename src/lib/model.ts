import personas from "./data";

const zip = (a: number[], b: number[]) => a.map((k, i) => [k, b[i]]);
const sum = (a: number[]) => a.reduce((a, b) => a + b, 0);

// https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
// Box--Muller transform
function gaussian_random(mean = 0, stdev = 1) {
  const u = 1 - Math.random();
  const v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

  return z * stdev + mean;
}

const euclidean_metric = (a: number[], b: number[]) => {
  if (a.length !== b.length) throw new Error("Arrays must have equal length");
  const distance = Math.sqrt(
    a.reduce((sum, ai, i) => sum + Math.pow(b[i] - ai, 2), 0)
  );

  return distance;
};

const manhattan_metric = (a: number[], b: number[]) =>
  sum(zip(a, b).map(([a, b]) => Math.abs(b - a)));

// sigmoid func
const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

const metric = (a: number[], b: number[]) => {
  const newA = [...a];
  const newB = [...b];

  newB[0] = b[0] / 100;
  newB[1] = b[1] / 100;

  newA[2] = sigmoid(newA[2] / 65_000) * 2 - 1;
  newB[2] = sigmoid(newB[2] / 65_000) * 2 - 1;

  return euclidean_metric(newA, newB);
};

function augment_data(
  cluster: number[][],
  count: number,
  stdev = 0.1
): number[][] {
  const dataset_len = Object.keys(cluster).length;
  const div = Math.floor(count / dataset_len);
  const mod = count % dataset_len;

  return cluster.flatMap((v, i) =>
    Array(div + (i < mod))
      .fill(null)
      .map(() => v.map((val) => val + gaussian_random(0, stdev)))
  );
}

/**
 *
 * @param dataPoint
 * @param count total number of profiles to be generated after augmentation
 * @param threshold how far do you want the generated profiles to be from the reference datapoint
 * @returns
 */
export function get_profiles(
  dataPoint: number[],
  count: number,
  threshold = 0.1
) {
  const cluster = personas.filter((v) => metric(dataPoint, v) < threshold);

  return augment_data(cluster, count);
}

export function run_simulation(environment: number[], profiles: number[][]) {
  if (!profiles || profiles.length == 0 || profiles[0].length !== 3) {
    console.error("Invalid profiles dimensions", profiles);

    return [0];
  }

  if (!environment || environment.length !== 2) {
    console.error("Invalid environment dimensions", environment);

    return [0];
  }

  const [original_price, price_change] = environment;

  return profiles.map((profile) => {
    const [risk_seeking, market_suc, income] = profile;

    return price_change <= 6.075
      ? risk_seeking <= 13.295
        ? 0
        : market_suc <= 48.39
          ? risk_seeking <= 56.96
            ? 0
            : 1
          : 1
      : price_change <= 17.92
        ? original_price <= 141.695
          ? 1
          : income <= 98204.512
            ? 0
            : 1
        : risk_seeking <= 75.82
          ? market_suc <= 46.55
          : 1;
  });
}
