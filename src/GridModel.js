
export default class GridModel{
  constructor(size, changeCallback){
    this.changeCallback = changeCallback;
    this.populate(size);
  }
  populate(size){
    // Lodash version
    //this.grid = _.map(Array(50), () => _.fill(Array(50),0));

    // ES6 version
    this.grid = (Array(size)).fill(0);
    this.grid = this.grid.map( () => (Array(size)).fill(0));
    if(this.changeCallback) this.changeCallback( this.getData());

  }
  activateCell(row, col){
    this.grid[row].forEach( (val, i, data) => data[i]++ );
    this.grid.forEach( (val, i, data) => data[i][col]++ );
    this.grid[row][col]--;
    
    if(this.changeCallback)
      this.changeCallback( this.getData(), row, col);
  }
  toString(){
    return this.grid.map( ar => ar.join(', ') ).join('\n');
  }
  getData(){
    //return a copy of the array
    return this.grid.map( row => row.slice());
  }
}
