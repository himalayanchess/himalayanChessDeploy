const arr = [
  [1, 2, 3],
  [3, 1, 2],
  [2, 3, 1],
];

function checkrow(rowarr) {
  for (let i = 1; i < rowarr.length + 1; i++) {
    if (![...new Set(rowarr)].includes(i)) {
      return false;
    }
  }
  return true;
}

function calculateUnique() {
  // check rows
  for (let i = 0; i < arr.length; i++) {
    let rowValid = checkrow(arr[i]);
    if (!rowValid) return false;
  }
  // check columns

  for (let i = 0; i < arr.length; i++) {
    let tempColumn = [];
    for (let j = 0; j < arr.length; j++) {
      tempColumn.push(arr[j][i]);
    }
    let columnValid = checkrow(tempColumn);
    if (!columnValid) return false;
    tempColumn = [];
  }
  return true;
}
