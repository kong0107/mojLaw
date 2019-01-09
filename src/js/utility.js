/**
 * 重包 Fetch API ，使 HTTP error 也會 reject
 */
export const fetch = (input, init) =>
  new Promise((resolve, reject) =>
    window.fetch(input, {mode: 'cors'})
    .then(res => res.ok ? resolve(res) : reject(new ReferenceError(res.statusText)), reject)
  )
;

export const log = (...arg) => console.log(...arg);

export const numf = number => {
  const p1 = number / 100, p2 = number % 100;
  return p2 ? Math.floor(p1).toString().concat('-', p2) : p1;
};
