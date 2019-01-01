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
