---
title: Cleveland Museum of Art Collection Statistics
date: 23 Jan 2020
alises: ['/museum/cma']
---

Taking a look into the open access data for the Cleveland Museum of Art.

<!--more-->

---

[View here](https://vis.ctmartin.me/museums/cma/view) - [Code here](https://github.com/ct-martin/vis/tree/master/static/museums/cma/view)

---

This is similar to the [Metropolitan Museum of Art](https://vis.ctmartin.me/museums/met/) collection statistics I previously did, but has some notable differences:

1. Including the write-up inline with data
2. Different museum collections
3. Pre-processing is done entirely in the browser
4. Different charting libraries
5. Different chart types

Some opinionated choices made about how to do this:

* Since I'm pulling from a regularly-updated source, I want to do processing in code rather than a GUI tool
  * This makes it harder to handle free-text fields, but makes updating the data much more reliable
* I gave up trying to make the x-axis text for the first couple charts readable
  * Trying to go smaller resulted in unreadable text
  * Trying to go diagonal didn't work out cleanly
* Make all functions outside of the specific charts as generic as possible
* Use the Cleveland Museum of Art website's color scheme
  * I also didn't feel that color or point radius were effective in these charts, especially the latter when points were close together

Notable edge cases:
* Some accession numbers follow an old format of `ID.YYYY...` instead of `YYYY.ID...`
* A few item didn't have an accession number, (which is not supposed to happen...). I chose to ignore them

What was presented:
* Basic stats
  * Total items
  * Number of departments
  * Number of `Type`s (akin to the Met's `Medium`)
  * % of collections that are marked public domain
* Number of items per department
  * Gives information about how collections fit into the organization
* Number of items on display per department
  * Gives information about what the museum is presenting
  * When compared with the total number of items per department it can create interesting results
* Number of items by `Type`
  * Shows the kinds of items in the museum
* Number of types over number of items, by department
  * Searching for correlation between size of a department's collection and the kinds of items it contains
  * Can tell us about how thorough a department is in utilizing metadata
* Percent public domain over count, by department
  * Of personal interest as someone engaged in open source
  * (Open access is also a museum value)
* Growth per year
  * How the conflation of a lot of factors influenced the size of the collections

Process:
1. Downloaded data
2. Examined in OpenRefine
3. Visualized more general info in d3
4. Deeper examination in OpenRefine
   * Used filters based on string manipulation to search for more complex data and prototype logic
5. Built more complex logic into summarization and charts

Things I didn't get to but would like to look more into
* Per-department stats
  * I did this with the Met
  * How would it mesh well with narrative style?
* On-display per type
  * Just didn't get to; already have the data summary for
* Culture field
  * Unlike the Met, this has better formating
  * Most things are `Primary, more specific stuff`, so can split on the comma with reasonably good accuracy
  * Would need to do a <1% aggregation again
* Estimated year of item
  * If start > end, then BC
  * If start === 0 && end === 0, then ignore
  * If no start nor end, then check text column; if /[0-9]{4}/ then single year
    * Couple similar cases (e.g. YYYY-yy for start/end years)
  * Notable edge case
    * Roses project (ongoing so no end date)