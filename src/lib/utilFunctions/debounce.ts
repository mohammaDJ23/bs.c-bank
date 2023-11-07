export function debounce(func: (...args: any[]) => void, timeout = 500) {
  let timer: undefined | NodeJS.Timeout = undefined;
  return (...args: any[]) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.call({}, args);
    }, timeout);
  };
}
