const force = {
  create(props) {
    var width = 960,
        height = 660,
        rootNode ={};

    var svg = d3.select("#force").append("svg")
        .attr("width", width)
        .attr("height", height);

    rootNode = {'root': true, 'name': props[0].data.children[0].data.title, 'size': props[0].data.children[0].data.score}
    
    function parse(children) {
      var nodeArray = [];
      children.forEach(function(child){
        var node = {};
        if(child.data.body) {
          node.name = child.data.body;
          node.size = child.data.score;
          if (child.data.replies) node.children = parse(child.data.replies.data.children)
          nodeArray.push(node)          
        }
      })
      return nodeArray;
    }
    rootNode.children = parse(props[1].data.children)
    this.update(svg, rootNode);
  },

  update(svg, rootNode) {

    // tooltip
    var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([0, 0])
    .html(function(d) {
      return "<p>" + d.name + "</p><strong>Score:</strong> <span style='color:red'>" + d.size + "</span>";
    })

    function tick() {
      link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      node.attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
    }

    var force = d3.layout.force()
        .size([960, 660])
        .on("tick", tick)
    svg.call(tip);

    var link = svg.selectAll(".link"),
        node = svg.selectAll(".node");

    var nodes = this.flatten(rootNode),
        links = d3.layout.tree().links(nodes);
    // Restart the force layout.
    force
        .nodes(nodes)
        .links(links)
        .linkDistance(2)
        .charge(-100)
        .start();

    // Update the links…
    link = link.data(links, function(d) { return d.target.id; });

    // Exit any old links.
    link.exit().remove();

    // Enter any new links.
    link.enter().insert("line", ".node")
        .attr("class", "link")
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; })
        .style("opacity",0.8);

    // Update the nodes…
    node = node.data(nodes, function(d) { return d.id; }).style("fill", this.color);

    // Exit any old nodes.
    node.exit().remove();

    // Enter any new nodes.
    node.enter().append("circle")
        .attr("class", "node")
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", function(d) { 
          if (!d.root) return 3 + Math.sqrt(d.size) || 3; 
          else return 3 + Math.sqrt(d.size/100);
        })
        .style("fill", this.color)
        .style("opacity",0.8)
        .on("click", function(d){
          if (!d3.event.defaultPrevented) {
            if (d.children) {
              d._children = d.children;
              d.children = null;
            } else {
              d.children = d._children;
              d._children = null;
            }
            this.update(svg, rootNode)
          }
        }.bind(this))
        .call(force.drag);
  },

  // Color nodes with negative upvotes red, the rest blue
  color(d) {
    return d._children ? "#3182bd"
            : d.root ? '#2196F3' 
            : d.children 
              ? d.size < 1 ? "red" : "#c6dbef" 
            : "#c6dbef";
  },

  // Returns a list of all nodes under the root.
  flatten(rootNode) {
    var nodes = [], i = 0;

    function recurse(node) {
      if (node.children) node.children.forEach(recurse);
      if (!node.id) node.id = ++i;
      nodes.push(node);
    }
    recurse(rootNode);
    return nodes;
  } 
}

