---
title: Building a metadata API & Search
date: 2020-04-19
tags: ['Web Dev']
---

[Schema.org](https://schema.org/) is a semantic, structured way to write metadata, and also part of [how Google understands](https://developers.google.com/search/docs/guides/intro-structured-data) your site's content.

<!--more-->

For those not familiar with all of those words, let's break that down.
Metadata is information about things.
Structed means that there is a defined grammar for how to write things.
Semantic means that things are declared by or in relation to their meaning.

Writing this metadata is important because computers struggle to understand humans and by providing this metadata you can better convey what you're saying to search engines.
This doesn't mean you can provide bad metadata though; Google will still look at your page, it just understands the metadata better.

## In Practice

One of the nice things about Schema.org being structured is that I can reformat it for both human and computer consumption.
For example, I define recipies using something called "Front Matter" and then process it in my templating.

Here's what I provide in the ["Andy Chai" recipe](https://food.ctmartin.me/recipe/andy-chai/):

```yaml
title: "\"Andy Chai\""
date: 05 Apr 2020
draft: false

cookTime: "30M"
prepTime: "5M"
totalTime: "35M"
yield: "4-6 cups"

ingredients:
  - "..."

instructions:
  - "..."
```

You see a pretty recipe on the page, but this is what Google sees:

```json
{
  "@context": "https://schema.org",
  "@type": "Recipe",
  "cookTime": "PT30M",
  "datePublished": "2020-04-05",
  "description": "A chai tea mix named after its refiner, Andy Meyer.",
  "image": "https://food.ctmartin.me/recipe/andy-chai/chai.jpg",
  "mainEntityOfPage": {
    "@id": "https://food.ctmartin.me/recipe/andy-chai/",
    "@type": "WebPage"
  },
  "name": "\"Andy Chai\"",
  "prepTime": "PT5M",
  "recipeIngredient": [
    "..."
  ],
  "recipeInstructions": [
    "..."
  ],
  "recipeYield": "4-6 cups",
  "totalTime": "PT35M"
}
```

Not super readable, is it?
Like, it makes sense, but you wouldn't want to read your recipes that way.
But that's ok, because you're not meant to see it directly.

## Learning Schema.org

Learning Schema.org is a bit of a pain.
For one, there are a bunch of ways to write it, which are all valid.
For example, you can provide an array, graph, hierarchy/relation, or list when you want to declare multiple items.
This is further complicated by inconsistent examples, any web page being implicitly a `WebPage`, and Google adding their own modifications for their Schema.org parsing.

Learning Schema.org was quite honestly the hardest part of this process.
However, once you dig deep enough in GitHub issues and cross-reference them with Google and Schema.org's documentation, you can eventually get the right idea.

The main points I had a hard time figuring out were hierarchy, listing multiple items, and Google's changes.
[This GitHub comment](https://github.com/schemaorg/schemaorg/issues/1115#issuecomment-215633901) answered the first, which is to start with the most important thing and work from there.
The second I ended up based on [Google's Carousel example](https://developers.google.com/search/docs/data-types/carousel), which says to use an `ItemList`.
The third is largely answered by comments like [this one](https://github.com/schemaorg/schemaorg/issues/2045#issuecomment-418391349), which says, "Schema.org itself has no notion of mandatory or required properties."
In other words, anything on the Schema.org website is valid, any restrictions are given by Google (including Google only directly supporting a subset of Schema).

## Building an API

Since Schema.org is structured, I was writing it anyway, and my stuff is ([for reasons](https://github.com/ct-martin/find.ctmartin.me#background)) spread across a few places, I decided I wanted to write an API for my sites using it.
[Hugo](https://gohugo.io/), which [powers my blog](https://blog.ctmartin.me/2019/10/hugo/) (and other sites), has excellent support for JSON, so I can easily use the JSON-LD notation for Schema.org.
I created a "partial" template, which returns a dictionary/map of Schema.org-structured data and outputs it as JSON on both on the page itself and the API. This API can be found at `/index.json` on my Hugo-powered sites.
I also did a couple tricks to allow clean iteration and nesting for generating a list of the entire site.

## Using the API

Since I have this easily-available API for my websites, I realized I could build a search engine to allow users to easily find content.

I set up a static [Nuxt.js](https://nuxtjs.org/) SPA (single-page app) with [Nuxt's TypeScript support](https://typescript.nuxtjs.org/), SASS, and my [pre-existing Hugo theme](https://github.com/ct-martin/ctmartin-hugo-theme).
A few template tweaks later, everything looked right.

Nuxt, being a JavaScript-based framework, has native support for JSON handling.
Writing the parser was super easy, since all I had to do was recurse through the Schema.org metadata and pick out what I needed.
This was also aided by JavaScript's "or" assignment operator, which allows you to use `a || b` to say "if `a` exists, use `a`, otherwise use `b`."

I then calculated all available sites and types to filter by, which are presented to the user.
There's also a textbox for searching the name and description of a page.

The last was was resolving all of the TypeScript errors that came up.
The page/component declaration was a bit tricky to find the documentation for, but otherwise all I had to do was [define a few types](https://github.com/ct-martin/find.ctmartin.me#schema-property-mapping).

## See it Yourself

Here's the API endpoint for this blog: <https://blog.ctmartin.me/index.json>

The search engine: <https://find.ctmartin.me/>

Visualizations about this process: <https://vis.ctmartin.me/api-in-mermaid/>

I hope you found at least something interesting from this.
If you like semantics and metadata, there's some fun stuff in the [Schema.org issue tracker](https://github.com/schemaorg/schemaorg/issues/), such as a legitimate conversation about whether non-human entities can be considered a `Person` and metadata list page about metadata on metadata.
Have fun reading :)