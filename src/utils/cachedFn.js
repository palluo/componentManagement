
export default fn => {
  const cacheMap = new Map();
  return () => {
    let hit = cacheMap.get(fn);
    if (!hit) {
      const data = fn();
      cacheMap.set(fn, data);
      return data;
    }
    return hit;
  };
};
