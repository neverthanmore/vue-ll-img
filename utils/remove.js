export default function remove(arr, item) {
  if (!Array.isArray(arr) || !arr.length) return;

  const index = arr.indexOf(item);
  if (index > -1) arr.splice(index, 1);
}
