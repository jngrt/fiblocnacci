
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

  // startRow, endRow, rowMod, startCol, endCol, colMod
  findSequences(){
    this.sequences = [];
    this.findRowRight();
    this.findRowLeft();
    this.findColDown();
    this.findColUp();

    console.log(this.sequences);
    //this.sequences.forEach( console.log );
  }

  findRowRight(){
    let r = 0;
    let c = 0;
    this.findSeqIter( {
      nextLine: () => {
        c = 0;
        return ++r < this.size
      },
      nextCell: () => ++c < this.size,
      getVal: () => this.grid[r][c],
      getData: () => ({r, c, val: this.grid[r][c]}),
      toString: () => `${r} - ${c}`
    });
  }
  findRowLeft(){
    let r = this.size - 1;
    let c = this.size - 1;
    this.findSeqIter( {
      nextLine: () => {
        c = this.size - 1;
        return --r >= 0
      },
      nextCell: () => --c >= 0,
      getVal: () => this.grid[r][c],
      getData: () => ({r, c, val: this.grid[r][c]}),
      toString: () => `${r} - ${c}`
    });
  }
  findColDown(){
    let r = 0;
    let c = 0;
    this.findSeqIter( {
      nextLine: () => {
        r = 0;
        return ++c < this.size
      },
      nextCell: () => ++r < this.size,
      getVal: () => this.grid[r][c],
      getData: () => ({r, c, val: this.grid[r][c]}),
      toString: () => `${r} - ${c}`
    });
  }
  findColUp(){
    let r = this.size - 1;
    let c = this.size - 1;
    this.findSeqIter( {
      nextLine: () => {
        r = this.size - 1;
        return --c >= 0
      },
      nextCell: () => --r >= 0,
      getVal: () => this.grid[r][c],
      getData: () => ({r, c, val: this.grid[r][c]}),
      toString: () => `${r} - ${c}`
    });
  }

  findSeqIter(iter){
    //TODO, rewrite with ES6 iterators

    let line, cell;

    while( line = iter.nextLine() ) {
      //console.log(iter.toString());
      this.current = [];

      while( cell = iter.nextCell() ) {

        let val = iter.getVal();

        // end the sequence if it's not a FN
        if( !val || !this.isFibonacci( val ) ){
          this.endSequence();

        // in case it is a FN
        } else  {

          // if this is next in the sequence: save it
          if ( this.fitInSequence( val ) ) {
            this.current.push(iter.getData());

          // if FN, but not in seq: start new sequence
          } else {
            this.endSequence();
            // start a new sequence with the value just found
            this.current = [iter.getData()];
          }
        }
      }
      //check if seq at end of row...
      this.endSequence();
    }
  }



  endSequence() {
    if( !this.current.length ) return;

    this.filterOnes(this.current);
    if( this.current.length >= this.minSize){
      //todo: maximum of two 1's at the start
      //if more than 5 save it
      this.sequences.push(this.current);
    }
    this.current = [];
  }

  // there can be an arbitrary number of ones at the start, reduce to two
  filterOnes(ar){

    // if the first value is not one, there's nothing to be done
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

  // check if a number fits in the sequence
  fitInSequence(val) {
    //first one in sequence always fits
    if( !this.current.length )
      return true;

    //check if previous one and new one are 1's
    let last = this.current[ this.current.length - 1].val;
    if ( val === 1 && last ===1 )
      return true;

    // otherwise check if it fits in the sequence
    return this.memory[ this.memory.lastIndexOf(last) + 1] === val;
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

  /*
  // The old findsequences, purely for historical reasons
  findSequences(row, col){
    console.log('findSequences');
    // loop through all rows
    this.sequences = [];
    this.current = [];

    let val;
    let r,c;
    for(r = 0; r < this.size; r++ ){
      for( c = 0; c < this.size; c++ ){
        val = this.grid[r][c];

        // end the sequence if it's not a FN
        if( !val || !this.isFibonacci( val ) ){
          this.endSequence();

        // in case it is a FN
        } else  {

          // if no current seq, or beginning of row: start new seq.
          if( !this.current.length || !c ) {
            this.current.push({r,c,val});

          // if this is next in the sequence: save it
          } else if ( this.fitInSequence( val ) ) {
            this.current.push({r,c,val});

          // if FN, but not in seq: start new sequence
          } else {
            this.endSequence();
            // start a new sequence with the value just found
            this.current = [{r,c,val}];
          }
        }
      }
      //check if seq at end of row...
      this.endSequence();

    }
    console.log(this.sequences);
    this.sequences.forEach( console.log );
  }*/
}
