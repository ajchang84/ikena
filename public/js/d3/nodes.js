var d3Chart = {};

// create svg on el
d3Chart.create = function(el, props, state){
  var svg = d3.select(el).append('svg')
      .attr('width', props.width)
      .attr('height', props.height);
  this.update(svg, state);
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
    .sort(null)
    .size([diameter, diameter])
    .value(function(d) { return d.size/100; })
    .padding(1.0)
    .nodes(json)

  // remove root from data array
  bubble.shift();

  // uses d3-tip library to create tooltip on hover
  var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([0, 0])
  .html(function(d) {
    return "<p>" + d.name + "</p><strong>Score:</strong> <span style='color:red'>" + d.size + "</span>";
  })

  el.call(tip);

  var nodes = el.selectAll('.d3-node')
    .data(bubble).enter().append('g')
    .attr('class', 'd3-node')
    .attr("transform",function(d){
      return "translate("+d.x+","+d.y+")";
    });
  // ENTER
  nodes.append('a')
      .attr("xlink:href", "http://en.wikipedia.org/wiki/")
      .append('circle')
      // .transition()
      // .duration(750)
      .attr('r', function(d, i) { return d.size/100 })
      .attr('fill', function(d,i) {return color(i)})
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)



};