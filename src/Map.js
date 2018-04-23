import * as d3 from 'd3';
import Bubble from './Bubble';

function Map(_){

  let _w;
  let _h;
  let _map;



  function exports(deaths){


    _w = _.clientWidth;
    _h = _.clientHeight;
    const margin = {top: 20, right: 20, bottom: 30, left: 50};


    d3.json("./data/us-states.json").then(_map => {
      console.log(_map);

    const svgMap = d3.select(_).append('svg')
           .attr('width',_w)
           .attr('height',_h)
           .style('position','absolute')
           .style('top',200)
           .style('left',0);
    const projection = d3.geoAlbersUsa()
				   .translate([_w/2, _h/4])
				   .scale([1000]);

    const path = d3.geoPath()
        .projection(projection);


    svgMap.selectAll("path")
      	.data(_map.features)
      	.enter()
      	.append("path")
      	.attr("d", path)
        .attr("stroke","#FFFFFF")
        .attr("fill",'rgba(0, 30, 64, .1)');



    const stateData = d3.map(_map.features,function(d){return d.properties.name});
    console.log(stateData);

    // const m = path.centroid(function(d){return d.state}),
    //       x = m[0]
    // console.log(m);
     });



    exports.map = function (_) {
      if(typeof _ === 'undefined') return _map;
      _map =_;
      return this;
    }




  }
  return exports;
}
export default Map;
