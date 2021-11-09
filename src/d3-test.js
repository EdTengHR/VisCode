const svg = d3.select('body').append('svg')

var lightBlue = '#D5E1EC'
var darkBlue = '#3467b9'
var textColor = '#383B3E'

var canvas = svg.append('g')

canvas.append('rect')
    .attr('x', 85)
    .attr('y', 99.5)
    .attr('height', 31)
    .attr('width', 15)
    .attr('fill', darkBlue)
    .attr('style', 'solid')

for (let i = 0; i < 3; i++) {
    canvas.append('circle')
    .attr('cx', 92.5)
    .attr('cy', 108 + i * 7)
    .attr('r', 2)
    .attr('fill', lightBlue)
    .attr('style', 'solid')
}

canvas.append('rect')
    .attr('x', 100)
    .attr('y', 100)
    .attr('height', 30)
    .attr('width', 55)
    .attr('stroke-width', 1)
    .attr('fill', lightBlue)
    .attr('style', 'solid')
    .attr('stroke', darkBlue)

canvas.append('text')
    .attr('x', 106)
    .attr('y', 120)
    .attr('stroke', textColor)
    .style("font-size", 20)
    .text("num")

canvas.append('rect')
    .attr('x', 155)
    .attr('y', 100)
    .attr('height', 30)
    .attr('width', 55)
    .attr('stroke-width', 1)
    .attr('fill', lightBlue)
    .attr('style', 'solid')
    .attr('stroke', darkBlue)

canvas.append('text')
    .attr('x', 161)
    .attr('y', 120)
    .attr('stroke', textColor)
    .style("font-size", 20)
    .text("123")

//line        
canvas.append("svg:defs").append("svg:marker")
    .attr("id", "triangle")
    .attr("refX", 6)
    .attr("refY", 6)
    .attr("markerWidth", 30)
    .attr("markerHeight", 30)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M 0 0 12 6 0 12 3 6")
    .style("fill", "black")

var lineToggle = 0  // set to 0 when line is in original state
var arrow1 = canvas.append("line")
    .attr('x1', 210)
    .attr('y1', 115)
    .attr('x2', 310)
    .attr('y2', 115)          
    .attr('stroke-width', 2)
    .attr('stroke', 'black')  
    .attr('marker-end', 'url(#triangle)')

canvas.append('line')
    .attr('x1', 210)
    .attr('y1', 115)
    .attr('x2', 310)
    .attr('y2', 115)          
    .attr('stroke-width', 20)
    .attr('stroke', 'transparent')  
    .on('click', function (event, d) {
    if (lineToggle) {
        d3.selectAll(arrow1)
        .attr('x2', 310)
        .attr('y2', 115)
        d3.select(this)
        .attr('x2', 310)
        .attr('y2', 115)
        lineToggle = 0
    }
    else {
        d3.selectAll(arrow1)
        .attr('x2', 410)
        .attr('y2', 300)
        d3.select(this)
        .attr('x2', 410)
        .attr('y2', 300)
        lineToggle = 1
    }
    })