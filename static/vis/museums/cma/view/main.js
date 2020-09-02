// Configurable vars
let w = 800;
let h = 400;
let chartIds = [
    'countbydept',
    'ondisplaybydept',
    'countbytype',
    'ppdbydept',
    'typesbydept',
    'growthperyear'
];

// Internal vars
let dataset;
let tooltip;
let charts = {};

/**
 * Maps the row to a summarized result
 * @param {*} d - d3-parsed csv row
 */
const rowMap = (d) => {
    return {
        accession_number: d.accession_number,
        department: d.department,
        on_display: (d.current_location !== ''), // if there's a location, it's on display (no location given for archives, etc.)
        public_domain: (d.share_license_status === 'CC0'),
        type: d.type
    }
};

/**
 * Summatizes pre-mapped dataset
 * Output contains the following:
 * * Total works
 * * Works on display
 * * Works under public domain license
 * * Departments
 *   * Total, on display, and public domain per each
 * * Types
 *   * Total, on display, and public domain per each
 * * Cross-references in each department and type for how many of the other kind per each of its own kind
 * * Accession year stats
 * @param {*} data - d3-parsed data, after mapping by rowMap
 */
const summarizeData = (data) => {
    return data.reduce((a, v) => {
        // If department unknown, create new entry
        if(!Object.keys(a.depts).includes(v.department)) {
            a.depts[v.department] = {
                on_display: 0,
                public_domain: 0,
                total: 0,
                types: {}
            };
        }
        // If type unknown, create new entry
        if(!Object.keys(a.types).includes(v.type)) {
            a.types[v.type] = {
                depts: {},
                on_display: 0,
                public_domain: 0,
                total: 0
            };
        }

        // Add to overall and specific totals
        a.total++;
        a.depts[v.department].total++;
        a.types[v.type].total++;

        // Add to overall and specific counts for public domain works if applicable
        if(v.public_domain) {
            a.public_domain++;
            a.depts[v.department].public_domain++;
            a.types[v.type].public_domain++;
        }

        // Add to overall and specific counts for on display works if applicable
        if(v.on_display) {
            a.on_display++;
            a.depts[v.department].on_display++;
            a.types[v.type].on_display++;
        }

        // Init cross-reference entries for types and depts if applicable
        if(!Object.keys(a.depts[v.department].types).includes(v.type)) {
            a.depts[v.department].types[v.type] = 0;
        }
        if(!Object.keys(a.types[v.type].depts).includes(v.department)) {
            a.types[v.type].depts[v.department] = 0;
        }

        // Add to cross-reference entries for types and depts
        a.depts[v.department].types[v.type]++;
        a.types[v.type].depts[v.department]++;

        // Attempt to get an acession year
        let anArr = v.accession_number.split(".");
        let an_year;
        if (+(anArr[0]) > 1900 && +(anArr[0]) <= (new Date().getFullYear())) {
            an_year = +(anArr[0]);
        } else if (+(anArr[1]) > 1900 && +(anArr[1]) <= (new Date().getFullYear())) {
            an_year = +(anArr[1]);
        }
        if (an_year) {
            if(!Object.keys(a.accession_year).includes(`${an_year}`)) {
                a.accession_year[`${an_year}`] = 0;
            }
            a.accession_year[`${an_year}`]++;
        } else {
            console.warn(v);
        }

        return a;
    }, {
        accession_year: {},
        depts: {},
        on_display: 0,
        public_domain: 0,
        total: 0,
        types: {}
    });
};

/**
 * Set up charts
 */
const initCharts = () => {
    // Set up tooltip
    tooltip = d3.select('#tooltip')
      .style('position', 'absolute')
      .style('font-size', 'small')
      .style('pointer-events', 'none');

    // Init
    chartIds.forEach((v) => {
        console.info(`Chart init: ${v}`);
        charts[v] = {};
        charts[v]['svg'] = d3.select(`#chart--${v}`)
            .append('div')
                .attr('class', 'chart-container')
                .style('width', `${w}px`)
                .style('height', `${h}px`)
            .append('svg')
                .attr('width', w)
                .attr('height', h);
        
        charts[v]['xAxisGroup'] = charts[v]['svg'].append('g')
            .attr('class', 'axis')
            .attr('transform', `translate(0, ${h - 20})`);

        charts[v]['yAxisGroup'] = charts[v]['svg'].append('g')
            .attr('class', 'axis-left1')
            .attr('transform', `translate(60,0 )`);
    });

    updateCharts();
};


const hover = (d, i, nodes) => {
    let str = `${d.name}`;
    if (Object.keys(d).includes('types')) {
        str += ` (${d.total}, ${d.types})`;
    } else if (Object.keys(d).includes('ppd')) {
        str += ` (${d.total}, ${Math.round(d.ppd * 100)}%)`
    } else {
        str += ` (${d.total})`;
    }
    d3.select(nodes[i])
        .transition()
        //.call(tr, "trColor")
        .attr('fill', '#57c1e8');
    tooltip
        .transition()
        //.call(tr, "trTtip")
        .text(str)
        .style('left', `${d3.event.pageX}px`)
        .style('top', `${d3.event.pageY}px`)
        .style('opacity', 1);
};

const leave = (d, i, nodes) => {
    d3.select(nodes[i])
        .transition()
        //.call(tr, "trColor")
        //.attr('fill', d => cScale(d.hours_of_sleep))
        .attr('fill', '#005cb9');
    tooltip
        .transition()
        //.call(tr, "trTtip")
        .style('opacity', 0);
};

/**
 * Update chart: count by department
 */
const updateChart_CountByDept = () => {
    console.info('Chart: Count by Department');
    const data = Object.keys(dataset.depts)
        .map((i) => {
            return {
                name: i,
                total: dataset.depts[i].total
            };
        })
        .sort((a, b) => b.total - a.total);
    const chart = charts['countbydept'];

    const barWidth = (w-40)/(data.length) - 14;

    xScale = d3.scaleBand()
        .domain(data.map(d => d.name))
        .rangeRound([60, w-60]);

    yScale = d3.scaleLinear()
        .domain([
            0,
            d3.max(data, d => d.total)
        ])
        .nice()
        .rangeRound([h - 60, 20]);

    const bars = chart['svg'].selectAll('rect')
        .data(data, d => d.name);

    bars.exit()
        .transition()
        //.call(tr, "trBar")
        .attr('x', -barWidth)
        .remove();

    bars
        .enter()
            .append('rect')
            //.attr('x', -barWidth)
            .attr('y', d => yScale(d.total))
            //.attr('width', barWidth)
            .attr('height', d => h - yScale(d.total) - 60)
            //.attr('fill', d => cScale(d.hours_of_sleep))
            .attr('fill', '#005cb9')
            .on('mouseover', hover)
            .on('mouseout', leave)
        //.merge(bars)
            //.transition()
            //.call(tr, "trBar")
            .attr('x', d => xScale(d.name) + 7)
            .attr('width', barWidth);

    xAxis = d3.axisBottom(xScale)
        .tickSize(0);
    yAxis = d3.axisLeft(yScale);

    chart['xAxisGroup']
        .attr('transform', `translate(0, ${h-60})`)
        .transition()
        //.call(tr, "trAxis")
        .call(xAxis);
    // Rotate text on x-axis 90deg
    chart['xAxisGroup'].selectAll('text')
        .attr('dy', '-.35em')
        .attr('text-anchor', 'start')
        .attr('transform', 'rotate(90)')
        .attr('x', 5);

    chart['yAxisGroup']
        .transition()
        //.call(tr, "trAxis")
        .call(yAxis);
};

/**
 * Update chart: count on display by department
 */
const updateChart_OnDisplayByDept = () => {
    console.info('Chart: Count on Display by Department');
    const data = Object.keys(dataset.depts)
        .map((i) => {
            return {
                name: i,
                total: dataset.depts[i].on_display
            };
        })
        .sort((a, b) => b.total - a.total);
    const chart = charts['ondisplaybydept'];

    const barWidth = (w-40)/(data.length) - 14;

    xScale = d3.scaleBand()
        .domain(data.map(d => d.name))
        .rangeRound([60, w-60]);

    yScale = d3.scaleLinear()
        .domain([
            0,
            d3.max(data, d => d.total)
        ])
        .nice()
        .rangeRound([h - 60, 20]);

    const bars = chart['svg'].selectAll('rect')
        .data(data, d => d.name);

    bars.exit()
        .transition()
        //.call(tr, "trBar")
        .attr('x', -barWidth)
        .remove();

    bars
        .enter()
            .append('rect')
            //.attr('x', -barWidth)
            .attr('y', d => yScale(d.total))
            //.attr('width', barWidth)
            .attr('height', d => h - yScale(d.total) - 60)
            //.attr('fill', d => cScale(d.hours_of_sleep))
            .attr('fill', '#005cb9')
            .on('mouseover', hover)
            .on('mouseout', leave)
        //.merge(bars)
            //.transition()
            //.call(tr, "trBar")
            .attr('x', d => xScale(d.name) + 7)
            .attr('width', barWidth);

    xAxis = d3.axisBottom(xScale)
        .tickSize(0);
    yAxis = d3.axisLeft(yScale);

    chart['xAxisGroup']
        .attr('transform', `translate(0, ${h-60})`)
        .transition()
        //.call(tr, "trAxis")
        .call(xAxis);
    // Rotate text on x-axis 90deg
    chart['xAxisGroup'].selectAll('text')
        .attr('dy', '-.35em')
        .attr('text-anchor', 'start')
        .attr('transform', 'rotate(90)')
        .attr('x', 5);

    chart['yAxisGroup']
        .transition()
        //.call(tr, "trAxis")
        .call(yAxis);
};

/**
 * Update chart: count by type
 */
const updateChart_CountByType = () => {
    console.info('Chart: Count by Type');
    const data = Object.keys(dataset.types)
        .map((i) => {
            return {
                name: i,
                total: dataset.types[i].total
            };
        })
        .sort((a, b) => b.total - a.total);
    const chart = charts['countbytype'];

    const barWidth = (w-40)/(data.length) - 4;

    xScale = d3.scaleBand()
        .domain(data.map(d => d.name))
        .rangeRound([60, w-60]);

    yScale = d3.scalePow()
        .exponent(0.5)
        .domain([
            1,
            d3.max(data, d => d.total)
        ])
        .nice()
        .rangeRound([h - 60, 20]);

    const bars = chart['svg'].selectAll('rect')
        .data(data, d => d.name);

    bars.exit()
        .transition()
        //.call(tr, "trBar")
        .attr('x', -barWidth)
        .remove();

    bars
        .enter()
            .append('rect')
            //.attr('x', -barWidth)
            .attr('y', d => yScale(d.total))
            //.attr('width', barWidth)
            .attr('height', d => h - yScale(d.total) - 60)
            //.attr('fill', d => cScale(d.hours_of_sleep))
            .attr('fill', '#005cb9')
            .on('mouseover', hover)
            .on('mouseout', leave)
        //.merge(bars)
            //.transition()
            //.call(tr, "trBar")
            .attr('x', d => xScale(d.name) + 2)
            .attr('width', barWidth);

    xAxis = d3.axisBottom(xScale)
        .tickSize(0);
    yAxis = d3.axisLeft(yScale);

    chart['xAxisGroup']
        .attr('transform', `translate(0, ${h-60})`)
        .transition()
        //.call(tr, "trAxis")
        .call(xAxis);
    // Rotate text on x-axis 90deg
    chart['xAxisGroup'].selectAll('text')
        .attr('dy', '-.25em')
        .style('font-size', '0.78em')
        .attr('text-anchor', 'start')
        .attr('transform', 'rotate(90)')
        .attr('x', 5);

    chart['yAxisGroup']
        .transition()
        //.call(tr, "trAxis")
        .call(yAxis);
};

/**
 * Update chart: percent public domain by dept
 */
const updateChart_PPDByDept = () => {
    console.info('Chart: % Public Domain over Count by Department');
    const data = Object.keys(dataset.depts)
        .map((i) => {
            return {
                name: i,
                ppd: dataset.depts[i].public_domain / dataset.depts[i].total,
                total: dataset.depts[i].total
            };
        })
        .sort((a, b) => b.total - a.total);
    const chart = charts['ppdbydept'];

    xScale = d3.scaleLinear()
        .domain([
            0,
            d3.max(data, d => d.total)
        ])
        .nice()
        .rangeRound([60, w-60]);

    yScale = d3.scaleLinear()
        .domain([0,1])
        .rangeRound([h - 20, 20]);

    const bars = chart['svg'].selectAll('circle')
        .data(data, d => d.name);

    bars.exit()
        .transition()
        //.call(tr, "trBar")
        //.attr('x', -barWidth)
        .remove();

    bars
        .enter()
            .append('circle')
            //.attr('x', -barWidth)
            .attr('cy', d => yScale(d.ppd))
            //.attr('width', barWidth)
            //.attr('height', d => h - yScale(d.ppd) - 20)
            //.attr('fill', d => cScale(d.hours_of_sleep))
            .attr('fill', '#005cb9')
            .on('mouseover', hover)
            .on('mouseout', leave)
        //.merge(bars)
            //.transition()
            //.call(tr, "trBar")
            .attr('cx', d => xScale(d.total))
            .attr('r', 4);

    xAxis = d3.axisBottom(xScale);
    yAxis = d3.axisLeft(yScale)
        .tickFormat(d3.format(".0%"));

    chart['xAxisGroup']
        .transition()
        //.call(tr, "trAxis")
        .call(xAxis);

    chart['yAxisGroup']
        .transition()
        //.call(tr, "trAxis")
        .call(yAxis);
};

/**
 * Update chart: number of types over count by department
 */
const updateChart_TypesOverCountByDept = () => {
    console.info('Chart: Types over Count by Department');
    const data = Object.keys(dataset.depts)
        .map((i) => {
            return {
                name: i,
                types: Object.keys(dataset.depts[i].types).length,
                total: dataset.depts[i].total
            };
        })
        .sort((a, b) => b.total - a.total);
    const chart = charts['typesbydept'];

    xScale = d3.scaleLinear()
        .domain([
            0,
            d3.max(data, d => d.total)
        ])
        .nice()
        .rangeRound([60, w-60]);

    yScale = d3.scaleLinear()
        .domain([
            0,
            d3.max(data, d => d.types)
        ])
        .rangeRound([h - 20, 20]);

    const bars = chart['svg'].selectAll('circle')
        .data(data, d => d.name);

    bars.exit()
        .transition()
        //.call(tr, "trBar")
        //.attr('x', -barWidth)
        .remove();

    bars
        .enter()
            .append('circle')
            //.attr('x', -barWidth)
            .attr('cy', d => yScale(d.types))
            //.attr('width', barWidth)
            //.attr('height', d => h - yScale(d.ppd) - 20)
            //.attr('fill', d => cScale(d.hours_of_sleep))
            .attr('fill', '#005cb9')
            .on('mouseover', hover)
            .on('mouseout', leave)
        //.merge(bars)
            //.transition()
            //.call(tr, "trBar")
            .attr('cx', d => xScale(d.total))
            .attr('r', 4);

    xAxis = d3.axisBottom(xScale);
    yAxis = d3.axisLeft(yScale);

    chart['xAxisGroup']
        .transition()
        //.call(tr, "trAxis")
        .call(xAxis);

    chart['yAxisGroup']
        .transition()
        //.call(tr, "trAxis")
        .call(yAxis);
};

/**
 * Update chart: accessions per year
 */
const updateChart_GrowthPerYear = () => {
    console.info('Chart: Growth (Accessions) per Year');
    const data = Object.keys(dataset.accession_year)
        .map((i) => {
            return {
                name: `${i}`,
                total: dataset.accession_year[i],
                year: i
            };
        });
    const chart = charts['growthperyear'];

    const barWidth = (w-40)/(data.length) - 2;

    xScale = d3.scaleTime()
        .domain([
            new Date(d3.min(data, d => d.year), 0, 1),
            d3.timeYear.offset(new Date(d3.max(data, d => d.year), 0, 1), 1)
        ])
        .nice()
        .range([60, w-60]);

    yScale = d3.scaleLinear()
        .domain([
            0,
            d3.max(data, d => d.total)
        ])
        .rangeRound([h - 20, 20]);

    const bars = chart['svg'].selectAll('rect')
        .data(data, d => d.year);

    bars.exit()
        .transition()
        //.call(tr, "trBar")
        .attr('x', -barWidth)
        .remove();

    bars
        .enter()
            .append('rect')
            //.attr('x', -barWidth)
            .attr('y', d => yScale(d.total))
            //.attr('width', barWidth)
            .attr('height', d => h - yScale(d.total) - 20)
            //.attr('fill', d => cScale(d.hours_of_sleep))
            .attr('fill', '#005cb9')
            .on('mouseover', hover)
            .on('mouseout', leave)
        //.merge(bars)
            //.transition()
            //.call(tr, "trBar")
            .attr('x', d => xScale(new Date(d.year, 0, 1)))
            .attr('width', barWidth);

    xAxis = d3.axisBottom(xScale);
    yAxis = d3.axisLeft(yScale);

    chart['xAxisGroup']
        .transition()
        //.call(tr, "trAxis")
        .call(xAxis);

    chart['yAxisGroup']
        .transition()
        //.call(tr, "trAxis")
        .call(yAxis);
};

/**
 * Updates all charts
 */
const updateCharts = () => {
    console.info('Updating charts');
    updateChart_CountByDept();
    updateChart_OnDisplayByDept();
    updateChart_CountByType();
    updateChart_PPDByDept();
    updateChart_TypesOverCountByDept();
    updateChart_GrowthPerYear();
};

/**
 * Gets things rolling
 * * Parses csv with d3
 * * Summarizes data
 * * Sets up charts
 * * Sets up event listeners
 */
const init = () => {
    console.info('Init');

    d3.csv('data.csv', rowMap).then((data) => {
        console.info('Dataset loaded');

        dataset = summarizeData(data);
        console.info('Dataset processed');

        // Overall Stats
        d3.select('#stat--total').text(
            new Intl.NumberFormat('en-US', { style: 'decimal' }).format(dataset.total)
        );
        d3.select('#stat--depts').text(Object.keys(dataset.depts).length);
        d3.select('#stat--types').text(Object.keys(dataset.types).length);
        d3.select('#stat--ppd').text(`${Math.round(dataset.public_domain / dataset.total * 100, 2)}%`);
        console.info('Done stats');

        // Charts
        console.group('Charts');
        initCharts();
        console.groupEnd();

        // Show on page
        d3.select('#lazy-load-waiter').style('display', 'none');
        d3.select('#lazy-load').transition().style('opacity', '1');
        console.info('Lazy-load swap done');
    });
};

init();