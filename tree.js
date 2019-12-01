// Construct the final array 
async function createTree() {

   // Retrieve a WikiData-useful identifier of the drug provided
   

   // Wait for the Promise to be resolved and then return it
  let output = await finaliseResults();

  tree = data => {
  const root = d3.hierarchy(data);
  root.dx = 10;
  root.dy = width / (root.height + 1);
  return d3.tree().nodeSize([root.dx, root.dy])(root);
}
chart = {
  root = tree(output);

  let x0 = Infinity;
  let x1 = -x0;
  root.each(d => {
    if (d.x > x1) x1 = d.x;
    if (d.x < x0) x0 = d.x;
  });

  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, x1 - x0 + root.dx * 2]);
  
  const g = svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("transform", `translate(${root.dy / 3},${root.dx - x0})`);
    
  const link = g.append("g")
    .attr("fill", "none")
    .attr("stroke", "#555")
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width", 1.5)
  .selectAll("path")
    .data(root.links())
    .join("path")
      .attr("d", d3.linkHorizontal()
          .x(d => d.y)
          .y(d => d.x));
  
  const node = g.append("g")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
    .selectAll("g")
    .data(root.descendants())
    .join("g")
      .attr("transform", d => `translate(${d.y},${d.x})`);

  node.append("circle")
      .attr("fill", d => d.children ? "#555" : "#999")
      .attr("r", 2.5);

  node.append("text")
      .attr("dy", "0.31em")
      .attr("x", d => d.children ? -6 : 6)
      .attr("text-anchor", d => d.children ? "end" : "start")
      .text(d => d.data.name)
    .clone(true).lower()
      .attr("stroke", "white");
  
  return svg.node();
}

width = 932
d3 = require("d3@5")
// var margin = {top: 30, right: 20, bottom: 30, left: 20},
//     width = 960,
//     barHeight = 20,
//     barWidth = (width - margin.left - margin.right) * 0.8;

// var i = 0,
//     duration = 400,
//     root;

// var diagonal = d3.linkHorizontal()
//     .x(function(d) { return d.y; })
//     .y(function(d) { return d.x; });

// var svg = d3.select("body").append("svg")
//     .attr("width", width) // + margin.left + margin.right)
//   .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
// console.log('report1');

//   root = d3.hierarchy(output);
//   console.log(root);
//   root.x0 = 0;
//   root.y0 = 0;
//   update(root);

// function update(source) {
//   console.log('report2');
//   // Compute the flattened node list.
//   var nodes = root.descendants();

//   var height = Math.max(500, nodes.length * barHeight + margin.top + margin.bottom);

//   d3.select("svg").transition()
//       .duration(duration)
//       .attr("height", height);

//   d3.select(self.frameElement).transition()
//       .duration(duration)
//       .style("height", height + "px");

//   // Compute the "layout". TODO https://github.com/d3/d3-hierarchy/issues/67
//   var index = -1;
//   root.eachBefore(function(n) {
//     n.x = ++index * barHeight;
//     n.y = n.depth * 20;
//   });

//   // Update the nodes…
//   var node = svg.selectAll(".node")
//     .data(nodes, function(d) { return d.id || (d.id = ++i); });

//   var nodeEnter = node.enter().append("g")
//       .attr("class", "node")
//       .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
//       .style("opacity", 0);

//   // Enter any new nodes at the parent's previous position.
//   nodeEnter.append("rect")
//       .attr("y", -barHeight / 2)
//       .attr("height", barHeight)
//       .attr("width", barWidth)
//       .style("fill", color)
//       .on("click", click);
//   nodeEnter.append("text")
//       .attr("dy", 3.5)
//       .attr("dx", 5.5)
//       .text(function(d) { return d.data.name; });

//   // Transition nodes to their new position.
//   nodeEnter.transition()
//       .duration(duration)
//       .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
//       .style("opacity", 1);

//   node.transition()
//       .duration(duration)
//       .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
//       .style("opacity", 1)
//     .select("rect")
//       .style("fill", color);

//   // Transition exiting nodes to the parent's new position.
//   node.exit().transition()
//       .duration(duration)
//       .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
//       .style("opacity", 0)
//       .remove();

//   // Update the links…
//   var link = svg.selectAll(".link")
//     .data(root.links(), function(d) { return d.target.id; });

//   // Enter any new links at the parent's previous position.
//   link.enter().insert("path", "g")
//       .attr("class", "link")
//       .attr("d", function(d) {
//         var o = {x: source.x0, y: source.y0};
//         return diagonal({source: o, target: o});
//       })
//     .transition()
//       .duration(duration)
//       .attr("d", diagonal);

//   // Transition links to their new position.
//   link.transition()
//       .duration(duration)
//       .attr("d", diagonal);

//   // Transition exiting nodes to the parent's new position.
//   link.exit().transition()
//       .duration(duration)
//       .attr("d", function(d) {
//         var o = {x: source.x, y: source.y};
//         return diagonal({source: o, target: o});
//       })
//       .remove();

//   // Stash the old positions for transition.
//   root.each(function(d) {
//     d.x0 = d.x;
//     d.y0 = d.y;
//   });
// }

// // Toggle children on click.
// function click(d) {
//   console.log('report3');
//   if (d.children) {
//     d._children = d.children;
//     d.children = null;
//   } else {
//     d.children = d._children;
//     d._children = null;
//   }
//   update(d);
// }

// function color(d) {
//   return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
// }
}
