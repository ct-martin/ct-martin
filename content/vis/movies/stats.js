window.addEventListener('load', () => {
    const dataURL = 'https://raw.githubusercontent.com/ct-martin/movie-collection/master/movies.csv';
    const resultsDiv = document.createElement('div');
    document.querySelector('article').appendChild(resultsDiv);

    const parseResults = (results) => {
        if(results.meta.aborted) {
            resultsDiv.innerText = "Could not load or parse file";
            console.error(results.errors);
            return;
        }

        //const fields = results.meta.fields;
        const fields = ['Title', 'Year', 'Medium', 'Length (min)'];

        /* Charts */
        let titleLetters = results.data.reduce((l, i) => {
            if(Object.keys(l).includes(i.Title[0])) {
                l[i.Title[0]]++;
            } else {
                l[i.Title[0]] = 1;
            }
            return l;
        }, {});
        let tColors = [];
        const tLen = Object.entries(titleLetters).length;
        for (let i = 0; i < tLen; i++) {
            tColors.push(`hsl(${Math.round(360 / tLen * i)}deg, 100%, 60%)`);
        }
        resultsDiv.appendChild(simplePie(Object.values(titleLetters), Object.keys(titleLetters), tColors, 'Movies by First Letter'));

        let lens = results.data.map((i) => i['Length (min)']);
        const chartDiv = document.createElement('div');
        const chartCtr = document.createElement('div');
        chartCtr.classList.add('chart-container');
        const chartCanvas = document.createElement('canvas');
        const ctx = chartCanvas.getContext('2d');
        let chart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    data: lens.map((i) => {
                        return { x: i, y: 0 };
                    }),
                    pointBackgroundColor: 'rgba(0,0,255,0.8)'
                }],
            },
            options: {
                aspectRatio: 1.5,
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    fontSize: 16,
                    fontColor: '#363636',
                    text: 'Movies by Length',
                },
            },
        });
        chartCtr.appendChild(chartCanvas);
        chartDiv.appendChild(chartCtr);
        resultsDiv.appendChild(chartDiv);

        let mediums = results.data.reduce((m, i) => {
            if(Object.keys(m).includes(i.Medium)) {
                m[i.Medium]++;
            } else {
                m[i.Medium] = 1;
            }
            return m;
        }, {});
        let medColors = [];
        const mediumsLen = Object.entries(mediums).length;
        for (let i = 0; i < mediumsLen; i++) {
            medColors.push(`hsl(${Math.round(360 / mediumsLen * i)}deg, 100%, 60%)`);
        }
        resultsDiv.appendChild(simplePie(Object.values(mediums), Object.keys(mediums), medColors, 'Movies by Medium'));
        
        let timelineCollapse = document.createElement('details');
        let timelineSumm = document.createElement('summary');
        timelineSumm.innerText = "Movies by Year";
        timelineCollapse.appendChild(timelineSumm);
        let items = new vis.DataSet(results.data.map((i) => {
            return {
                content: i.Title,
                start: i.Year
            }
        }));
        let timelineCtr = document.createElement('div');
        let timeline = new vis.Timeline(timelineCtr, items, {});
        timelineCollapse.appendChild(timelineCtr);
        resultsDiv.appendChild(timelineCollapse);

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