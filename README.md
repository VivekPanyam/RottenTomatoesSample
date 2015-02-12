# Rotten Tomatoes App using React Canvas

I built this app to try React Canvas and test scroll performance.
It's heavily based on the css-layout and ListView examples in React Canvas.
Please note that I didn't spend a ton of time on this so it may have some issues. I welcome pull requests!

Demo: http://vivekpanyam.com/samples/reactcanvas

The app looks like this (it displays the top 50 rentals on Rotten Tomatoes):

![Screenshot](http://i.imgur.com/t4VhXiL.png)

### Building

Unfortunately, this code doesn't run out of the box.

I didn't want to include all of the files required to build React Canvas.
Once there is an official standalone build of React Canvas, I'll update this repo to use it (and make it work out of the box).

One way to run it now is to download the React Canvas repo and replace the contents
of `examples/css-layout/app.js` with the contents of `main.js` (from this repo).
Copy the rest of the files in this repo into the same folder as above and update paths inside `index.html`
as appropriate.


**Note: I am not affiliated with Rotten Tomatoes.**
