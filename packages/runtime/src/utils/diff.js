export function objectDiff(prev, next) {
  const prevKeys = Object.keys(prev);
  const nextKeys = Object.keys(next);

  return ({
    added: nextKeys.filter(key => !(key in prev)),
    removed: prevKeys.filter(key => !(key in next)),
    updated: nextKeys.filter(key => key in prev && prev[key] !== next[key])   
  })
}

export function arrayDiff(prev, next) {
  return ({
    added: next.filter(item => !prev.includes(item)),
    removed: prev.filter(item => !next.includes(item))
  })
}


export const ARRAY_DIFF_OP = {
  ADD: "add",
  REMOVE: "remove",
  MOVE: "move",
  NOOP: "noop"
}


function arrayMutator(arr, eqFn){
  const idxs = arr.map((_,i) => i);
  const prev = [...arr];


  const findIndexFrom = (item, from) => {
    for (let i = from; i < prev.length; i++) {
      if (eqFn(item, prev[i])) {
        return i
      }
    }
    return -1
  }

  return ({
    isRemoval(idx, next) {
      if(idx >= prev.length) return false;
      const idxNext = next.findIndex(nextItem => eqFn(prev[idx], nextItem));
      return idxNext === -1;
    },
    isNoop(idx, next) {
      if (idx >= prev.length) {
        return false
      }
      
      const prevItem = prev[idx];
      const nextItem = next[idx];

      return eqFn(prevItem, nextItem);
    },
    isAddition(item, fromIdx) {
      return findIndexFrom(item, fromIdx) === -1;
    },
    noopItem(idx){
      return ({
        op: ARRAY_DIFF_OP.NOOP,
        originalIndex: idxs[idx],
        index: idx,
        item: prev[idx]
      })
    },
    removeItem(idx) {
      const op = {
        op: ARRAY_DIFF_OP.REMOVE,
        index: idx,
        item: arr[idx]
      }

      prev.splice(idx, 1);
      idxs.splice(idx, 1);

      return operation
    },
    addItem(item, idx) {
      const operation = {
        op: ARRAY_DIFF_OP.ADD,
        index: idx,
        item,
      }

      prev.splice(idx, 0, item);
      idxs.splice(idx, 0, -1);

      return operation
    },
    moveItem(item, to) {
      const from = findIndexFrom(item, to);

      const operation = {
        op: ARRAY_DIFF_OP.MOVE,
        originalIndex: idxs.at(from),
        from,
        index: to,
        item: prev.at(from)
      }

      const _item = prev.splice(from, 1).at(0);
      prev.splice(to, 0, _item);


      const origIdx = idxs.splice(from, 1);
      idxs.splice(to, 0, origIdx);

      return operation;
    },

    removeAfter(idx) {
      const operations = [];

      while (prev.length > idx) {
        operations.push(this.removeItem(idx))
      }

      return operations
    }

  })
}


export function arrayDiffSeq(prev, next, eqFn = (a,b) => a === b) {
  const operations = [];
  const mutator = arrayMutator(prev, eqFn);

  for (let i = 0; i < next.length; i++) {
    if(mutator.isRemoval(i, next)) {
      result.push(mutator.removeItem(i));
      i--;
      continue;
    }
    if(mutator.isNoop(i, next)) {
      operations.push(mutator.noopItem(i));
      continue;
    }
    if(mutator.isAddition(next[i],i)) {
      operations.push(mutator.addItem(next[i], i));
      continue;
    }
    operations.push(mutator.moveItem(next[i], i));

  }

  operations.push(...mutator.removeAfter(next.length));
  return operations
}
