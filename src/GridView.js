
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
        htmlStr += `<div class="r${row} c${col}"></div>`;
      })
      htmlStr += '</div>';

    })

    document.querySelector('.container').innerHTML = htmlStr;
  }

  update(data, row, col) {

    document.querySelectorAll(`.row:nth-child(${row+1})>div`).
    forEach( (el,i) => {
      el.innerHTML = data[row][i];
    })

    document.querySelectorAll(`.row>div:nth-child(${col+1})`).
    forEach( (el, i) => {
      el.innerHTML = data[i][col];
    })
  }

  addClickHandler() {

    let self = this;
    // add handler to body, instead of each cell, for faster handling
    document.querySelector('body').addEventListener('click', e => {
      let col = ~~(e.x / (window.innerWidth / this.size));
      let row = ~~(e.y / (window.innerHeight / this.size));

      this.highlightCell(row,col);

      if (self.clickCallback)
        self.clickCallback(row,col);
    });

  }

  highlightCell(row,col) {
  
    let el = document.querySelector(`.r${row}.c${col}`);
    el.className += ' activated';

    // use a named function, otherwise we can't remove the eventhandler
    let onHighlightEnd = e => {
        e.target.className = e.target.className.replace(/ activated/g,'');
        e.target.removeEventListener(e.type, onHighlightEnd,false);
    }
    el.addEventListener('transitionend', onHighlightEnd);

  }



}
