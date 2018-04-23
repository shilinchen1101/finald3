import * as d3 from 'd3';
import '../style/main.css';
import '../style/btn.css';

import parse from './parse';
import Bubble from './Bubble';
//import Map from './Map'
// import Button from './Button';

var forceSimulation = d3.forceSimulation();
var _h = document.getElementById('vis').clientHeight;
var _w = document.getElementById('vis').clientWidth;

const bubble = Bubble( document.querySelector('#vis') );
//const map = Map( document.querySelector('#vis') );
// .forceSimulation(forceSimulation);
//const Button = Button();
const projection = d3.geoAlbersUsa()
       .translate([_w/2, _h/4])
       .scale([1000]);

const path = d3.geoPath()
    .projection(projection);


d3.csv('./data/pv2017.csv', parse).then(function(deaths) {
  bubble(deaths);
  //map(deaths)
  //Button(deaths);


});

const oneButton = d3.select('#btn1')
    .on('click', () => {
      const center = { x: _w / 2, y: _h / 3 };

     var _forceX = d3.forceX().strength(1.5).x(center.x);

     var _forceY = d3.forceY().strength(1.5).y(center.y);

     const bubbleOne = bubble
     .forceX(_forceX)
     .forceY(_forceY)
     .restart();

   });

 const monthButton = d3.select('#btn2')
     .on('click', () => {

      var _forceX = d3.forceX(function(d){
        if (d.month === 0 || d.month === 4 || d.month === 8) {
          return _w/5
        } else if (d.month === 1 || d.month === 5 || d.month === 9) {
          return 2*_w/5
        } else if (d.month === 2 || d.month === 6 || d.month === 10) {
          return 3*_w/5
        } else if (d.month === 3 || d.month === 7 || d.month === 11) {
          return 4*_w/5
        }
      }).strength(0.7);

      var _forceY = d3.forceY(function(d){
        if (d.month === 0 || d.month === 1 || d.month === 2 || d.month ===3) {
          return _h/4
        } else if (d.month === 4 || d.month === 5 || d.month === 6 || d.month === 7) {
          return 2*_w/4
        } else if (d.month === 8 || d.month === 9 || d.month === 10 || d.month === 11) {
          return 3*_w/4
        }
      }).strength(0.7);

      const bubbleMonth = bubble
      .forceX(_forceX)
      .forceY(_forceY)
      .restart();

    });

const raceButton = d3.select('#btn3')
    .on('click', () => {

      var _forceX =d3.forceX(function(d) {
          if (d.race === 'White' || d.race === 'Native American') {
            return _w/4;
          } else if (d.race === 'Hispanic' || d.race === 'Pacific Islander'){
            return _w/2;
          }else if (d.race === 'Black' || d.race === 'Asian'){
            return 3*_w/4;
          }else if (d.race === 'Unknown race'){
            return _w/4;
          }else{
            return _w/2;
          }
        }).strength(0.7);


         var _forceY = d3.forceY(function(d) {
          if (d.race === 'White'|| d.race === 'Hispanic'|| d.race === 'Black') {
            return _h/4;
          } else if (d.race === 'Native American'|| d.race === 'Pacific Islander'|| d.race === 'Asian'){
            return 2*_h/4;
          } else if (d.race === 'Unknown race'){
            return 3*_h/4;
          }else{
            return _h/2
          }
        }).strength(0.7);

      const bubbleRace = bubble
      .forceX(_forceX)
      .forceY(_forceY)
      .restart();
    });

    const stateButton = d3.select('#btn4')
        .on('click', () => {




          //var _forceX = d3.forceX(function(d){ return d.mx}).strength(0.7);

          //var _forceY = d3.forceY(function(d){ return d.my}).strength(0.7);



        //const bubbleState = bubble
        //.forceX(_forceX)
        //.forceY(_forceY)
        //.restart();
        });
