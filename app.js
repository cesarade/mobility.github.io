
const drawMap = async () => {
    
    const path = d3.geoPath(projection);

    const dataset = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
    
    const countries = topojson
        .feature(dataset, dataset.objects.countries);
        
    ctr.selectAll('path')
        .data(countries.features)
        .enter()
        .append('path')
        .attr('fill',  '#f4f4f4')
        .attr('stroke', '#999')
        // .attr('class', 'country')
        .attr('d', path)
    
}

const drawLine = async (year) => {

    let dataset = await d3.csv('out.csv')

    
    const latAccesor = (d) => d
    const logAccesor = (d) => d

    dataset = dataset.filter((d) => {
        return d.year == year
    });

    const lines = ctr.append('g')

    lines.selectAll('line')
        .data(dataset)
        .join('line')
        .style("stroke", (d) => colors[d.source_subregion.trim()])
        .style("stroke-width", 0.03)
        .attr("opacity", 0.25)
        .attr("x1", (d) => projection([d.sou_longitude,d.sou_latitude])[0])
        .attr("y1", (d) => projection([d.sou_longitude,d.sou_latitude])[1])
        .attr("x2", (d) => projection([d.tar_longitude,d.tar_latitude])[0])
        .attr("y2", (d) => projection([d.tar_longitude,d.tar_latitude])[1])
    
}

const drawBubble = async (year) => {

    let dataset = await d3.csv('bubble_map.csv')

    const latAccesor = (d) => d.tar_latitude
    const logAccesor = (d) => d.tar_longitude

    const hAccesor = (d) => parseInt(d.estimated_trips)

    const hScale = d3.scaleLinear()
        .domain(d3.extent(dataset, hAccesor))
        .rangeRound([2, 30])

    dataset = dataset.filter((d) => {
        return d.year == year
    });

    const bubbles = ctr.append('g')

    bubbles.selectAll('circle')
        .data(dataset)
        .join('circle')
        .attr('cx', (d) => projection([d.tar_longitude,d.tar_latitude])[0])
        .attr('cy', (d) => projection([d.tar_longitude,d.tar_latitude])[1])
        .attr('r', (d) => hScale(d.estimated_trips))
        .attr("opacity", 0.70)
        .attr("fill", (d) => colors[d.target_subregion.trim()])
}

const width = 900;
const height = 600;

const svg = d3.select('#chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

const ctr = svg.append('g');

const projection = d3.geoMercator()
        .scale(120)
        .translate([width / 2, height / 1.4])



var colors = {
    "Western Europe": "#F05454",
    "Eastern Europe": "#FA3CCC",
    "Southern Europe": "#47CFE0",
    "Northern Europe": "#A344F0",
    "Western Asia": "#7032FA",
    "Northern America": "#F77940",
    "Eastern Asia": "#43A34C",
    "Northern Africa": "#46E030",
    "Latin America and the Caribbean": "#344DF0",
    "South-eastern Asia": "#F0B938",
    "Southern Asia": "#F8FA0A",
    "Sub-Saharan Africa": "#6F78FA",
    "Australia and New Zealand": "#7C62F0",
    "Central Asia": "#FF7F0E",
    "Melanesia": "#E2E5EC",
    "Micronesia": "#E2E5EC",
    "Polynesia": "#E2E5EC"
};


const year = 2011
document.getElementById('rangeValue').innerHTML = year;

const showVal = async (value) => {
    document.getElementById('rangeValue').innerHTML = value;
    ctr.selectAll("circle").remove()
    ctr.selectAll("line").remove()
    await drawBubble(value)
    await drawLine(value)
}

const main = async () => {
    await drawMap()
    await drawBubble(year)
    await drawLine(year)
}

main()


