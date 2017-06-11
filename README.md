This is the frontend code for
[PlateyPlatey](http://plateyplatey.com). The server code (extremely
rudamentary) is available in [another repo](NYI).

# What is PlateyPlatey?

*This is a shorter form of a [blog post](
 http://www.adamkewley.com/programming/2016/10/18/platey-platey.html)
 that explains the story behind PlateyPlatey*

Many lab robotic and analytical platforms—for example, HPLCs and
FTIRs—accept plates containing samples as inputs. Many researchers,
and research software platforms, however, require standard spreadsheet
layouts for data.

Although the grid layout of most plates translates straightforwardly
into an spreadsheet format, that layout is annoying to sort,
aggregate, and apply formulas accross. As a result, there's a
disconnect between tables—a format that suits straightforward
manipulation—and plates—the format that's actually being used.

I have personally witnessed how much time and effort that simple
disconnect can cost. When I was in the lab, I wanted a visual
representation of the work I needed to do. I've had *very* tedious
plating session where I would read an excel spreadsheet and perform a
common mental juggling act along the lines of "ok, row A5 of my excel
spreadsheet is actually B6 on the plate, time to pipette that
acid. Wait, what row was it again?". When I was in the office, I
wanted to plot column A against column B. Having the data in a plate
layout would be *very* annoying for that.

In response to that, I made [PlateyPlatey](http://plateyplatey.com), a
home project I have been casually chipping away at for around a year
now. Although it's not anywhere near the level I'd like it to be,
hopefully other people will find it useful in some restricted
situations.

# Architecture

PlateyPlatey went through *many* architectural changes as I was
building it (see earlier revs for Makefiles, angular1, canvas
implementations, etc.). In this iteration, it uses typescript + SASS,
angular2, RxJS, webpack, and babel.

# Building

All dependencies for PlateyPlatey are acquired via npm:

```
npm install
```

And the build is performed by running:

```
npm run build
```

Which will put the built files in `/dist`. These files can then be
hosted on any static webserver. However, beware, PlateyPlatey pulls
user configurations, plates, and documents from the PlateyPlatey
server. So you will also have to configure and boot a server if you
want PlateyPlatey to work.
