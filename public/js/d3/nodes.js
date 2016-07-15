var d3Chart = {};

// create svg on el
d3Chart.create = function(el, props, state){
  d3.select('svg').remove();

  var svg = d3.select(el).append('svg')
    .attr('width', props.width)
    .attr('height', props.height);

  this._drawNodes(svg, state);
};

// update svg
d3Chart.update = function(svg, state) {

  this._drawNodes(svg, state);
};

// draw nodes using layout.pack()
d3Chart._drawNodes = function(el, data) {
  // creation of json object needed for layout.pack()
  json = {};
  json.name = 'root';
  json.children = [];
  data.forEach(function(val){
    json.children.push({name: val.data.title, size: val.data.score})
  });

  // configurations
  var diameter = 960,
    format = d3.format(",d"),
    color = d3.scale.category20b();

  // unpacks json into data array called bubble
  var bubble = d3.layout.pack()
    // .sort(null)
    .size([diameter, diameter])
    .value(function(d) { return d.size; })
    // .padding(1.5)
    // .nodes(json)

  // uses d3-tip library to create tooltip on hover
  var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([0, 0])
  .html(function(d) {
    return "<p>" + d.name + "</p><strong>Score:</strong> <span style='color:red'>" + d.size + "</span>";
  })

  el.call(tip);

  var nodes = el.selectAll('.d3-node')
    .data(bubble.nodes(json)
    .filter(function(d) {return !d.children}))
    .enter().append('g')
    .attr('class', 'd3-node')
    .attr("transform",function(d){
      return "translate("+d.x+","+d.y+")";
    });

  // ENTER
  nodes.append('a')
      .attr("xlink:href", "http://en.wikipedia.org/wiki/")
      .append('circle')
      .attr('r', 0)
      .attr('fill', 'white')
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
      .transition()
      .duration(2000)
      .attr('r', function(d, i) { if(d.size <= 500) return 4 ; else return d.size/90 })
      .attr('fill', function(d,i) {return color(i)})
};