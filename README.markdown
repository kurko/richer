Richer is a dead simple RichText editor. It's focused on being lightweight. It's only 7Kb uncompressed.

It works Safari, Chrome, Firefox and Internet Explorer. Yep, IE 6 too.

Why we created this
-------------------

We have this Rails application that we need to provide a richtext editor. However, we need only the basic
options (bold, italic etc). We don't want TinyMCE, as it alone has almost more files than the entire app.

How to start
============

Add the following code in your page's head tag. It'll convert your textareas to editor:

    // first, jQuery
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js"></script>

    // then CSS, then richer.js
    <link rel="stylesheet" href="path/to/css/richer.css" />
    <script src="path/to/richer/folder/richer.js"></script>

Take a look at the index.html in the example/ directory. Don't forget the buttons' images. If you wish,
change styles in richer.css.

Other languages
===============

As of now, we have already translated Richer to Brazilian Portuguese (pt_br). To use it,
add the following line before loading richer.js:

    <script src="path/to/richer/folder/translations/pt_br.js"></script>
    
If you want another language, just create a new Javascript file and use the english
version as a template. It's a plain JSON, so you shouldn't have problems.

Collaborate
===========

At this moment, Richer requires jQuery (tested on 1.5.1). If you want to collaborate,
this is a draft list of features and functionalities we'd like to see in Richer (higher priority first):

* get rid of jQuery dependencies
* indentations and alignment options
* translation to other languages
* font sizing
* a better interface to configurate richer

People Involved
===============

Alexandre de Oliveira (author)
