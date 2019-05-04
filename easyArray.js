module.exports = {
  areSame: (array1, array2) => {
    var same = true;
    for(var i in array1) {
      if(array1[i] !== array2[i]) {
        same = false;
      }
    }
    return same;
  },
  removeFrom: (array, item) => {
    var newArray = [];
    for(var i in array) {
      if(array[i] === item) {
        continue;
      }
      newArray[newArray.length] = array[i];
    }
  },
  removeFrom: (array, index) => {
    var newArray = [];
    for(var i in array) {
      if(i === index) {
        continue;
      }
      newArray[newArray.length] === array[i];
    }
  }
}
