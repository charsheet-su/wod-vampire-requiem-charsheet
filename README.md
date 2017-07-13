# WOD vampire character sheet with requiem styling

It is the second character sheet, created for http://charsheet.su.   
It is based on Mr Gone's character sheets (http://mrgone.rocksolidshells.com/) so credit for design goes to him.

What I used for this character sheet:

- JQuery   
- Bootstrap 3   
- X-editable https://vitalets.github.io/x-editable/   
- Jquery bar rating http://antenna.io/demo/jquery-bar-rating/examples/   

You are free to fork this repository, make pull requests and make new character sheets - of cause, those will be added to web site.

Contents of the project:

* /barrating - Jquery bar rating, modified for printing.
* /css
  * /dots.css - css for displaying dots. Suddenly, yeah?
  * charlist.css - global css.
  * list1.css,list2.css, etc - css, grouped by the number of the list.
  * print.css - special styles for printing - hide elements, make font smaller, etc.
* fonts, img - self descriped folders.
* get - folder for ajax files which contain data for this sheet - for example, list of traits, attributes or skills.
* js - different javascript.
  * images.js - used for handling images - uploading, removing.
* x-editable - X-editable library without any modifications.

Of cause, for saving and loading your character sheet data you will need to publish your repositiry on http://charsheet.su
and use it's api - but you will be able to develop anything without it.

Getting started:

1. Clone \ Fork a project
2. Put it on your web server
3. Make sure that your your web server returns .json files with mime type "application/json"
4. Open index.html
5. All is fine? Begin editing!

FAQ:    

Q: Why do you use images instead of backgrounds?   
A: Because otherwise browsers don't allow to print background.   

Q: Why do you use SVG for some blocks?   
A: Because this way browser does not change text color when printing.