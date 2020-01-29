window.addEventListener('load', () => {
    const dataURL = '/the-great-pancake-experiment/pancakes.csv';
    const resultsDiv = document.querySelector('#do-vis-here');

    const parseResults = (results) => {
        if(results.meta.aborted) {
            resultsDiv.innerText = "Could not load or parse file";
            console.error(results.errors);
            return;
        }

        //const fields = results.meta.fields;
        const fields = ['Flavor', 'Normalness', 'Taste', 'Notes'];

        /* Chart */
        const chartDiv = document.createElement('div');
        chartDiv.style.minHeight = '300px';
        const data = results.data.reduce(
            (o, i) => {
                const x = Number.parseFloat(i['Normalness']);
                const y = Number.parseFloat(i['Taste']);
                let exists = -1;
                o.x.forEach((a, i) => {
                    if(o.x[i] === x && o.y[i] === y) {
                        exists = i;
                    }
                });
                if(exists === -1) {
                    o.x.push(x);
                    o.y.push(y);
                    o.text.push(`${i['Flavor']}`);
                    o.marker.size.push(1);
                } else {
                    o.marker.size[exists]++;
                    o.text[exists] += `<br>${i['Flavor']}`;
                }
                return o;
            },
            {
                x: [],
                y: [],
                text: [],
                type: 'scatter',
                mode: 'markers',
                marker: {
                    size: []
                }
            }
        );
        data.marker.size = data.marker.size.map(i => i * 10);
        const layout = {
          xaxis: {
              range: [0.9,5.1],
              title: 'Normalness',
              zeroline: false
          },
          yaxis: {
              range: [0.9,5.1],
              title: 'Taste',
              zeroline: false
          },
          title: 'Pancake Experiment Results',
          hovermode: 'closest'
        };
        Plotly.plot(chartDiv, [data], layout, {responsive: true})
        resultsDiv.appendChild(chartDiv);

        /* Raw Data details */
        let details = document.createElement('details');
        let summary = document.createElement('summary');
        summary.innerText = "Raw Data";
        details.appendChild(summary);

        let dataLink = document.createElement('a');
        dataLink.setAttribute('href', dataURL);
        dataLink.setAttribute('noopener', '');
        dataLink.setAttribute('noreferrer', '');
        dataLink.setAttribute('target', '_blank');
        dataLink.innerText = dataURL;
        details.appendChild(dataLink);

        let tableCtr = document.createElement('div');
        tableCtr.classList.add('table-container');
        let table = document.createElement('table');

        let thead = document.createElement('thead');
        let theadTr = document.createElement('tr');
        fields.forEach((fld) => {
            let el = document.createElement('th');
            el.setAttribute('scope', 'col');
            el.innerText = fld;
            theadTr.appendChild(el);
        });
        thead.appendChild(theadTr);
        table.appendChild(thead);

        let tbody = document.createElement('tbody');
        results.data.forEach((row) => {
            let tr = document.createElement('tr');
            fields.forEach((col) => {
                let td = document.createElement('td');
                if(col === 'IMDB Link' || col === 'Wikipedia Link') {
                    let tdLink = document.createElement('a');
                    tdLink.innerText = col.replace(' Link', '');
                    tdLink.setAttribute('href', row[col]);
                    tdLink.setAttribute('noopener', '');
                    tdLink.setAttribute('noreferrer', '');
                    tdLink.setAttribute('target', '_blank');
                    td.appendChild(tdLink);
                } else {
                    td.innerText = row[col];
                }
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);

        tableCtr.appendChild(table);
        details.appendChild(tableCtr);
        resultsDiv.appendChild(details);
    };

    Papa.parse(
        dataURL,
        {
            complete: parseResults,
            download: true,
            header: true,
            skipEmptyLines: true
        }
    );
});