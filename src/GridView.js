
export default class GridView {
  constructor(size, clickCallback){
    this.clickCallback = clickCallback;
    this.size = size;

    this.addClickHandler();
    this.initGrid();
  }

  initGrid(size) {

    let htmlStr = '';
    _(this.size).times( row => {
      htmlStr += '<div class="row">';

      _(this.size).times( col => {
        htmlStr += `<div class="r${row} c${col}"><div><div></div></div></div>`;
      })
      htmlStr += '</div>';

    })

    document.querySelector('.container').innerHTML = htmlStr;
  }

  update(data, row, col, sequences) {

    //Update all numbers
    data.forEach( ( rowAr, r) => {
      rowAr.forEach( (cell, c) => {
        document.querySelector(`.r${r}.c${c}>div>div`).innerHTML = cell?cell:'';
      })
    });

    //Highlight sequences
    sequences.forEach( seq => {
      seq.forEach( cell => {
        this.animGreen( cell.r, cell.c);
      })
    })

    this.setAnimTimeout();

  }

  // to be able to repeat css animation, the classes have to be removed
  setAnimTimeout(){

    if( this.animTimeout)
      window.clearTimeout( this.animTimeout);

    this.animTimeout = window.setTimeout(this.clearAnims,1000);
  }

  // Clear all highlight animations
  clearAnims(){
    document.querySelectorAll('.activated, .sequence').forEach( el => {
      el.classList.remove('activated', 'sequence');
    })
  }


  addClickHandler() {

    let self = this;
    // add handler to body, instead of each cell, for faster handling
    document.querySelector('body').addEventListener('click', e => {
      // calculate based on clicked coordinates
      let col = ~~(e.x / (window.innerWidth / this.size));
      let row = ~~(e.y / (window.innerHeight / this.size));

      //highlight the clicked cell
      this.animYellow(row,col,'activated');
      this.setAnimTimeout();

      // pass the event to the model
      if (self.clickCallback)
        self.clickCallback(row,col);
    });

  }


  animGreen(row,col){
    let el = document.querySelector(`.r${row}.c${col}>div>div`);
    el.classList.add('sequence');
  }

  animYellow(row,col) {

    let el = document.querySelector(`.r${row}.c${col}>div`);
    el.classList.add('activated');

  }

}
