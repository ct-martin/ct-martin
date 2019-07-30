---
title: 'Designing for a touch medium'
date: Wed, 21 Nov 2018 13:00:16 +0000
draft: false
tags: ['599 - Dual-touch Design', 'Design']
---

Touch-based design works a bit differently from a traditional mouse & keyboard design.

<!--more-->

With a mouse & keyboard the user typically has over 100 buttons which can also be used in combinations to yield hundreds of possible actions.
Additionally, UI elements can be kept small by virtue of the precision of a mouse’s movement.

In a keyboardless touch medium UI elements need to be larger to account for the lack of precision in a user’s tapping, and typing large amounts of text becomes difficult.
Part of how a human interacts with the keyboard is through the physical (tactile) feedback from their fingers.
A perfect example of this is the ability to rest your fingers on the keyboard without pressing any buttons and automatically align them without looking (the bumps on the F and J keys help with this).
Additionally, you have a clear sense of when you actually press a button.

On a touch device you lose this feedback.
Touching a capacitive screen with automatically make a keypress even if you didn’t intend it, and even with haptic feedback, if the device has it, there is still not a complete sense of feedback that you pressed that particular button.
Since the device being used in this project is a touch device, the design of applications intended for it need to be a bit different.

The first application that was considered was a kiosk, like would be seen at a store.
In a two-screen kiosk (like the Nintendo Switch kiosk pictured below), there is typically a primary and secondary screen.
Unlike my project, the Nintendo Switch kiosk only has one touch-screen, but much of the UX is still relevant.
The lower screen is used for navigation of content, while the top screen provides a more information, in this case by the medium of video clips.

{{< figure
    caption = "Nintendo Switch kiosk"
    src = "https://lh5.googleusercontent.com/_jQpI0yBr8zeR_2kZF-R35RZtbLvC5gJSeyePFXjspQ9j7kjT134LUAs1LZJQO44G0ZDdsqwP5j7ItGoS-DKcttMDeqSkjUnhO_247fmdIFiwJp7f96wV-0ji0QdJhskK2CJcEHb"
    attr = "Mike Mozart - CC-BY 2.0"
    attrlink = "https://www.flickr.com/photos/jeepersmedia/40635432954/"
>}}



A very similar UX is a mall kiosk with a single, large touchscreen. Unlike where there’s a split in my project and the Nintendo Switch kiosk, this uses the center portion of the screen for the primary content and puts the extra information at the top of bottom, presumably due to the highest and lowest areas being inconvenient to reach.

{{< figure
    caption = "Mall touchscreen kiosk"
    src = "https://lh3.googleusercontent.com/y62e8YeS8L4RITP3pIcvK-gohbJSfvG81pmLIxcHt5IUjG_KUQy4zad5ufIOaBOkH4XHn4l9TImHMhA7jhnIa62Rb6_2jt9LgqSH5z9yVJLD75h0-Y7zmjr7roXWpRjzm5wFdhkQ"
    attr = "Runner1928 - CC-BY-SA 4.0"
    attrlink = "https://commons.wikimedia.org/wiki/File:Saint_Paul_Union_Depot_at_Christmastime_16.jpg"
>}}

However, the use of this hardware is not limited to just kiosks. Another usage of them could be as a virtual book. The particular hardware I have has about a ½-inch difference between the two screens when flat, and weighs a lot, so it’s not suitable for this, but with different hardware this is already a reality. Having virtual pages would also be beneficial for accessibility reasons, as typeface and text size could be changed easily.

{{< figure
    caption = "Reading a book on a tablet w/ two pages being displayed at a time; this could be split down the center"
    src = "https://lh5.googleusercontent.com/_ND-yE0MNNeELKkzWeQy7XnwLAUooy-7IgJSdyye0uTlJD3tOCWfbUM-ajzyt6rYqob-pfX2uczDRXRnMTWpKuqU2PqZtuFZX953jPJiuk5W7wpFFA34IIhU9quvySs_1lwqnW32"
    attr = "Pxhere - CC0"
    attrlink = "https://pxhere.com/en/photo/1387075"
>}}

To counter the bad experience of typing, another way usage could be with the device mounted sideways and using a keyboard. This would be useful for research and coding purposes, where being able to read long amounts of text would be easier to do, particularly as much text content is pillarboxed to keep it easy to read on screens in a landscape orientation. Having more content visible would also be beneficial for going between a window of research on one screen and a document on the right. For research, it would also be convenient as the touch would allow for easy markup with drawing/annotation tools.

{{< figure
    caption = "A non-touch (but sideways-oriented) coding setup; a computer setup with three portrait-oriented monitors allows for longer reading instead of cinema format."
    src = "https://lh6.googleusercontent.com/yGVSErBeaGMdQk5eenVSyrIXupcGMpVvQNa3us4Xzc8K3DV4gwv42E6c0aPa-wNvUHOuGcM3PvUQ_k20hDNtQcAEU4-zoFivPFYYvHPZVkbhmKtVrr1tHUhVSj7Y2_RxyIHz-ZqA"
    attr = "coneybeare - CC-BY 2.0"
    attrlink = "https://www.flickr.com/photos/coneybeare/5358097188"
>}}

Going back outside of text-based uses, the second touchscreen could be used as a control board, like used in the audio-visual industry. When editing sound and video it is not uncommon to have control boards with buttons, faders, dials, etc. attached to the editing computer. Control boards have been used in the A/V industry for a long time now. Having the second screen as touch would also have issues with being tactile, but would allow for a lot of flexibility by allowing different applications could have different layouts that are more appropriate for their work. Additionally, users could configure the layout and tools to be more ergonomic and to better suit their personal workflow.

{{< figure
    caption = "An old video editing control panel with a number of knobs and buttons to interface with the software"
    src = "https://lh3.googleusercontent.com/xJtK6gjpO7f6wODmQ7PXke-Ga1GMSW-0YB-OgUM7EVfl4E5HlC5QPqvFj7s-6Ma9QYIs4vWVTeU8hQfeLArKPf4PUF-oYvcPi5GXs0eVcXsFwzxkp9k17JoKPSX1sKsnGJL4_PBI"
    attr = "37Hz - CC-BY 2.0"
    attrlink = "https://www.flickr.com/photos/37hz/1118026749/"
>}}

Finally, I can see this being used by illustrative uses. Drawing tablets are fairly common in the industry for usage particularly with Adobe Illustrator, Adobe Photoshop, and Corel Draw. An example of this is in the photo below, where having the laptop’s screen above the tablet would be easier than looking far to the right.

{{< figure
    src = "https://lh5.googleusercontent.com/GqgWgrcvgOT-ZkGa37LbkBz1Ae6I7RXK_jgWESU2Qmones9UnnTzF0LXDzHxl1TjdAeiQ7HpOx2TsycrvIbUlQnD-S_GU_z9mAq8iEE4uG4KZ8s6_Zy7gCEujQcOYPHGkX-C-MUB"
    attr = "Iwan Gabovitch - CC-BY 2.0"
    attrlink = "https://www.flickr.com/photos/qubodup/12248488454/"
>}}

In the future I’ll probably find more uses for this hardware, but for now these are the ones I can think of. If you have any other thoughts, feel free to discuss them in the comments below.

* * *

EDIT: While watching reviews for post #6, the usage of rotating so the screens are more than 180deg was mentioned as being able to have a touchscreen facing two people opposite of each other for easy presentation. My hardware is not capable of rotating that far unfortunately, so I won’t be experimenting with that, but it’s also a neat use case.

---

_Updates:_

_2019-07-29: Content reflow & link updates_