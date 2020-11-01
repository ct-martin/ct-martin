window.addEventListener('load', () => {
    const el = document.createElement('div');
    el.setAttribute('id', 'plotly-map');
    document.querySelector('article').appendChild(el);

    Plotly.d3.csv('data.csv', (err, rows) => {
        const unpack = (rows, key) => rows.map((row) => row[key]);

        const data = [{
            colorscale: [
                [0, 'green'],
                [1, 'green']
            ],
            hoverinfo: 'location+text',
            locationmode: 'ISO-3',
            locations: unpack(rows, 'iso3'),
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
                projection: {
                    type: 'miller'
                },
                showframe: false
            },
            height: 500,
            margin: {
                l: 0,
                b: 0
            },
            title: 'Countries Visited'
        }

        Plotly.newPlot('plotly-map', data, layout, {showLink: false});
    });
});