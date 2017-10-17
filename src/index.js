import _ from "lodash"

// Lodash version
//window.grid = _.map(Array(50), () => _.fill(Array(50),0));

// ES6 version
window.grid = (Array(50)).fill(0);
window.grid = window.grid.map( () => (Array(50)).fill(0));


window.gridPrint = function(){
  console.log('findme');
  console.log( window.grid.map( ar => ar.join(', ') ).join('\n'));
}
window.gridPrint();

window.chooseCell = function(x,y){
  //Lodash
  //_.each( window.grid[y], (val, i, col) => col[i]++ );
  //_.each( window.grid, (val, i, col) => col[i][x]++);

  //ES6
  window.grid[y].forEach( (val, i, col) => col[i]++ );
  window.grid.forEach( (val, i, col) => col[i][x]++ );

  window.gridPrint()  ;
}

chooseCell(49,25);
chooseCell(0, 49);
