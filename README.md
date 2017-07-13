# WOD vampire character sheet with requiem styling

[![Build Status](https://travis-ci.org/jehy/wod-vampire-requiem-charsheet.svg?branch=master)](https://travis-ci.org/jehy/wod-vampire-requiem-charsheet)
[![dependencies Status](https://david-dm.org/jehy/wod-vampire-requiem-charsheet/status.svg)](https://david-dm.org/jehy/wod-vampire-requiem-charsheet)
[![devDependencies Status](https://david-dm.org/jehy/wod-vampire-requiem-charsheet/dev-status.svg)](https://david-dm.org/jehy/wod-vampire-requiem-charsheet?type=dev)

It is a vampire character sheet with requiem styling, created for [Charsheet.su](http://charsheet.su).   
It is based on wonderful [Mr Gone's character sheets](http://mrgone.rocksolidshells.com/) 
 so credit for design goes to him.
 
What I used for this character sheet:

- JQuery   
- Bootstrap 3   
- [X-editable](https://vitalets.github.io/x-editable/)   
- [Jquery bar rating](http://antenna.io/demo/jquery-bar-rating/examples/)

You are free to fork this repository, make pull requests and make new character sheets - of cause, those will be added to web site.


## Contents of the project:
* `/src` contains source code and css of the project
* `/dist` contains built and minified version of code (after you build it)
* `data` - folder for json files which contain data for this sheet -
 for example, list of traits, attributes or skills.
 Also contains `mock.json` - mock sheet data for testing.
* `fonts`, `img` - self described folders.


Contents of `/src`:
* `css`
  * `custom` - CSS files for this character sheet.
    * `charlist.css` - global css.
    * `dots.css` - css for displaying dots. Suddenly, yeah?
    * `list1.css`, `list2.css`, etc - css, grouped by the number of the list.
    * `print.css` - special styles for printing - hide elements, make font smaller, etc.
* `js` - different javascript.
  * `images.js` - used for handling images - uploading, removing.
  * `jquery.barrating.js` - JQuery bar rating, modified for printing.
  * `index.js` - combines all js above.

Latest version is built using Node.js and webpack. If you don`t know
Node.js, you can make your own sheet in simple HTML, CSS and JS.

Of cause, for saving and loading your character sheet data you will need
 to publish your repository on [Charsheet.su](http://charsheet.su)
and use it's api - but you will be able to develop without it.

## Getting started:

1. Clone \ Fork this project
2. Run `npm install` to install all dependencies
3. Run `npm run build-dev` to build JS and CSS
4. Open `dist/index.html` browser (it will use mocked sheet data)
5. Edit any HTML, JS and CSS from `/src`!
6. Please send me new versions :)

## Code quality

Please use ESLint with configuration in `.eslintrc.json`.

## FAQ:    

Q: Why do you use images instead of backgrounds?   
A: Because otherwise browsers don't allow to print background.   

Q: Why do you use SVG for some blocks?   
A: Because this way browser does not change text color when printing.