import _ from 'lodash'
import GridModel from './GridModel'
import GridView from './GridView'

import styles from './main.css'

const SIZE = 50;

let model = new GridModel( SIZE, (data,row,col,seq) => {
  if(view) view.update(data,row,col,seq);
});

let view = new GridView( SIZE, (row,col) => {
  model.activateCell(row,col);
});

window.model = model;
window.view = view;
