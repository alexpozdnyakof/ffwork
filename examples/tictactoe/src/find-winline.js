export function findWinline(field, size) {
  const horizontal = (acc, i = 1) => {
    if (i === size) return acc;
    if (field.at(acc.at(0)) === field.at(acc.at(0) + i)) acc.push(acc.at(0) + i);
    return horizontal(acc, i+1);
  }
  const vertical = (acc, i = 1) => {
    if (i === size) return acc;
    if (field.at(acc.at(0)) === field.at(acc.at(0) + i * size)) acc.push(acc.at(0) + i * size); 
    return vertical(acc, i+1);
  }
  const diagonal = (acc, i = 1) => {
    if (i === size) return  acc;
    if (acc.at(0) === 0 && field.at(acc.at(0)) === field.at(i + size * i)) acc.push(i + size * i);
    if (acc.at(0) === size-1 && field.at(acc.at(0)) === field.at(acc.at(0) * (i + 1))) acc.push(acc.at(0) * (i + 1));
    return diagonal(acc, i+1);
  }

  return ([...new Array(size).keys()])
    .flatMap(step => ([
      field.at(step*size) !== null ? horizontal(Array.of(step*size)) : [], 
      field.at(step) !== null ? vertical(Array.of(step)) : [], 
      field.at(step) !== null && (step === 0 || step === size-1) ? diagonal(Array.of(step)) : []
    ]))
    .find(line => line.length === size)
}

