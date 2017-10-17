import _ from "lodash"

window.grid = _.map(Array(50), () => _.fill(Array(50),0));

window.gridPrint = function(){
  console.log('findme');
  console.log(_(window.grid).map( ar => ar.join(', ') ).join('\n'));
}

window.gridTest = function( a, b) {
  window.grid[a][b] = 1;
}
gridTest(1,1);
gridTest(3,3);
gridPrint();

window.chooseCell = function(x,y){
  _.each( window.grid[y], (val, i, col) => col[i]++ );

  _.each( window.grid, (val, i, col) => col[i][x]++);
  window.gridPrint()  ;
}

chooseCell(49,25);
chooseCell(0, 49);
