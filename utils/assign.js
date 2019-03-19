export default function assign(...args) {
  if (args.some(obj => Object.prototype.toString.call(obj) !== '[object Object]') || args.length < 2) return false;

  return args.reduce((accumulator, currentValue) => {
    for (let [key, value] of Object.entries(currentValue)) {
      if (value && accumulator.hasOwnProperty(key)) accumulator[key] = value;
    }
    return accumulator;
  });
}
