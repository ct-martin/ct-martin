---
title: Chartem Ipsum
date: 2020-09-14
libs:
  - 'dagre'
  - 'echarts'
  - 'flowchartjs'
  - 'js-sequence'
  - 'mermaid'
  - 'nomnoml'
  - 'vega'
  - 'wavedrom'
related:
- "/vis/api-in-mermaid"
- "/vis/hybrid-cloud"
---
Integrating as many declarative visualization libraries as I can into Markdown.

<!--more-->

Markdown is great for its declarative syntax, but I want to extend it to allow charts and diagrams to be embedded.
I've played with this previously, but I used custom code or only a couple libraries.

This is an attempt to embed all the libraries I'm aware of that can handle declarative charting in a browser.

While I am using shortcodes for fencing (since Markdown doesn't have a generic container syntax yet), there is no raw HTML or JavaScript in the file this page is generated from.
Also, as a note, most examples are taken from the gallery/documentation of the library they come from.
If so, they're either from the home page of the library's website, or I linked the example.

## Complex Libraries
These libraries are big and verbose, but effective at visualizing large amounts of data and providing complex interactions.
If you're trying to display quantitative data, these are the ones you're almost certainly going to use for declarative charting.

### Vega
[Vega](https://vega.github.io/vega/) is a visualization grammar that describes how data is processed and rendered.
Vega can be rather verbose, but it allows for an extremely high amount of control over how data is processed and allows complex interactions, while still being delarative.

Here is the [Airport Connections Example](https://vega.github.io/vega/examples/airport-connections/) to show both rendering and interaction of data:

{{< vega id="airport" >}}
{"$schema":"https://vega.github.io/schema/vega/v5.json","description":"Interactive map of U.S. airport connections in 2008.","width":900,"height":560,"padding":{"top":25,"left":0,"right":0,"bottom":0},"autosize":"none","signals":[{"name":"scale","value":1200,"bind":{"input":"range","min":500,"max":3000}},{"name":"translateX","value":450,"bind":{"input":"range","min":-500,"max":1200}},{"name":"translateY","value":260,"bind":{"input":"range","min":-300,"max":700}},{"name":"shape","value":"line","bind":{"input":"radio","options":["line","curve"]}},{"name":"hover","value":null,"on":[{"events":"@cell:mouseover","update":"datum"},{"events":"@cell:mouseout","update":"null"}]},{"name":"title","value":"U.S. Airports, 2008","update":"hover ? hover.name + ' (' + hover.iata + ')' : 'U.S. Airports, 2008'"},{"name":"cell_stroke","value":null,"on":[{"events":"dblclick","update":"cell_stroke ? null : 'brown'"},{"events":"mousedown!","update":"cell_stroke"}]}],"data":[{"name":"states","url":"https://vega.github.io/vega/data/us-10m.json","format":{"type":"topojson","feature":"states"},"transform":[{"type":"geopath","projection":"projection"}]},{"name":"traffic","url":"https://vega.github.io/vega/data/flights-airport.csv","format":{"type":"csv","parse":"auto"},"transform":[{"type":"aggregate","groupby":["origin"],"fields":["count"],"ops":["sum"],"as":["flights"]}]},{"name":"airports","url":"https://vega.github.io/vega/data/airports.csv","format":{"type":"csv","parse":"auto"},"transform":[{"type":"lookup","from":"traffic","key":"origin","fields":["iata"],"as":["traffic"]},{"type":"filter","expr":"datum.traffic != null"},{"type":"geopoint","projection":"projection","fields":["longitude","latitude"]},{"type":"filter","expr":"datum.x != null && datum.y != null"},{"type":"voronoi","x":"x","y":"y"},{"type":"collect","sort":{"field":"traffic.flights","order":"descending"}}]},{"name":"routes","url":"https://vega.github.io/vega/data/flights-airport.csv","format":{"type":"csv","parse":"auto"},"transform":[{"type":"filter","expr":"hover && hover.iata == datum.origin"},{"type":"lookup","from":"airports","key":"iata","fields":["origin","destination"],"as":["source","target"]},{"type":"filter","expr":"datum.source && datum.target"},{"type":"linkpath","shape":{"signal":"shape"}}]}],"projections":[{"name":"projection","type":"albersUsa","scale":{"signal":"scale"},"translate":[{"signal":"translateX"},{"signal":"translateY"}]}],"scales":[{"name":"size","type":"linear","domain":{"data":"traffic","field":"flights"},"range":[16,1000]}],"marks":[{"type":"path","from":{"data":"states"},"encode":{"enter":{"fill":{"value":"#dedede"},"stroke":{"value":"white"}},"update":{"path":{"field":"path"}}}},{"type":"symbol","from":{"data":"airports"},"encode":{"enter":{"size":{"scale":"size","field":"traffic.flights"},"fill":{"value":"steelblue"},"fillOpacity":{"value":0.8},"stroke":{"value":"white"},"strokeWidth":{"value":1.5}},"update":{"x":{"field":"x"},"y":{"field":"y"}}}},{"type":"path","name":"cell","from":{"data":"airports"},"encode":{"enter":{"fill":{"value":"transparent"},"strokeWidth":{"value":0.35}},"update":{"path":{"field":"path"},"stroke":{"signal":"cell_stroke"}}}},{"type":"path","interactive":false,"from":{"data":"routes"},"encode":{"enter":{"path":{"field":"path"},"stroke":{"value":"black"},"strokeOpacity":{"value":0.35}}}},{"type":"text","interactive":false,"encode":{"enter":{"x":{"value":895},"y":{"value":0},"fill":{"value":"black"},"fontSize":{"value":20},"align":{"value":"right"}},"update":{"text":{"signal":"title"}}}}]}
{{< /vega >}}

{{< details summary="Code" >}}
```json
{
  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "description": "Interactive map of U.S. airport connections in 2008.",
  "width": 900,
  "height": 560,
  "padding": {"top": 25, "left": 0, "right": 0, "bottom": 0},
  "autosize": "none",

  "signals": [
    {
      "name": "scale", "value": 1200,
      "bind": {"input": "range", "min": 500, "max": 3000}
    },
    {
      "name": "translateX", "value": 450,
      "bind": {"input": "range", "min": -500, "max": 1200}
    },
    {
      "name": "translateY", "value": 260,
      "bind": {"input": "range", "min": -300, "max": 700}
    },
    {
      "name": "shape", "value": "line",
      "bind": {"input": "radio", "options": ["line", "curve"]}
    },
    {
      "name": "hover",
      "value": null,
      "on": [
        {"events": "@cell:mouseover", "update": "datum"},
        {"events": "@cell:mouseout", "update": "null"}
      ]
    },
    {
      "name": "title",
      "value": "U.S. Airports, 2008",
      "update": "hover ? hover.name + ' (' + hover.iata + ')' : 'U.S. Airports, 2008'"
    },
    {
      "name": "cell_stroke",
      "value": null,
      "on": [
        {"events": "dblclick", "update": "cell_stroke ? null : 'brown'"},
        {"events": "mousedown!", "update": "cell_stroke"}
      ]
    }
  ],

  "data": [
    {
      "name": "states",
      "url": "https://vega.github.io/vega/data/us-10m.json",
      "format": {"type": "topojson", "feature": "states"},
      "transform": [
        {
          "type": "geopath",
          "projection": "projection"
        }
      ]
    },
    {
      "name": "traffic",
      "url": "https://vega.github.io/vega/data/flights-airport.csv",
      "format": {"type": "csv", "parse": "auto"},
      "transform": [
        {
          "type": "aggregate",
          "groupby": ["origin"],
          "fields": ["count"], "ops": ["sum"], "as": ["flights"]
        }
      ]
    },
    {
      "name": "airports",
      "url": "https://vega.github.io/vega/data/airports.csv",
      "format": {"type": "csv","parse": "auto"
      },
      "transform": [
        {
          "type": "lookup",
          "from": "traffic", "key": "origin",
          "fields": ["iata"], "as": ["traffic"]
        },
        {
          "type": "filter",
          "expr": "datum.traffic != null"
        },
        {
          "type": "geopoint",
          "projection": "projection",
          "fields": ["longitude", "latitude"]
        },
        {
          "type": "filter",
          "expr": "datum.x != null && datum.y != null"
        },
        {
          "type": "voronoi", "x": "x", "y": "y"
        },
        {
          "type": "collect", "sort": {
            "field": "traffic.flights",
            "order": "descending"
          }
        }
      ]
    },
    {
      "name": "routes",
      "url": "https://vega.github.io/vega/data/flights-airport.csv",
      "format": {"type": "csv", "parse": "auto"},
      "transform": [
        {
          "type": "filter",
          "expr": "hover && hover.iata == datum.origin"
        },
        {
          "type": "lookup",
          "from": "airports", "key": "iata",
          "fields": ["origin", "destination"], "as": ["source", "target"]
        },
        {
          "type": "filter",
          "expr": "datum.source && datum.target"
        },
        {
          "type": "linkpath",
          "shape": {"signal": "shape"}
        }
      ]
    }
  ],

  "projections": [
    {
      "name": "projection",
      "type": "albersUsa",
      "scale": {"signal": "scale"},
      "translate": [{"signal": "translateX"}, {"signal": "translateY"}]
    }
  ],

  "scales": [
    {
      "name": "size",
      "type": "linear",
      "domain": {"data": "traffic", "field": "flights"},
      "range": [16, 1000]
    }
  ],

  "marks": [
    {
      "type": "path",
      "from": {"data": "states"},
      "encode": {
        "enter": {
          "fill": {"value": "#dedede"},
          "stroke": {"value": "white"}
        },
        "update": {
          "path": {"field": "path"}
        }
      }
    },
    {
      "type": "symbol",
      "from": {"data": "airports"},
      "encode": {
        "enter": {
          "size": {"scale": "size", "field": "traffic.flights"},
          "fill": {"value": "steelblue"},
          "fillOpacity": {"value": 0.8},
          "stroke": {"value": "white"},
          "strokeWidth": {"value": 1.5}
        },
        "update": {
          "x": {"field": "x"},
          "y": {"field": "y"}
        }
      }
    },
    {
      "type": "path",
      "name": "cell",
      "from": {"data": "airports"},
      "encode": {
        "enter": {
          "fill": {"value": "transparent"},
          "strokeWidth": {"value": 0.35}
        },
        "update": {
          "path": {"field": "path"},
          "stroke": {"signal": "cell_stroke"}
        }
      }
    },
    {
      "type": "path",
      "interactive": false,
      "from": {"data": "routes"},
      "encode": {
        "enter": {
          "path": {"field": "path"},
          "stroke": {"value": "black"},
          "strokeOpacity": {"value": 0.35}
        }
      }
    },
    {
      "type": "text",
      "interactive": false,
      "encode": {
        "enter": {
          "x": {"value": 895},
          "y": {"value": 0},
          "fill": {"value": "black"},
          "fontSize": {"value": 20},
          "align": {"value": "right"}
        },
        "update": {
          "text": {"signal": "title"}
        }
      }
    }
  ]
}
```
{{< /details >}}

#### Vega Lite
[Vega-Lite](https://vega.github.io/vega-lite/) is a higher-level grammar on top of Vega which can map properties and automatically produce many interactive components.

The same airport visualization above also [has an example in Vega-Lite](https://vega.github.io/vega-lite/examples/airport_connections.html), and the code, while still somewhat verbose, is 40% the length (91 lines vs 227 lines):

{{< vega id="lite-airport" >}}
{"$schema":"https://vega.github.io/schema/vega-lite/v4.json","description":"An interactive visualization of connections among major U.S. airports in 2008. Based on a U.S. airports example by Mike Bostock.","layer":[{"mark":{"type":"geoshape","fill":"#ddd","stroke":"#fff","strokeWidth":1},"data":{"url":"https://vega.github.io/vega/data/us-10m.json","format":{"type":"topojson","feature":"states"}}},{"mark":{"type":"rule","color":"#000","opacity":0.35},"data":{"url":"https://vega.github.io/vega/data/flights-airport.csv"},"transform":[{"filter":{"selection":"single"}},{"lookup":"origin","from":{"data":{"url":"https://vega.github.io/vega/data/airports.csv"},"key":"iata","fields":["latitude","longitude"]}},{"lookup":"destination","from":{"data":{"url":"https://vega.github.io/vega/data/airports.csv"},"key":"iata","fields":["latitude","longitude"]},"as":["lat2","lon2"]}],"encoding":{"latitude":{"field":"latitude"},"longitude":{"field":"longitude"},"latitude2":{"field":"lat2"},"longitude2":{"field":"lon2"}}},{"mark":{"type":"circle"},"data":{"url":"https://vega.github.io/vega/data/flights-airport.csv"},"transform":[{"aggregate":[{"op":"count","as":"routes"}],"groupby":["origin"]},{"lookup":"origin","from":{"data":{"url":"https://vega.github.io/vega/data/airports.csv"},"key":"iata","fields":["state","latitude","longitude"]}},{"filter":"datum.state !== 'PR' && datum.state !== 'VI'"}],"selection":{"single":{"type":"single","on":"mouseover","nearest":true,"fields":["origin"],"empty":"none"}},"encoding":{"latitude":{"field":"latitude"},"longitude":{"field":"longitude"},"size":{"field":"routes","type":"quantitative","scale":{"rangeMax":1000},"legend":null},"order":{"field":"routes","sort":"descending"}}}],"projection":{"type":"albersUsa"},"width":900,"height":500,"config":{"view":{"stroke":null}}}
{{< /vega >}}

{{< details summary="Code" >}}
```json
{
  "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
  "description": "An interactive visualization of connections among major U.S. airports in 2008. Based on a U.S. airports example by Mike Bostock.",
  "layer": [
    {
      "mark": {
        "type": "geoshape",
        "fill": "#ddd",
        "stroke": "#fff",
        "strokeWidth": 1
      },
      "data": {
        "url": "https://vega.github.io/vega/data/us-10m.json",
        "format": {"type": "topojson", "feature": "states"}
      }
    },
    {
      "mark": {"type": "rule", "color": "#000", "opacity": 0.35},
      "data": {"url": "https://vega.github.io/vega/data/flights-airport.csv"},
      "transform": [
        {"filter": {"selection": "single"}},
        {
          "lookup": "origin",
          "from": {
            "data": {"url": "https://vega.github.io/vega/data/airports.csv"},
            "key": "iata",
            "fields": ["latitude", "longitude"]
          }
        },
        {
          "lookup": "destination",
          "from": {
            "data": {"url": "https://vega.github.io/vega/data/airports.csv"},
            "key": "iata",
            "fields": ["latitude", "longitude"]
          },
          "as": ["lat2", "lon2"]
        }
      ],
      "encoding": {
        "latitude": {"field": "latitude"},
        "longitude": {"field": "longitude"},
        "latitude2": {"field": "lat2"},
        "longitude2": {"field": "lon2"}
      }
    },
    {
      "mark": {"type": "circle"},
      "data": {"url": "https://vega.github.io/vega/data/flights-airport.csv"},
      "transform": [
        {"aggregate": [{"op": "count", "as": "routes"}], "groupby": ["origin"]},
        {
          "lookup": "origin",
          "from": {
            "data": {"url": "https://vega.github.io/vega/data/airports.csv"},
            "key": "iata",
            "fields": ["state", "latitude", "longitude"]
          }
        },
        {"filter": "datum.state !== 'PR' && datum.state !== 'VI'"}
      ],
      "selection": {
        "single": {
          "type": "single",
          "on": "mouseover",
          "nearest": true,
          "fields": ["origin"],
          "empty": "none"
        }
      },
      "encoding": {
        "latitude": {"field": "latitude"},
        "longitude": {"field": "longitude"},
        "size": {
          "field": "routes",
          "type": "quantitative",
          "scale": {"rangeMax": 1000},
          "legend": null
        },
        "order": {
          "field": "routes",
          "sort": "descending"
        }
      }
    }
  ],
  "projection": {"type": "albersUsa"},
  "width": 900,
  "height": 500,
  "config": {"view": {"stroke": null}}
}
```
{{< /details >}}

To allow a fair comparison later, here's the [Simple Bar Chart](https://vega.github.io/vega-lite/examples/bar.html) example to show that basic charts are pretty easy:

{{< vega id="bar" >}}
{"$schema":"https://vega.github.io/schema/vega-lite/v4.json","description":"A simple bar chart with embedded data.","data":{"values":[{"a":"A","b":28},{"a":"B","b":55},{"a":"C","b":43},{"a":"D","b":91},{"a":"E","b":81},{"a":"F","b":53},{"a":"G","b":19},{"a":"H","b":87},{"a":"I","b":52}]},"mark":"bar","encoding":{"x":{"field":"a","type":"nominal","axis":{"labelAngle":0}},"y":{"field":"b","type":"quantitative"}}}
{{< /vega >}}

```json
{
  "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
  "description": "A simple bar chart with embedded data.",
  "data": {
    "values": [
      {"a": "A", "b": 28}, {"a": "B", "b": 55}, {"a": "C", "b": 43},
      {"a": "D", "b": 91}, {"a": "E", "b": 81}, {"a": "F", "b": 53},
      {"a": "G", "b": 19}, {"a": "H", "b": 87}, {"a": "I", "b": 52}
    ]
  },
  "mark": "bar",
  "encoding": {
    "x": {"field": "a", "type": "nominal", "axis": {"labelAngle": 0}},
    "y": {"field": "b", "type": "quantitative"}
  }
}
```

### ECharts
[ECharts](https://echarts.apache.org/en/) is a project in the Apache incubator.
While it's not explicitly declarative, it can do many types of charts in a declarative nature.

Basic charts are fairly simple, such as the [Simple Bar Chart](https://echarts.apache.org/examples/en/editor.html?c=bar-simple) example:
{{< echarts id="line" >}}
{"xAxis":{"type":"category","data":["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]},"yAxis":{"type":"value"},"series":[{"data":[120,200,150,80,70,110,130],"type":"bar"}]}
{{< /echarts >}}

```json
{
    "xAxis": {
        "type": "category",
        "data": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    },
    "yAxis": {
        "type": "value"
    },
    "series": [
        {
            "data": [120, 200, 150, 80, 70, 110, 130],
            "type": "bar"
        }
    ]
}
```

If you're willing to have a really long entry in your Markdown, it is technically possible to have a complex graph, such as the [Sunburst Demo](https://echarts.apache.org/examples/en/editor.html?c=sunburst-drink):
{{< echarts id="sunburst" >}}
{"title":{"text":"WORLD COFFEE RESEARCH SENSORY LEXICON","subtext":"Source: https://worldcoffeeresearch.org/work/sensory-lexicon/","textStyle":{"fontSize":14,"align":"center"},"subtextStyle":{"align":"center"},"sublink":"https://worldcoffeeresearch.org/work/sensory-lexicon/"},"series":{"type":"sunburst","highlightPolicy":"ancestor","data":[{"name":"Flora","itemStyle":{"color":"#da0d68"},"children":[{"name":"Black Tea","value":1,"itemStyle":{"color":"#975e6d"}},{"name":"Floral","itemStyle":{"color":"#e0719c"},"children":[{"name":"Chamomile","value":1,"itemStyle":{"color":"#f99e1c"}},{"name":"Rose","value":1,"itemStyle":{"color":"#ef5a78"}},{"name":"Jasmine","value":1,"itemStyle":{"color":"#f7f1bd"}}]}]},{"name":"Fruity","itemStyle":{"color":"#da1d23"},"children":[{"name":"Berry","itemStyle":{"color":"#dd4c51"},"children":[{"name":"Blackberry","value":1,"itemStyle":{"color":"#3e0317"}},{"name":"Raspberry","value":1,"itemStyle":{"color":"#e62969"}},{"name":"Blueberry","value":1,"itemStyle":{"color":"#6569b0"}},{"name":"Strawberry","value":1,"itemStyle":{"color":"#ef2d36"}}]},{"name":"Dried Fruit","itemStyle":{"color":"#c94a44"},"children":[{"name":"Raisin","value":1,"itemStyle":{"color":"#b53b54"}},{"name":"Prune","value":1,"itemStyle":{"color":"#a5446f"}}]},{"name":"Other Fruit","itemStyle":{"color":"#dd4c51"},"children":[{"name":"Coconut","value":1,"itemStyle":{"color":"#f2684b"}},{"name":"Cherry","value":1,"itemStyle":{"color":"#e73451"}},{"name":"Pomegranate","value":1,"itemStyle":{"color":"#e65656"}},{"name":"Pineapple","value":1,"itemStyle":{"color":"#f89a1c"}},{"name":"Grape","value":1,"itemStyle":{"color":"#aeb92c"}},{"name":"Apple","value":1,"itemStyle":{"color":"#4eb849"}},{"name":"Peach","value":1,"itemStyle":{"color":"#f68a5c"}},{"name":"Pear","value":1,"itemStyle":{"color":"#baa635"}}]},{"name":"Citrus Fruit","itemStyle":{"color":"#f7a128"},"children":[{"name":"Grapefruit","value":1,"itemStyle":{"color":"#f26355"}},{"name":"Orange","value":1,"itemStyle":{"color":"#e2631e"}},{"name":"Lemon","value":1,"itemStyle":{"color":"#fde404"}},{"name":"Lime","value":1,"itemStyle":{"color":"#7eb138"}}]}]},{"name":"Sour/\nFermented","itemStyle":{"color":"#ebb40f"},"children":[{"name":"Sour","itemStyle":{"color":"#e1c315"},"children":[{"name":"Sour Aromatics","value":1,"itemStyle":{"color":"#9ea718"}},{"name":"Acetic Acid","value":1,"itemStyle":{"color":"#94a76f"}},{"name":"Butyric Acid","value":1,"itemStyle":{"color":"#d0b24f"}},{"name":"Isovaleric Acid","value":1,"itemStyle":{"color":"#8eb646"}},{"name":"Citric Acid","value":1,"itemStyle":{"color":"#faef07"}},{"name":"Malic Acid","value":1,"itemStyle":{"color":"#c1ba07"}}]},{"name":"Alcohol/\nFremented","itemStyle":{"color":"#b09733"},"children":[{"name":"Winey","value":1,"itemStyle":{"color":"#8f1c53"}},{"name":"Whiskey","value":1,"itemStyle":{"color":"#b34039"}},{"name":"Fremented","value":1,"itemStyle":{"color":"#ba9232"}},{"name":"Overripe","value":1,"itemStyle":{"color":"#8b6439"}}]}]},{"name":"Green/\nVegetative","itemStyle":{"color":"#187a2f"},"children":[{"name":"Olive Oil","value":1,"itemStyle":{"color":"#a2b029"}},{"name":"Raw","value":1,"itemStyle":{"color":"#718933"}},{"name":"Green/\nVegetative","itemStyle":{"color":"#3aa255"},"children":[{"name":"Under-ripe","value":1,"itemStyle":{"color":"#a2bb2b"}},{"name":"Peapod","value":1,"itemStyle":{"color":"#62aa3c"}},{"name":"Fresh","value":1,"itemStyle":{"color":"#03a653"}},{"name":"Dark Green","value":1,"itemStyle":{"color":"#038549"}},{"name":"Vegetative","value":1,"itemStyle":{"color":"#28b44b"}},{"name":"Hay-like","value":1,"itemStyle":{"color":"#a3a830"}},{"name":"Herb-like","value":1,"itemStyle":{"color":"#7ac141"}}]},{"name":"Beany","value":1,"itemStyle":{"color":"#5e9a80"}}]},{"name":"Other","itemStyle":{"color":"#0aa3b5"},"children":[{"name":"Papery/Musty","itemStyle":{"color":"#9db2b7"},"children":[{"name":"Stale","value":1,"itemStyle":{"color":"#8b8c90"}},{"name":"Cardboard","value":1,"itemStyle":{"color":"#beb276"}},{"name":"Papery","value":1,"itemStyle":{"color":"#fefef4"}},{"name":"Woody","value":1,"itemStyle":{"color":"#744e03"}},{"name":"Moldy/Damp","value":1,"itemStyle":{"color":"#a3a36f"}},{"name":"Musty/Dusty","value":1,"itemStyle":{"color":"#c9b583"}},{"name":"Musty/Earthy","value":1,"itemStyle":{"color":"#978847"}},{"name":"Animalic","value":1,"itemStyle":{"color":"#9d977f"}},{"name":"Meaty Brothy","value":1,"itemStyle":{"color":"#cc7b6a"}},{"name":"Phenolic","value":1,"itemStyle":{"color":"#db646a"}}]},{"name":"Chemical","itemStyle":{"color":"#76c0cb"},"children":[{"name":"Bitter","value":1,"itemStyle":{"color":"#80a89d"}},{"name":"Salty","value":1,"itemStyle":{"color":"#def2fd"}},{"name":"Medicinal","value":1,"itemStyle":{"color":"#7a9bae"}},{"name":"Petroleum","value":1,"itemStyle":{"color":"#039fb8"}},{"name":"Skunky","value":1,"itemStyle":{"color":"#5e777b"}},{"name":"Rubber","value":1,"itemStyle":{"color":"#120c0c"}}]}]},{"name":"Roasted","itemStyle":{"color":"#c94930"},"children":[{"name":"Pipe Tobacco","value":1,"itemStyle":{"color":"#caa465"}},{"name":"Tobacco","value":1,"itemStyle":{"color":"#dfbd7e"}},{"name":"Burnt","itemStyle":{"color":"#be8663"},"children":[{"name":"Acrid","value":1,"itemStyle":{"color":"#b9a449"}},{"name":"Ashy","value":1,"itemStyle":{"color":"#899893"}},{"name":"Smoky","value":1,"itemStyle":{"color":"#a1743b"}},{"name":"Brown, Roast","value":1,"itemStyle":{"color":"#894810"}}]},{"name":"Cereal","itemStyle":{"color":"#ddaf61"},"children":[{"name":"Grain","value":1,"itemStyle":{"color":"#b7906f"}},{"name":"Malt","value":1,"itemStyle":{"color":"#eb9d5f"}}]}]},{"name":"Spices","itemStyle":{"color":"#ad213e"},"children":[{"name":"Pungent","value":1,"itemStyle":{"color":"#794752"}},{"name":"Pepper","value":1,"itemStyle":{"color":"#cc3d41"}},{"name":"Brown Spice","itemStyle":{"color":"#b14d57"},"children":[{"name":"Anise","value":1,"itemStyle":{"color":"#c78936"}},{"name":"Nutmeg","value":1,"itemStyle":{"color":"#8c292c"}},{"name":"Cinnamon","value":1,"itemStyle":{"color":"#e5762e"}},{"name":"Clove","value":1,"itemStyle":{"color":"#a16c5a"}}]}]},{"name":"Nutty/\nCocoa","itemStyle":{"color":"#a87b64"},"children":[{"name":"Nutty","itemStyle":{"color":"#c78869"},"children":[{"name":"Peanuts","value":1,"itemStyle":{"color":"#d4ad12"}},{"name":"Hazelnut","value":1,"itemStyle":{"color":"#9d5433"}},{"name":"Almond","value":1,"itemStyle":{"color":"#c89f83"}}]},{"name":"Cocoa","itemStyle":{"color":"#bb764c"},"children":[{"name":"Chocolate","value":1,"itemStyle":{"color":"#692a19"}},{"name":"Dark Chocolate","value":1,"itemStyle":{"color":"#470604"}}]}]},{"name":"Sweet","itemStyle":{"color":"#e65832"},"children":[{"name":"Brown Sugar","itemStyle":{"color":"#d45a59"},"children":[{"name":"Molasses","value":1,"itemStyle":{"color":"#310d0f"}},{"name":"Maple Syrup","value":1,"itemStyle":{"color":"#ae341f"}},{"name":"Caramelized","value":1,"itemStyle":{"color":"#d78823"}},{"name":"Honey","value":1,"itemStyle":{"color":"#da5c1f"}}]},{"name":"Vanilla","value":1,"itemStyle":{"color":"#f89a80"}},{"name":"Vanillin","value":1,"itemStyle":{"color":"#f37674"}},{"name":"Overall Sweet","value":1,"itemStyle":{"color":"#e75b68"}},{"name":"Sweet Aromatics","value":1,"itemStyle":{"color":"#d0545f"}}]}],"radius":[0,"95%"],"sort":null,"levels":[{},{"r0":"15%","r":"35%","itemStyle":{"borderWidth":2},"label":{"rotate":"tangential"}},{"r0":"35%","r":"70%","label":{"align":"right"}},{"r0":"70%","r":"72%","label":{"position":"outside","padding":3,"silent":false},"itemStyle":{"borderWidth":3}}]}}
{{< /echarts >}}

ECharts seems to be a little simpler than Vega-Lite if you want basic charts, particularly if you want a little out-of-the-box functionality.
However, you get limited fast if you want to add interaction or load data from the web if you want to still have your chart be declarative; unlike Vega/Vega-Lite, ECharts does not provide any built-in configuration for common interactions or loading data, you have to either use what's automatically set or do it via JavaScript.

## Simple Libraries

### Mermaid
[Mermaid](https://mermaid-js.github.io/mermaid/) is a diagram library.
It has many [integrations](https://mermaid-js.github.io/mermaid/overview/integrations.html), either natively or via a plugin.

[Pie Chart](https://mermaid-js.github.io/mermaid/diagrams-and-syntax-and-examples/pie.html):

{{< div class="mermaid" >}}
pie title Pets adopted by volunteers
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15
{{< /div >}}

```
pie title Pets adopted by volunteers
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15
```

Sequence Diagram:

{{< div class="mermaid" >}}
sequenceDiagram
  Alice->>Bob: Says Hello
  Note right of Bob: Bob thinks about it
  Bob-->>Alice: How are you?
  Alice->>Bob: I am good thanks!
{{< /div >}}

```
sequenceDiagram
  Alice->>Bob: Says Hello
  Note right of Bob: Bob thinks about it
  Bob-->>Alice: How are you?
  Alice->>Bob: I am good thanks!
```

Flowchart:

{{< div class="mermaid" >}}
graph TD
  st([Start])
  op1[My Operation]
  sub1[[My Subroutine]]
  cond{Yes or No?}
  io[/catch something.../]
  para[Parallel Tasks]
  e([End])

  st-->op1
  op1-->cond
  cond-->|yes|io-->e
  cond-->|no|para-->sub1-->op1
  para-->op1
{{< /div >}}

```
graph TD
  st([Start])
  op1[My Operation]
  sub1[[My Subroutine]]
  cond{Yes or No?}
  io[/catch something.../]
  para[Parallel Tasks]
  e([End])

  st-->op1
  op1-->cond
  cond-->|yes|io-->e
  cond-->|no|para-->sub1-->op1
```

I feel it's worth noting that Mermaid can be a bit rough around the edges sometimes.
For example, arrow syntax is different for almost every diagram type and diagrams don't always follow the max width (altough it looks like there was a PR merged to fix the latter).
That said, it's continually getting better and it's still a good library regardless.

### js-sequence-disgrams
[js-sequence-diagrams](https://bramp.github.io/js-sequence-diagrams/) is, as the name implies, a sequence diagram library.
The basic syntax is very similar to Mermaid's, which makes sense as Mermaid [credits it](https://mermaid-js.github.io/mermaid/?highlight=js-sequence) for the grammer.
That said, Mermaid has a lot more options albeit not being quite as clean in rendering.

{{< js-sequence id="simple" >}}
Alice->Bob: Says Hello
Note right of Bob: Bob thinks\nabout it
Bob-->Alice: How are you?
Alice->Bob: I am good thanks!
{{< /js-sequence >}}

```
Alice->Bob: Says Hello
Note right of Bob: Bob thinks\nabout it
Bob-->Alice: How are you?
Alice->>Bob: I am good thanks!
```

It also supports a hand-drawn theme and titles:

{{< js-sequence id="hand" theme="hand" >}}
Title: Here is a title
A->B: Normal line
B-->C: Dashed line
C->>D: Open arrow
D-->>A: Dashed open arrow
{{< /js-sequence >}}

```
Title: Here is a title
A->B: Normal line
B-->C: Dashed line
C->>D: Open arrow
D-->>A: Dashed open arrow
```

### Flowchart.js
[Flowchart.js](https://flowchart.js.org/) is, as the name implies, a flowchart libraries.

{{< flowchartjs id="1" >}}
st=>start: Start
e=>end
op1=>operation: My Operation
sub1=>subroutine: My Subroutine
cond=>condition: Yes
or No?
io=>inputoutput: catch something...
para=>parallel: parallel tasks

st->op1->cond
cond(yes)->io->e
cond(no)->para
para(path1, bottom)->sub1(right)->op1
para(path2, top)->op1
{{< /flowchartjs >}}

```
st=>start: Start
e=>end
op1=>operation: My Operation
sub1=>subroutine: My Subroutine
cond=>condition: Yes
or No?
io=>inputoutput: catch something...
para=>parallel: parallel tasks

st->op1->cond
cond(yes)->io->e
cond(no)->para
para(path1, bottom)->sub1(right)->op1
para(path2, top)->op1
```

While flowchart.js does support color styling, it takes it as a separate parameter so I haven't added it here.
The styling data is JSON though, so it shouldn't be terrible to do, but would require some finessing of the implementation (I'd rather make it possible to move to Markdown code block render syntax in the future than add extra parameters to a shortcode).

### WaveDrom
[WaveDrom](https://wavedrom.com/) is a diagram libary for waveforms and circuit/logic diagrams.
Unlike some of my friends, I'm not an electrical engineer, so I'm going to just post a couple examples and not even try to pretend I understand them (actually, I do know circuit/logic diagrams a little, but not much).

[Period and Phase Example](https://wavedrom.com/tutorial.html):

{{< wavedrom >}}
{ signal: [
  { name: "CK",   wave: "P.......",                                              period: 2  },
  { name: "CMD",  wave: "x.3x=x4x=x=x=x=x", data: "RAS NOP CAS NOP NOP NOP NOP", phase: 0.5 },
  { name: "ADDR", wave: "x.=x..=x........", data: "ROW COL",                     phase: 0.5 },
  { name: "DQS",  wave: "z.......0.1010z." },
  { name: "DQ",   wave: "z.........5555z.", data: "D0 D1 D2 D3" }
]}
{{< /wavedrom >}}

```js
{ signal: [
  { name: "CK",   wave: "P.......",                                              period: 2  },
  { name: "CMD",  wave: "x.3x=x4x=x=x=x=x", data: "RAS NOP CAS NOP NOP NOP NOP", phase: 0.5 },
  { name: "ADDR", wave: "x.=x..=x........", data: "ROW COL",                     phase: 0.5 },
  { name: "DQS",  wave: "z.......0.1010z." },
  { name: "DQ",   wave: "z.........5555z.", data: "D0 D1 D2 D3" }
]}
```

[XOR Gate Example](https://wavedrom.com/tutorial2.html):

{{< wavedrom >}}
{ assign:[
  ["out",
    ["|",
      ["&", ["~", "a"], "b"],
      ["&", ["~", "b"], "a"]
    ]
  ]
]}
{{< /wavedrom >}}

```js
{ assign:[
  ["out",
    ["|",
      ["&", ["~", "a"], "b"],
      ["&", ["~", "b"], "a"]
    ]
  ]
]}
```

### nomnoml
[nomnoml](https://www.nomnoml.com/) is a UML diagram library.

I find the basic example amusing so I'm going to include it as-is:

{{< nomnoml >}}
[Pirate|eyeCount: Int|raid();pillage()|
  [beard]--[parrot]
  [beard]-:>[foul mouth]
]

[<table>mischief | bawl | sing || yell | drink]

[<abstract>Marauder]<:--[Pirate]
[Pirate]- 0..7[mischief]
[jollyness]->[Pirate]
[jollyness]->[rum]
[jollyness]->[singing]
[Pirate]-> *[rum|tastiness: Int|swig()]
[Pirate]->[singing]
[singing]<->[rum]

[<start>st]->[<state>plunder]
[plunder]->[<choice>more loot]
[more loot]->[st]
[more loot] no ->[<end>e]

[<actor>Sailor] - [<usecase>shiver me;timbers]
{{< /nomnoml >}}

```
[Pirate|eyeCount: Int|raid();pillage()|
  [beard]--[parrot]
  [beard]-:>[foul mouth]
]

[<table>mischief | bawl | sing || yell | drink]

[<abstract>Marauder]<:--[Pirate]
[Pirate]- 0..7[mischief]
[jollyness]->[Pirate]
[jollyness]->[rum]
[jollyness]->[singing]
[Pirate]-> *[rum|tastiness: Int|swig()]
[Pirate]->[singing]
[singing]<->[rum]

[<start>st]->[<state>plunder]
[plunder]->[<choice>more loot]
[more loot]->[st]
[more loot] no ->[<end>e]

[<actor>Sailor] - [<usecase>shiver me;timbers]
```

<!--
### yUML 
(broken right now; does not render correctly)
-->

## Other Mentions

Here's a list of libraries that I tried to implement but appear unmaintained:

* [yUML](https://github.com/jaime-olivares/yuml-diagram)
* [dagre-d3](https://github.com/dagrejs/dagre-d3) (supports Graphviz DOT language)
* [viz.js](https://github.com/mdaines/viz.js) (Graphviz compiled for JS)
   * There seems to be an [active fork](https://github.com/aduh95/viz.js), but the work to use seems a bit high for simple charting

[PlantUML](https://plantuml.com/) is also worth a mention for declarative charting, but you have to encode your UML and send it to a Java-based server for rendering.
Personally, if the point is to handle it as an embed (such as from a `.puml` file) then I don't mind it, but for inline Markdown I'm not too keen on it.
The requirement for another server may also be a deal-breaker for people who want a simple solution and have requirements around where their data is allowed to be sent.

## Ending Thoughts

Declarative charts and diagrams are exciting because of how they can extend Markdown without requiring server-side code, complex code, or databases.

If you just want a basic sequence diagram or flowchart, js-sequence-diagram and flowchart.js are really good, simple options.
However, I personally think Mermaid and Vega-Lite can cover most use cases and are probably the most practical to work with.

Right now, you have to use shortcodes for these libraries in Hugo; eventually I'd like to see render syntax support for Markdown in general and Hugo support for code block render templates.
However, many Markdown editors have implemented support for at least Mermaid, which is exciting.
