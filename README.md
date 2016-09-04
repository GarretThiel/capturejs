CaptureJS
=========

[![Npm version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][gemnasium-image]][gemnasium-url]

CaptureJS is full webpage capture command-line tool with PhantomJS.


Installation
------------

First [install PhantomJS](http://phantomjs.org/download.html).

    $ npm install -g capturejs

Usage
-----

```
Usage: capturejs [options]

Options:
  -u, --uri <value>                URI (required)
  -o, --output <value>             Output image file (required)
  -p, --ssl-protocol <value>       Sets the SSL protocol for secure connections (default is SSLv3) (sslv3|sslv2|tlsv1|any)
  -I, --ignore-ssl-errors          Ignores SSL errors (expired/self-signed certificate errors)
  -W, --web-security               Enables web security and forbids cross-domain XHR (default is true) (true|false|yes|no)
  -s, --selector <value>           CSS selector
  -A, --user-agent <value>         UserAgent
  -J, --javascript-file <value>    Inject external script code from the specified file into the page
  -j, --inject-script              Inject in-line custom scripts into the page
  -V, --viewportsize <value>       ViewPortSize {width}x{height}
  -C, --cliprect <value>           ClipRect {top}x{left}x{width}x{height} that will be rendered
  -c, --cookies-file <value>       Cookies file
  -T, --timeout <value>            HTTP Timeout (ms)
  -R, --renderdelay <value>        Render delay (ms)
  -w, --waitcapturedelay <value>   Capture delay (ms)
  -z, --zoomfactor <value>         Zoom Factor (default is 1.0, i.e. 100% zoom)

  -v, --version                    Show version number and exit
  -h, --help                       Show this message and exit
```

Quick Start
-----------

    % capturejs --uri http://phantomjs.org/ \
                --selector '.header' \
                --viewportsize 1400x1400 \
                --output 'phantomjs.org.png'

![phantomjs org](screenshots/phantomjs_org.png)

    % capturejs --uri http://phantomjs.org/ \
                --selector '.header' \
                --viewportsize 1400x1400 \
                --javascript-file ./hidelogo.js \
                --output 'phantomjs.org_hide_logo.png'

```javascript
// hidelogo.js
document.querySelector('.header img').style.visibility = 'hidden';
```

![phantomjs org_hide_logo](screenshots/phantomjs_org_hide_logo.png)

    % capturejs --uri http://phantomjs.org/ \
                --selector '.header' \
                --viewportsize 1400x1400 \
                --javascript-file ./hidelogo.js \
                --inject-script 'document.querySelector(".header").style.background = 'red';' \
                --output 'phantomjs_org_red.png'

![phantomjs org_red](screenshots/phantomjs_org_red.png)

Copyright
---------

Copyright (c) 2012 Kazuki Suda. See LICENSE.txt for further details.

[travis-image]: https://img.shields.io/travis/superbrothers/capturejs.svg?style=flat-square
[travis-url]: https://travis-ci.org/superbrothers/capturejs
[npm-image]: https://img.shields.io/npm/v/capturejs.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/capturejs
[gemnasium-image]: http://img.shields.io/gemnasium/superbrothers/capturejs.svg?style=flat-square
[gemnasium-url]: https://gemnasium.com/superbrothers/capturejs
