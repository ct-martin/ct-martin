---
title: My Site API shown via Mermaid
date: 2020-04-19
libs: ['mermaid', 'vega-lite']
type: vis
---

I recently learned about [mermaid.js](https://mermaid-js.github.io/mermaid/), a library for declarative charts that's Markdown-friendly.
I wanted to play with it, so here we are.

<!--more-->

While it is still a JS library, I don't have to write any special JS to use it; all I had to do was load the library and make a couple `<div>`s on the page.
Currently, I'm using a Hugo shortcode I wrote to declare that `<div>` (since I'm making it a practice to avoid inline HTML in Markdown), but I'm hoping that soon we may see support for [render templates for code blocks](https://github.com/gohugoio/hugo/issues/6702) and eventually [Markdown adding code block syntax for rendering](https://talk.commonmark.org/t/beyond-markdown/2787) because I want to avoid being tied to a specific library as well.

## Let's make some charts

Here's a couple simple Pie charts with stats I pulled from the [JSON-LD/Schema.org-based API I added to my sites recently](https://blog.ctmartin.me/2020/04/schema-api-and-search/), along with their code :

{{< div class="mermaid" >}}
pie title Content Distribution by Site
  "Blog" : 36
  "Visualizations" : 6
  "Food" : 5
  "Photos" : 1
{{< /div >}}

```
pie title Content Distribution by Site
  "Blog" : 36
  "Visualizations" : 6
  "Food" : 5
  "Photos" : 1
```

Pretty easy, right?
Here's another:

{{< div class="mermaid" >}}
pie title Content Distribution by Schema.org Type
  "BlogPosting" : 36
  "WebPage" : 10
  "Recipe" : 1
  "ImageGallery" : 1
{{< /div >}}


## Vega

After I learned about mermaid, I was doing a little research and found out that there's another library called [Vega-Lite](https://vega.github.io/vega-lite/), which has a very similar premise but is based more on data charting than diagrams.
TL;DR, Vega was easy to throw in as well, so here's a demo.
Vega-Lite uses a JSON object to declare its data, unlike Mermaid, which uses a text notation.

Here are the same charts as above, but in Vega:

{{< vega id="bysite" >}}
{
  "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
  "description": "Pie chart of content by site",
  "data": {
    "values": [
      {"category": "Blog", "value": 36},
      {"category": "Visualizations", "value": 6},
      {"category": "Food", "value": 5},
      {"category": "Photos", "value": 1}
    ]
  },
  "mark": {"type": "arc", "tooltip": true},
  "encoding": {
    "theta": {"field": "value", "type": "quantitative"},
    "color": {"field": "category", "type": "nominal"}
  },
  "view": {"stroke": null}
}
{{< /vega >}}

{{< vega id="bytype" >}}
{
  "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
  "description": "Donut chart of content by type",
  "data": {
    "values": [
      {"category": "BlogPosting", "value": 36},
      {"category": "WebPage", "value": 10},
      {"category": "Recipe", "value": 1},
      {"category": "ImageGallery", "value": 1}
    ]
  },
  "mark": {"type": "arc", "tooltip": true},
  "encoding": {
    "theta": {"field": "value", "type": "quantitative"},
    "color": {"field": "category", "type": "nominal"}
  },
  "view": {"stroke": null}
}
{{< /vega >}}

Code for the left/first, based on [this example](https://vega.github.io/vega-lite/examples/arc_pie.html), but with a tooltip added:

```json
{
  "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
  "description": "Pie chart of content by site",
  "data": {
    "values": [
      {"category": "Blog", "value": 36},
      {"category": "Visualizations", "value": 6},
      {"category": "Food", "value": 5},
      {"category": "Photos", "value": 1}
    ]
  },
  "mark": {"type": "arc", "tooltip": true},
  "encoding": {
    "theta": {"field": "value", "type": "quantitative"},
    "color": {"field": "category", "type": "nominal"}
  },
  "view": {"stroke": null}
}
```

It's a lot longer to write, but Vega-Lite is prettier/more user-friendly, more powerful, has a lot more support for chart types, and is used by many large companies.

## More Mermaid

Here are a few more visualizations of creating the API and the [search engine](https://find.ctmartin.me/) based on it.
I'm using Mermaid for these since I want diagrams and Vega-Lite doesn't have those.

Here's what I currently provide for Schema output from the root API call.
Note that `WebPage` as `mainEntityOfPage` is the same Schema `@type` as the `WebPage` class, but has different properties given.
Most values are strings because of how they're expected to be encoded.
The Schema relationships are also visible here, so you can see how `ImageGallery` is a child of `WebPage`, but `BlogPosting` and `Recipe` have to define their relationship explicitly (note that Schema says any web page is implicitly a `WebPage`, but this isn't always respected).

{{< div class="mermaid" >}}
classDiagram
  Array *-- WebSite
  Array *-- ItemList
  ItemList o-- ListItem
  ListItem *-- Recipe
  ListItem *-- BlogPosting
  ListItem *-- ImageGallery
  ListItem *-- WebPage
  BlogPosting --> WebPage
  ImageGallery --|> WebPage
  Recipe --> WebPage

  class Array
  class BlogPosting{
    +String datePublished
    +String description
    +String headline
    +String image
    +WebPage mainEntityOfPage
  }
  class ImageGallery{
    +String datePublished
    +String description
    +String image
    +String name
    +String url
  }
  class ItemList{
    +Array~ListItem~ itemListElement
    +Number numberOfItems
    +String url
  }
  class ListItem{
    +Thing item
    +Number position
  }
  class Recipe{
    +String cookTime
    +String datePublished
    +String description
    +String image
    +WebPage mainEntityOfPage
    +String name
    +String prepTime
    +Array~String~ recipeIngredient
    +Array~String~ recipeInstructions
    +String totalTime
    +String yield
  }
  class WebPage{
    +String description
    +String name
    +String url
    +String datePublished
  }
  class WebSite{
    +String url
  }
{{< /div >}}

Here's a snippet of that:

```
classDiagram
  Array *-- WebSite

  class Array
  class WebSite{
    +String url
  }
```

Here's a diagram of what learning the Schema API syntax looked like.
A lot of the confusion is because there are multiple correct ways to write Schema and Google implements its own variant of Schema that doesn't technically contradict Schema per say but does have its own nuances.
Most of the time was spent learning the syntax as opposed to writing code.

Sorry if this goes off-page...

{{< div class="mermaid" >}}
stateDiagram
  learnS : Learn from Schema
  learnG : Learn from Google
  readGH : Read GitHub issues
  search : Search the web
  confuse : Confusion
  confuse2 : Still confused
  xref : Cross-reference
  rfc: Read an RFC

  [*] --> Idea
  Idea --> learnG
  learnG --> learnS
  learnS --> learnG
  learnG --> confuse
  learnS --> confuse
  confuse --> search
  search --> learnG
  search --> rfc
  rfc --> confuse
  confuse --> Sleep
  Sleep --> confuse
  confuse --> readGH
  readGH --> xref
  learnG --> xref
  learnS --> xref
  xref --> confuse2
  confuse2 --> learnG
  confuse2 --> learnS
  confuse2 --> Aha
  Aha --> [*]
{{< /div >}}

Here's what the API looks like:

{{< div class="mermaid" >}}
sequenceDiagram
  participant User
  participant Search
  participant APIs

  User->>Search : Loads Page
  Search->>APIs : Requests Content
  APIs-->>Search : Returns Schema Data
  Search->>Search : Parses & Simplifies Data
  Search->>Search : Calculates Filter Values
  Search->>User : Presents Search
  
  loop Filtering
    User->>Search : Filters/Searches
    Search->>Search : Applies to Data
    Search->>User : Updates Page
  end

  opt Finds Content
    User->>User : Clicks Link
  end
{{< /div >}}

One final example, how my sites are deployed:

{{< div class="mermaid" >}}
sequenceDiagram
  participant Me
  participant GitHub
  participant GitLab
  participant pages as GitLab Pages
  participant Cloudflare
  participant User

  loop Deploy
    Me->>GitHub : Push Content
    GitHub->>GitLab : Webhook
    GitLab->>GitHub : Fetch Repo
    GitHub-->>GitLab : (Repo)
    GitLab->>GitLab : CI Build
    GitLab->>pages : Deploy
    GitLab->>Cloudflare : Purge Cache
  end

  loop Visits Site
    User->>Cloudflare : Requests Page
    alt in cache
      Cloudflare->>User : Serves from Cache
    else not in cache
      Cloudflare->>pages : Requests Page
      pages-->>Cloudflare : (Page)
      opt cacheable
        Cloudflare->>Cloudflare : Puts in Cache
      end
      Cloudflare->>User : Serves Response
    end
  end
{{< /div >}}

So yeah, Mermaid is pretty powerful for diagrams.
The state diagram also demonstrated that it has some room for refinement, but regardless I'm really happy about what this enables me to do.