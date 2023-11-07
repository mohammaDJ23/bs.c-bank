export function throttle(func: (...args: any[]) => void, delay = 500) {
  let timer: undefined | NodeJS.Timeout = undefined;
  return (...args: any[]) => {
    if (timer === undefined) {
      func.call({}, args);
      timer = setTimeout(() => {
        timer = undefined;
      }, delay);
    }
  };
}
