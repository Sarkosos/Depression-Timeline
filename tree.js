// Construct the final array 
async function createTree() {

   // Retrieve a WikiData-useful identifier of the drug provided
   

   // Wait for the Promise to be resolved and then return it
  let output = await finaliseResults();
  console.log(output);

//   var margin = {top: 0, right: 320, bottom: 0, left: 0},
//       width = 960 - margin.left - margin.right,
//       height = 500 - margin.top - margin.bottom;

//   var tree = d3.layout.tree()
//       .separation(function(a, b) { return a.parent === b.parent ? 1 : .5; })
//       .children(function(d) { return d.parents; })
//       .size([height, width]);

//   var svg = d3.select("body").append("svg")
//       .attr("width", width + margin.left + margin.right)
//       .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//   root = JSON.parse( output ); //add this line
 

//   var nodes = tree.nodes(root);

//   var link = svg.selectAll(".link")
//       .data(tree.links(nodes))
//     .enter().append("path")
//       .attr("class", "link")
//       .attr("d", elbow);

//   var node = svg.selectAll(".node")
//       .data(nodes)
//     .enter().append("g")
//       .attr("class", "node")
//       .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

//   node.append("text")
//       .attr("class", "name")
//       .attr("x", 8)
//       .attr("y", -6)
//       .text(function(d) { return d.name; });

//   node.append("text")
//       .attr("x", 8)
//       .attr("y", 8)
//       .attr("dy", ".71em")
//       .attr("class", "about lifespan")
//       .text(function(d) { return d.born + "–" + d.died; });

//   node.append("text")
//       .attr("x", 8)
//       .attr("y", 8)
//       .attr("dy", "1.86em")
//       .attr("class", "about location")
//       .text(function(d) { return d.location; });


// function elbow(d, i) {
//   return "M" + d.source.y + "," + d.source.x
//        + "H" + d.target.y + "V" + d.target.x
//        + (d.target.children ? "" : "h" + margin.right);
// }
var margin = {top: 30, right: 20, bottom: 30, left: 20},
    width = 960,
    barHeight = 20,
    barWidth = (width - margin.left - margin.right) * 0.8;

var i = 0,
    duration = 400,
    root;

var diagonal = d3.linkHorizontal()
    .x(function(d) { return d.y; })
    .y(function(d) { return d.x; });

var svg = d3.select("body").append("svg")
    .attr("width", width) // + margin.left + margin.right)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
console.log('report1');

  root = d3.hierarchy(output);
  console.log(root);
  root.x0 = 0;
  root.y0 = 0;
  update(root);

function update(source) {
  console.log('report2');
  // Compute the flattened node list.
  var nodes = root.descendants();

  var height = Math.max(500, nodes.length * barHeight + margin.top + margin.bottom);

  d3.select("svg").transition()
      .duration(duration)
      .attr("height", height);

  d3.select(self.frameElement).transition()
      .duration(duration)
      .style("height", height + "px");

  // Compute the "layout". TODO https://github.com/d3/d3-hierarchy/issues/67
  var index = -1;
  root.eachBefore(function(n) {
    n.x = ++index * barHeight;
    n.y = n.depth * 20;
  });

  // Update the nodes…
  var node = svg.selectAll(".node")
    .data(nodes, function(d) { return d.id || (d.id = ++i); });

  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .style("opacity", 0);

  // Enter any new nodes at the parent's previous position.
  nodeEnter.append("rect")
      .attr("y", -barHeight / 2)
      .attr("height", barHeight)
      .attr("width", barWidth)
      .style("fill", color)
      .on("click", click);
  console.log(node);
  nodeEnter.append("text")
      .attr("dy", 3.5)
      .attr("dx", 5.5)
      .text(function(d) { return d.data.name; });

  // Transition nodes to their new position.
  nodeEnter.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
      .style("opacity", 1);

  node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
      .style("opacity", 1)
    .select("rect")
      .style("fill", color);

  // Transition exiting nodes to the parent's new position.
  node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .style("opacity", 0)
      .remove();

  // Update the links…
  var link = svg.selectAll(".link")
    .data(root.links(), function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      })
    .transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition links to their new position.
  link.transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove();

  // Stash the old positions for transition.
  root.each(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

// Toggle children on click.
function click(d) {
  console.log('report3');
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update(d);
}

function color(d) {
  return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
}
}
