function get(entity: any, path: (string | number | symbol)[] | readonly (string | number | symbol)[]): any {
  var current = entity;
  for (var i = 0; i < path.length; i += 1) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = current[path[i]];
  }
  return current;
}

export default get
