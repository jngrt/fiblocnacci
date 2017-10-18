
export default class GridModel{
  constructor(size, changeCallback){
    this.changeCallback = changeCallback;
    this.size = size;
    this.populate();
    this.minSize = 3;
    this.sequences = [];
    this.current = [];
  }
  populate(){
    // Lodash version
    //this.grid = _.map(Array(50), () => _.fill(Array(50),0));

    // ES6 version
    this.grid = (Array(this.size)).fill(0);
    this.grid = this.grid.map( () => (Array(this.size)).fill(0));
    if(this.changeCallback) this.changeCallback( this.getData());

  }
  activateCell(row, col){
    this.grid[row].forEach( (val, i, data) => data[i]++ );
    this.grid.forEach( (val, i, data) => data[i][col]++ );
    this.grid[row][col]--;

    this.findSequences();

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
  findSequences(row, col){
    console.log('findSequences');
    // loop through all rows
    this.sequences = [];
    let r,c;
    this.current = [];
    let val, last;

    //for(r = 0; r < this.size; r++ ){
    r = 1;
      for( c = 0; c < this.size; c++ ){
        val = this.grid[r][c];

        // end the sequence if it's not a FN
        if( !val || !this.isFibonacci( val ) ){
          this.endOfSequence();

        // in case it is a FN
        } else  {

          // if no current seq, or beginning of row: start new seq.
          if( !this.current.length || !c ) {
            this.current.push({r,c,val});

          // if this is next in the sequence: save it
          } else if ( this.isFollowUp( last, val ) ) {
            this.current.push({r,c,val});

          // if FN, but not in seq: start new sequence
          } else {
            this.endOfSequence();
            // start a new sequence with the value just found
            this.current = [{r,c,val}];
          }
        }
        last = val;
      }
      //check if seq at end of row...
      this.endOfSequence();

    //}
    console.log(this.sequences);
    this.sequences.forEach( console.log );
  }

  endOfSequence() {
    if( !this.current.length ) return;

    this.filterOnes(this.current);
    if( this.current.length >= this.minSize){
      //todo: maximum of two 1's at the start
      //if more than 5 save it
      this.sequences.push(this.current);
    }
    this.current = [];
  }

  filterOnes(ar){

    if( ar[0].val !== 1 ) return;

    // array.findLastIndex doesn't exist, therefore we reverse it.
    ar.reverse();

    // get the first 1 in the reversed array
    let last = ar.findIndex( el => el.val === 1);
    // snip off if there's too many ones
    if ( ar.length > last + 2 ){
      ar.length = last + 2;
    }

    //reverse it and return
    return ar.reverse();
  }

  isFollowUp(x,y) {
    if ( x === 1 && y ===1 )
      return true;

    return this.memory[ this.memory.lastIndexOf(x) + 1] === y;
  }

  // check if a certain number is fibonacci
  isFibonacci(n) {
    // make sure our fibonacci cache is big enough
    this.generateFibonacci(n);
    // check if the number is in the fibonacci cache
    return this.memory.indexOf(n) !== -1;
  }
  // "lazy" generating fibonacci numbers, only when we encounter bigger numbers
  generateFibonacci(max) {
    if(!this.memory){
      this.memory = [1,1];
    }
    let mem = this.memory;
    while( mem[mem.length-1] < max ){
      mem.push( mem[mem.length - 1] + mem[mem.length -2] );
    }
  }
}
