# The Journey
I've been studying CS in some form for over 8 years. I got my start taking a web development class in high school. It used ASP.net and IronPython. Despite having my roots in web development, I never really touched the area after that class. I got more into backend and algorithm design.

Now that I'm a product manager on Chrome, the rendering engine and API's no less, I thought it would be a good idea to get my hands dirty and really dig into web development. This README is meant to document that journey, highlighting pain points and victories alike.

# Prologue
Every project needs a good build setup, right? Shouldn't be too hard, just Google for the right language - maybe a nice iTunes U course if I'm lucky - pick the best IDE, and I'm off.

...

Dear God.

## Languages
This part actually isn't that bad. Thanks to [node.js](nodejs.org) you don't really *have* to learn a million crazy backend languages anymore. Sure, you still can, but it looks like JavaScript, HTML, and CSS can take you all the way these days. Nice.

## Text editor
The first big divide. Googling around, there are a few big winners. I won't go into the full list here, but it seems like [sublime](https://www.sublimetext.com/) and [atom](https://atom.io/) are top of the pack. Sublime is the reigning champion with a well developed package ecosystem and lots of time at the top to work on the finer points of her game. Atom is the upstart - newer, with loftier ideals but a lingering performance problem.

I chose atom for a couple reasons.

- It's built using JS, HTML, and CSS, so any hacking I do on it will reinforce my web development learnings.
- It's built more recently, which means it had the chance to learn from previous editors (like sublime).
- The rate of polish is pretty fast, so any areas it's lagging will probably be fixed soon.
- I've used sublime before and I love new toys.

## Packages
You may have noticed that I did not download an IDE. And that I mentioned package ecosystems. If you're familiar with web development, learned CS before Java+Eclipse snagged the educational landscape in its grubby fingers, or spend time developing for more than just iPhones this may not surprise you. But just to bring that poor soul in the back up to speed - web development doesn't do IDEs. Sure, they exist, but they're really impractical given the ecosystem.

Ah, the ecosystem. Let me tell you a fundamental truth about the web that it's best to embrace now. The web is open. *Truly open*. It's not like iOS, or Android, or even c++. The web isn't one company that gets to enforce a style guide, or opinions, or *coherence*, or anything silly like that. It's not one language, and within a language it's not even homogenous.

On the web, there is a thousand ways to do everything.

Languages rise and fall. Frameworks become _enormously_ popular, only to fade 3 years later. Build setups are constantly evolving. If a problem exists, someone's solved it, someone's copied it, 4 more clones popped up, someone made the canonical solution, and then someone realized maybe it should be solved with a completely different paradigm.

For the rookie, this makes trying to learn horrible. It's like you're in the desert, dying of thirst, and someone handed you a firehose. And then they said "You know what? Fuck it." and dropped the entire ocean on you. While you're learning, you need focus. You need someone who can say "Yes, there are 8 ways to do this. But 90% of the time, this way is best. Bless your heart." You just need to learn 1 way end to end so you can get your head above water. Then you can start swimming through the wreckage and collecting more flotsam to build your mobile trash fortress like in [water world](https://en.wikipedia.org/wiki/Waterworld). Maybe this journey will help you get your head above water.

But before I go too far into gloom and doom, let me show you the light at the end of the tunnel. Once you get a grasp on web development, you become a _super hero_. Suddenly those 1,001 solutions to every problem become like Batman's utility belt. No company controlling the platform and being able to decide "your use case isn't supported anymore" means you're Superman, impervious to harm. Once you know what you're doing, the web is the richest development ecosystem on the planet. There's a reason JS is the most [popular language in the world](http://stackoverflow.com/research/developer-survey-2016), or why most projects are built at least in part with web technologies.

OK, so I went on a bit of a tangent there...

## Packages, for real
The reason I got so off track, is because I think the build setup for web development is a direct result of the web ecosystem. Because languages, frameworks, and build tools are constantly changing, you just can't afford to put all your resources into learning an opinionated, do-one-thing-well IDE. Just like with web development, you need to be flexible. Learn the fundamentals really well and hot-swap whichever pieces are currently evolving.

So that means you're going to develop with a text editor.

But don't worry! There are lots of nice packages to make it feel more awesome. For atom, I've installed:

- [Pigments](https://github.com/abe33/atom-pigments). So far this is my favorite. Whenever you type a color (or a variable that references a color in your project), Pigments will highlight it with that color.
- [Color Picker](https://atom.io/packages/color-picker). A nice pairing with Pigments, color picker allows you to bring up a color wheel, select a color, then insert the hex value.
- [Emmet](https://atom.io/packages/emmet-simplified). I will admit I haven't made this one useful yet. But I hear it's awesome. It enables a shorthand for typing HTML really fast.
- [ESLint](https://github.com/AtomLinter/linter-eslint). A JavaScript [linter](http://stackoverflow.com/questions/8503559/what-is-linting) that's extensible - allowing you to apply your own style guidelines.

## Build process
Oh boy, here's where things get really fun. This is the wild west. Everyone has an opinion. There's one freebie though:

- Install [node.js](nodejs.org) and [npm](npmjs.org)

These will let you leverage JS for backend and import basically all other useful packages.

Next up, you might want some kind of taskrunner. There's a lot of repetitive tasks in web development:

- Linting all your files
- Minifying your code so that it loads quickly
- Inlining styles to reduce server round trips
- Yada, yada, yada...

There's a lot of taskrunners available, but let me make your life simpler. Here are three:

- [Grunt](http://gruntjs.com/) - Old school. You do everything through configuration files.
- [Gulp](http://gulpjs.com/) - The new hot stuff. Everything is done with code.
- [Webpack](https://webpack.github.io/) - Configuration like Grunt, but theoretically less annoying.

My recommendation is to use Gulp. It's the current hotness, so it'll be getting a lot of attention. It also uses code instead of configuration, which is more flexible. _ALSO_, while you're learning, everything will be more straightforward rather than these magical config files that only make sense once you know how *every part* of your build process is supposed to work. Gulp is better for learning in bite sized chunks.

## Nevermind
All of that being said - forget it. This is about the moment when I realized that you don't need any of this to get started. What's more, as you pick frameworks or components to leverage, they'll force some of these decisions on you.

Just download atom and start hacking. You'll learn and add on tools as you need them.

`python SimpleHTTPServer -m` will start a local server in whatever folder you're in. You can use that to preview your pages. Worry about all the crazy tasks and packages once your project is big enough and deployed enough to start caring.

## Polymer
Once I gave up on perfecting my build system from the start, I looked for something that would get me off the ground quickly. I chose the [Polymer App Toolbox](https://www.polymer-project.org/1.0/toolbox/). Full disclosure - this is a Google project, so I'm biased.

I chose Polymer because:

- I literally sit next to the team, so I can bug them and ask them questions
- Polymer is meant to stay as true as possible to the web platform. It doesn't add big opinionated framework constructs on top which means my learnings should be reusable.
- The App Toolbox does everything you need to get from zero to a barebones web app in 15 minutes. Optimize for hacking as soon as possible.

# Rising Action
## Installing the app template
After choosing the Polymer App Toolbox, I installed the [polymer-cli](https://www.polymer-project.org/1.0/docs/tools/polymer-cli) and ran `polymer init app-drawer-template`. This gives me a nice responsive single page app template, that theoretically handles a lot of the more complex stuff out of the box:

- General UI layout
- [Routing](https://www.polymer-project.org/1.0/articles/routing)
- [App shell caching](https://developers.google.com/web/updates/2015/11/app-shell?hl=en)

Turns out this is *sort of* right. It does all those things, but customization is funky. The first thing I try to do is rename the first example view to a homepage. I grep through the project to find all instances of the first view and change it to `readme.html`.

Errors all around.

Long story short, the app-drawer-template uses a weird routing convention where your views are named '<x>' but all the files are named 'my-<x>'. Once I figure that out, the rest is trivial. At some point I'd like to go back and change that routing logic, but for now I'm just trying to get comfortable in my new home.

## The target UI

## Building the `<expandable-card>` element
Looking through the Polymer [element catalog](https://elements.polymer-project.org/), my first thought is that the UI I have planned to show a talk is pretty similar to [paper-card](https://elements.polymer-project.org/elements/paper-card). There even looks like a nice expandable paper-card demo!

Copy paste! Errors!

- The example uses `document.getElementById()` which isn't available from within custom elements. A quick Google search solved this one - use Polymer [automatic node finding](https://www.polymer-project.org/1.0/docs/devguide/local-dom).
- Automatic node finding (`this.$.<idName>`) doesn't work normally with dashed names. Another quick Google search - use `this.$[dashed-id]`.
- `hardware:keyboard-arrow-up` doesn't exist. This is a problem I've had repeatedly with any of the [`iron-icon`](https://elements.polymer-project.org/elements/iron-icon) features in Polymer. I __never__ get it right. There's always some hidden package I have to import, or something that Bower didn't manage to download.
- `onclick` event isn't getting called. tl;dr: you need to use [`on-tap`](https://www.polymer-project.org/1.0/docs/devguide/gesture-events) inside custom elements instead of `onclick`. I found this out with sheer dumb luck comparing to another project.

I still don't understand why the Polymer example doesn't play nice inside custom elements. I get the feeling that those errors were supposed to be 'obvious', but that's only once you really know your way around, at which point you probably don't bother copying 10 line code examples...

Now that I've got the demo working, let's style this bad boy. My first thought is to use all the nice pieces of the card structure, putting the talk title in the card header, the description in the card-content, and then the expandable portion in the card-actions. I hit two problems:

- There was a bit of jitter when you expand from the card-actions
- The mixin that allows styling of the card header is super opaque. It doesn't say what classes it operates on, how you can customize, etc.

5 minutes into looking at the source code for paper-card I realize all value of reusing the element is lost if I'm digging this deep, so I throw everything into card-contents and style from there.

Next problem, I want the entire card to expand when the user taps on it but I also want you to be able to hit the like button. Right now, the top level card gesture eats the like gesture as well.

I end up moving the like button outside card-contents and absolute positioning it in the top right corner of the card. Still no dice. I think it's because the card-contents are still technically taking up the whole card container and overlay on the like button. I set the like button's `z-index` to 1 and everything works!

## Using `@media` queries
This next one was a doozy. I decide that I want to get fancy. On mobile screens, the talks should take up the full width of the screen, but on larger form factors I want them to fit into a grid.

A quick Google search shows that the iPhone 6S+ has a width of 750 pixels, so I set the media query to that. I do some hemming and hawing and up the cut off to 900 pixels.

Below 900 pixels, `width:100%` works great. Above, I set `width:50%`. Cool. 2 to a column.

Errors.

The cards look appropriately shrunk, but they're still showing 1 to a line. Playing around with devtools, I see that there's `10px` of padding set on the page container. Maybe that's it? CSS3 has a nifty [`calc()`](https://developer.mozilla.org/en-US/docs/Web/CSS/calc) function that lets you use percentages and then lop off a few pixels to account for things like padding. I found the solution to this problem pretty quickly. I'm getting the hang of this. I set `width: calc(50% - 10px)`, feeling smug.

No dice.

I sit down with __Paul Irish__ figuring he'll help me figure things out quickly. The first thing he does is point me at [`box-sizing: border-box`](http://www.paulirish.com/2012/box-sizing-border-box-ftw/) once he sees me using `calc()`. You see, the annoying thing about `width` is that it only takes into account the size of your content area, not border or padding, when you use percentages. This makes it really hard to say something like "no really, I just want this damn box to be 50% of the page" as well as "could my text please not be smooshed against the edges?".

`box-sizing: border-box` fixes this by changing the behavior of width to calculate percentages based off of border + padding + content. Thank you Paul for pointing me at this awesome feature that makes sizing so much more rational all around! And also fixing my problem!

Except the problem isn't fixed.

We keep poking and eventually realize that even though the cards have no margin, there's a *tiiiiny* little space between them. And then Paul laughs a wise, world-weary laugh and tells me that if you use `display: inline-block` for an element, it will render any [whitespace that's in __your code__ between elements](https://css-tricks.com/fighting-the-space-between-inline-block-elements/). This is because `inline-block` is meant to be used for displaying inline things like text. The conclusion is that I'll have to use [`flexbox`](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Using_CSS_flexible_boxes) to lay these bad boys out.

## Flexbox
So first, let me say this is the first section I'm actually writing as I work. The rest was playing catch up from memory. Any changes in tone and level of detail are likely due to that.

First things first, I go into my `<expandable-card>` custom element and clean up all the various layout hacks I was trying to figure out my problem from the day before. Now everything is box with no margin. Should be nice and easy to layout.

I read this pretty great [intro to flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) and I'm getting excited. This seems like the promise of the web - flexible, powerful, and pretty clean.
