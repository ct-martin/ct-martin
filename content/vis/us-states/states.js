window.addEventListener('load', () => {
    const el = document.createElement('div');
    el.setAttribute('id', 'plotly-map');
    document.querySelector('#do-vis-here').appendChild(el);

    Plotly.d3.csv('/us-states/data.csv', (err, rows) => {
        const unpack = (rows, key) => rows.map((row) => row[key]);

        const data = [{
            colorscale: [
                [0, 'green'],
                [1, 'green']
            ],
            hoverinfo: 'location+text',
            locationmode: 'USA-states',
            locations: unpack(rows, 'code'),
            showlegend: false,
            showscale: false,
            text: unpack(rows, 'name'),
            type: 'choropleth',
            z: unpack(rows, 'visited'),
            zmax: 1,
            zmin: 0
        }];

        const layout = {
            autosize: true,
            geo: {
                scope: 'usa',
                showlakes: false
            },
            height: 500,
            margin: {
                l: 0,
                b: 0
            },
            title: 'US States Visited'
        };

        Plotly.newPlot('plotly-map', data, layout, {responsive: true, showLink: false});
    });
});