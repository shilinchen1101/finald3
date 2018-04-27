import * as d3 from 'd3';
// import Button from './Button'


function Bubble(_){

  let _w;
  let _h;


  let nodes;
  let _forceX, _forceY,_forceCollide, _forceSimulation;
  const dispatcher = d3.dispatch ('getMapData');


  function exports(deaths){

    _w = _.clientWidth;
    _h = _.clientHeight;

    const projection = d3.geoAlbersUsa()
           .translate([_w/2, _h/4])
           .scale([1000]);

    const path = d3.geoPath()
        .projection(projection);
//data transformation
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


    const root = d3.select(_);
//add tooltip
    const tooltip = d3.select("body").append("div").attr("class", "toolTip");
//add legend
    const nestByUnarmed = d3.nest().key(function(d){ return d.unarmed}).entries(deaths)

    const unarmed = nestByUnarmed.map(function(d){ return d.key });

    const fillColor = d3.scaleOrdinal()
      .domain(unarmed)
      .range(['#3b4073','#560909','#94B8B8','#E2A370']);
//append dom elements
    let svg = root
      .selectAll('bubbleChart')
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
        var bubbles = d3.select(this);
        bubbles
          .attr("stroke-width", 3)
          .attr('stroke','#D2BBB0');
          tooltip
            .style("left", d3.event.pageX - 50 + "px")
            .style("top", d3.event.pageY - 120 + "px")
            .style("display", "inline-block")
            .html("Name:"+ (d.name) + "<br>" + 'Age:'+(d.age) + "<br>" + 'Gender:' + (d.gender)+ "<br>" + 'Race:'+(d.race) + "<br>" + 'State:'+(d.state)+"<br>" + 'Date:'+(d.date));
      })
      .on("mouseout", function(d){
        d3.select(this)
          .attr('stroke-opacity','0')
        tooltip.style("display", "none");
      });

//draw legends to show catagories
      const legend = d3.select('svg').append('svg')
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
//add labels
          var victimTitle = {'1142':{x:_w/2,y:_h/2}};
          var victimData = d3.keys(victimTitle);
          var victim = svg.selectAll('.victim')
            .data(victimData);
          victim.enter().append('text')
            .attr('class', 'victim')
            .attr('x', function (d) { return victimTitle[d].x; })
            .attr('y', function (d) { return victimTitle[d].y - 220; })
            .attr('text-anchor', 'middle')
            .text(function (d) { return d; });
         d3.selectAll('.victim').style('opacity', 1);



          var monthTitleX = {
              'January:106': { x: _w/5, y: _h/4 },
              'February:107': { x:2*_w/5, y: _h/4 },
              'March:93': { x:3*_w/5, y: _h/4 },
              'April:75': { x:4*_w/5, y: _h/4 },
              'May:99': { x:_w/5, y: 2*_h/4 },
              'June:98': { x:2*_w/5, y: 2*_h/4 },
              'July:113': { x:3*_w/5, y: 2*_h/4 },
              'August:95': { x:4*_w/5, y: 2*_h/4 },
              'September:76': { x:_w/5, y: 3*_h/4 },
              'October:94': { x:2*_w/5, y: 3*_h/4 },
              'November:99': { x:3*_w/5, y: 3*_h/4 },
              'December:87': { x:4*_w/5, y: 3*_h/4 }
            };

      var monthData = d3.keys(monthTitleX);
       var month = svg.selectAll('.month')
         .data(monthData);
         console.log(monthData);
       month.enter().append('text')
         .attr('class', 'month')
         .attr('x', function (d) { return monthTitleX[d].x; })
         .attr('y', function (d) { return monthTitleX[d].y - 80; })
         .attr('text-anchor', 'middle')
         .text(function (d) { return d; });
      d3.selectAll('.month').style('opacity', 0);

      var raceTitleX = {
          'White:524': { x: _w/4, y: _h/4 },
          'Hispanic:238': { x:_w/2, y: _h/4 },
          'Black:284': { x:3*_w/4, y: _h/4 },
          'Unknown race:50': { x:_w/4, y: 8*_h/10 },
          'Native American:27': { x:_w/4, y: 3*_h/5 },
          'Pacific Islander:7': { x:_w/2, y: 3*_h/5 },
          'Asian:12': { x:3*_w/4, y: 3*_h/5 }
        };

        var raceData = d3.keys(raceTitleX);
         var race = svg.selectAll('.race')
           .data(raceData);
         race.enter().append('text')
           .attr('class', 'race')
           .attr('x', function (d) { return raceTitleX[d].x; })
           .attr('y', function (d) { return raceTitleX[d].y - 80; })
           .attr('text-anchor', 'middle')
           .text(function (d) { return d; });
      d3.selectAll('.race').style('opacity', 0);
        var raceData = d3.keys(raceTitleX);
         var race = svg.selectAll('.race')
           .data(raceData);
         race.enter().append('text')
           .attr('class', 'race')
           .attr('x', function (d) { return raceTitleX[d].x; })
           .attr('y', function (d) { return raceTitleX[d].y - 80; })
           .attr('text-anchor', 'middle')
           .text(function (d) { return d; });
      d3.selectAll('.race').style('opacity', 0);


        var raceData = d3.keys(raceTitleX);
         var race = svg.selectAll('.race')
           .data(raceData);
         race.enter().append('text')
           .attr('class', 'race')
           .attr('x', function (d) { return raceTitleX[d].x; })
           .attr('y', function (d) { return raceTitleX[d].y - 80; })
           .attr('text-anchor', 'middle')
           .text(function (d) { return d; });
      d3.selectAll('.race').style('opacity', 0);






//draw map
      d3.json("./data/us-states.json").then(_map => {
        console.log(_map);

      const svgMap = d3.select(_).append('svg')
             .attr('class','map')
             .attr('width',_w)
             .attr('height',_h)
             .append('g')
             .attr('class','map-g')
             .attr('transform', 'translate(0, 200)')
             .style('position','absolute')
             .style('top',0)
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
          dispatcher.call('getMapData', this, stateData)

          d3.selectAll('.map').style('opacity', 0);
       });





//set forcelayout related
    const center = { x: _w / 2, y: _h / 2 };
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

exports.on = function (event, cb) {
  dispatcher.on(event, cb)
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
