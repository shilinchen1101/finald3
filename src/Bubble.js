import * as d3 from 'd3';
// import Button from './Button'


function Bubble(_){

  let _w;
  let _h;

  let nodes;
  let _forceX, _forceY,_forceCollide, _forceSimulation;



  function exports(deaths){
    //var margin = { top: 20, right: 210, bottom: 50, left: 70 };
    _w = _.clientWidth;
    _h = _.clientHeight;

    const projection = d3.geoAlbersUsa()
           .translate([_w/2, _h/4])
           .scale([1000]);

    const path = d3.geoPath()
        .projection(projection);

    nodes = deaths.map(d => {
      const [mx,my] = projection([d.lon, d.lat]);
      return{
        radius: 3,
        x: Math.random() * _w,
        y: Math.random() * _h,
        mx,
        my,
        ...d
      }
    });

    console.log(nodes);
    // _forceSimulation.nodes(nodes);
    //return nodes;

    const root = d3.select(_);
    const tooltip = d3.select("body").append("div").attr("class", "toolTip");

    const nestByUnarmed = d3.nest().key(function(d){ return d.unarmed}).entries(deaths)

    const unarmed = nestByUnarmed.map(function(d){ return d.key });
    console.log(unarmed);

    const nestByMonth = d3.nest().key(function(d){ return d.month}).entries(deaths)

    const month = nestByMonth.map(function(d){ return d.key });
    console.log(month);

    const nestByRace = d3.nest().key(function(d){ return d.race}).entries(deaths)

    const race = nestByRace.map(function(d){ return d.key });
    console.log(race);

    const fillColor = d3.scaleOrdinal()
      .domain(unarmed)
      .range(['#3b4073','#560909','#94B8B8','#e6e8d2']);

    let svg = root
      .selectAll('.bubbleChart')
      .data([1]);

    svg = svg.enter().append('svg')
      .attr('class','bubbleChart')
      .merge(svg)
      .attr('width',_w)
			.attr('height',_h)
			.style('top',0)
			.style('left',0);

    const myNodes = svg.selectAll('.dots')
			.data(nodes);
		const nodesEnter = myNodes.enter()
			.append('g')
			.attr('class','dots');
    myNodes.exit().remove();
		nodesEnter
      .append('circle')
      .attr('r', d => d.radius)
      .attr('fill',function(d){ return fillColor(d.unarmed);})


		const bubbles = nodesEnter
			.merge(myNodes)
			.attr('transform', d => `translate(${d.x}, ${d.y})`)
      .on("mousemove", function(d){
          tooltip
            .style("left", d3.event.pageX - 50 + "px")
            .style("top", d3.event.pageY - 70 + "px")
            .style("display", "inline-block")
            .html("Name:"+ (d.name) + "<br>" + 'Age:'+(d.age) + "<br>" + 'Gender:' + (d.gender)+ "<br>" + 'Race:'+(d.race)+ "<br>" + 'Date:'+(d.t));
      })
      .on("mouseout", function(d){ tooltip.style("display", "none");});


      const legend = d3.select('.bubbleChart').append('svg')
             .attr('class','legend')
             .attr('width',_w)
             .attr('height',_h)
             .selectAll('g')
             .data(unarmed)
   				   .enter()
             .append('g')
             .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

             legend.append("rect")
           		  .attr("width", 18)
           		  .attr("height", 18)
           		  .style("fill", fillColor);

          	legend.append("text")
          		  .data(unarmed)
              	  .attr("x", 24)
              	  .attr("y", 9)
              	  .attr("dy", ".35em")
              	  .text(function(d) { return d; });

      const label = d3.select('.bubbleChart').append(svg)
        .data(race)

      label.enter().append('text')
        .attr('clss','label')
        .attr('x', function(d){ return })



      d3.json("./data/us-states.json").then(_map => {
        console.log(_map);

      const svgMap = d3.select(_).append('svg')
             .attr('class','map')
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


       });







    const center = { x: _w / 2, y: _h / 3 };
    _forceX = d3.forceX().strength(1).x(center.x);
    _forceY = d3.forceY().strength(1).y(center.y);




  _forceCollide = d3.forceCollide(3).radius(function(d) { return d.radius + 4; }).strength(0.7)

 // const simulation = _forceSimulation
  _forceSimulation = d3.forceSimulation()
    .force("collide", _forceCollide )
    .force("charge", d3.forceManyBody().strength(0.5))
    // .restart()
    .alpha(0.06)
    .force('x', _forceX)
    .force('y', _forceY)
    .nodes(nodes)
    .on('tick', ticked);


      function ticked() {
        bubbles
          .attr('transform', d => `translate(${d.x}, ${d.y})`);
      };
}

exports.forceX = function (_) {
  if(typeof _ === 'undefined') return _forceX;
  _forceX =_;
  return this;
}
exports.forceY = function (_) {
  if(typeof _ === 'undefined') return _forceY;
  _forceY =_;
  return this;
}
exports.forceCollide = function (_) {
  if(typeof _ ==='undefined') return _forceCollide;
  _forceCollide =_;
  return this;
}

exports.restart = function (_) {
  _forceSimulation
    .stop()
    .force("collide", _forceCollide )
    .force('x',_forceX)
    .force('y',_forceY)
    .alpha(0.06)
    .restart();
  return this;
}

  return exports;
}

export default Bubble;
