
var margin = {top: 0, right: 320, bottom: 0, left: 0},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var tree = d3.layout.tree()
    .separation(function(a, b) { return a.parent === b.parent ? 1 : .5; })
    .children(function(d) { return d.parents; })
    .size([height, width]);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json( function( variTest) {
 // if (error) throw error;

  var nodes = tree.nodes(json);

  var link = svg.selectAll(".link")
      .data(tree.links(nodes))
    .enter().append("path")
      .attr("class", "link")
      .attr("d", elbow);

  var node = svg.selectAll(".node")
      .data(nodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

  node.append("text")
      .attr("class", "name")
      .attr("x", 8)
      .attr("y", -6)
      .text(function(d) { return d.name; });

  node.append("text")
      .attr("x", 8)
      .attr("y", 8)
      .attr("dy", ".71em")
      .attr("class", "about lifespan")
      .text(function(d) { return d.born + "–" + d.died; });

  node.append("text")
      .attr("x", 8)
      .attr("y", 8)
      .attr("dy", "1.86em")
      .attr("class", "about location")
      .text(function(d) { return d.location; });
});

function elbow(d, i) {
  return "M" + d.source.y + "," + d.source.x
       + "H" + d.target.y + "V" + d.target.x
       + (d.target.children ? "" : "h" + margin.right);
}


let variTest = {
  "name": "Clifford Shanks",
  "born": 1862,
  "died": 1906,
  "location": "Petersburg, VA",
  "parents": [
    {
      "name": "James Shanks",
      "born": 1831,
      "died": 1884,
      "location": "Petersburg, VA",
      "parents": [
        {
          "name": "Robert Shanks",
          "born": 1781,
          "died": 1871,
          "location": "Ireland/Petersburg, VA"
        },
        {
          "name": "Elizabeth Shanks",
          "born": 1795,
          "died": 1871,
          "location": "Ireland/Petersburg, VA"
        }
      ]
    },
    {
      "name": "Ann Emily Brown",
      "born": 1826,
      "died": 1866,
      "location": "Brunswick/Petersburg, VA",
      "parents": [
        {
          "name": "Henry Brown",
          "born": 1792,
          "died": 1845,
          "location": "Montgomery, NC"
        },
        {
          "name": "Sarah Houchins",
          "born": 1793,
          "died": 1882,
          "location": "Montgomery, NC"
        }
      ]
    }
  ]
};