import personas from "./data";

const zip = (a, b) => a.map((k, i) => [k, b[i]]);
const sum = (a) => a.reduce((a, b) => a + b, 0);

// https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
// Box--Muller transform
function gaussian_random(mean = 0, stdev = 1) {
  const u = 1 - Math.random();
  const v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

  return z * stdev + mean;
}

const euclidean_metric = (a, b) =>
  Math.sqrt(sum(zip(a, b).map(([a, b]) => Math.pow(b - a, 2))));

const manhattan_metric = (a, b) =>
  sum(zip(a, b).map(([a, b]) => Math.abs(b - a)));

const metric = euclidean_metric;

function augment_data(
  cluster: Record<string, number[]>,
  count: number,
  stdev = 0.1
) {
  const dataset_len = Object.keys(cluster).length;
  const div = Math.floor(count / dataset_len);
  const mod = count % dataset_len;

  return Object.fromEntries(
    zip(
      Object.keys(cluster),
      Object.values(cluster).map((v, i) =>
        Array(div + (i < mod))
          .fill(null)
          .map(() => v.map((v) => v + gaussian_random(0, stdev)))
      )
    )
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
  const cluster = Object.fromEntries(
    Object.entries(personas).filter(
      ([_k, v]) => metric(dataPoint, v) < threshold
    )
  );

  return augment_data(cluster, count);
}

export function run_simulation(
  environment: number[],
  profiles: Record<string, number[][]>
): [string, boolean][] {
  const result: [string, boolean][] = [];
  const [price_up, competition_level] = environment;

  for (const [profile_name, vectors] of Object.entries(profiles)) {
    for (const vector of vectors) {
      const [income_stable, risk_tol, mark_succ] = vector;

      const decision = price_up
        ? income_stable
          ? mark_succ < 0.1
            ? risk_tol > 0.5
            : risk_tol > 0.01
          : mark_succ < 0.5
            ? risk_tol > 0.8
            : risk_tol > 0.5
        : income_stable
          ? mark_succ < 0.05
            ? risk_tol > 0.1
            : risk_tol > 0.005
          : mark_succ < 0.25
            ? risk_tol > 0.6
            : risk_tol > 0.25;

      result.push([profile_name, decision]);
    }
  }

  return result;
}
