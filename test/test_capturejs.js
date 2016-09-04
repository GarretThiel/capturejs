"use strict";

var fs = require("fs"),
    http = require("http"),
    url = require("url"),
    path = require("path"),
    crypto = require("crypto"),
    async = require("async"),
    capturejs = require(path.join(__dirname, "..", "lib", "capturejs.js"));

var PORT = 9999,
    ROOT_URI = "http://" + require("os").hostname() + ":" + PORT,
    server, request;

function md5sum(filePath, callback) {
    var md5 = crypto.createHash("md5");
    fs.readFile(filePath, function (err, data) {
        if (err) {
            return callback(null, err);
        }
        callback(null, md5.update(data).digest("hex"));
    });
}

function actualPath(fileName) {
    return path.join(__dirname, "actual", fileName);
}

function expectedPath(fileName) {
    return path.join(__dirname, "expected", fileName);
}

module.exports = {
    "setUp": function (callback) {
        server = http.createServer(function (req, res) {
            request = req;
            var u = url.parse(req.url, true),
                delay = u.query.responsetime || 0;
            setTimeout(function () {
                fs.readFile(path.join(__dirname, "test.html"), "utf8", function (err, data) {
                    if (err) {
                        throw err;
                    }
                    res.writeHead("200", {
                        "Content-Type": "text/html",
                        "Set-Cookie": "cookie=test"
                    });
                    res.write(data);
                    res.end();
                });
            }, delay);
        }).listen(PORT, callback);
    },
    "tearDown": function (callback) {
        server.close(callback);
    },
    "basic": function (test) {
        // PhantomJS does not support GIF format without a special codec.
        // See http://stackoverflow.com/questions/38048746/how-to-use-phantomjs-create-gif.
        var expected = expectedPath("basic.png"),
            actual = actualPath(Date.now() + ".png");
        capturejs.capture({
            "uri": ROOT_URI,
            "output": actual,
            "web-security": "no" // Enable cross-domain XHR for unit tests to run locally.
        }, function () {
            setTimeout(function () {
                async.map([expected, actual], md5sum, function (err, results) {
                    test.ok(!err);
                    test.equal(results[0], results[1], expected + " eq " + actual);
                    test.done();
                });
            }, 200);
        });
    },
    "selector": function (test) {
        var expected = expectedPath("selector.png"),
            actual = actualPath(Date.now() + ".png");
        capturejs.capture({
            "uri": ROOT_URI,
            "output": actual,
            "web-security": "no",
            "selector": "#test"
        }, function () {
            setTimeout(function () {
                async.map([expected, actual], md5sum, function (err, results) {
                    test.ok(!err);
                    test.equal(results[0], results[1], expected + " eq " + actual);
                    test.done();
                });
            }, 200);
        });
    },
    "external script": function (test) {
        var expected = expectedPath("external_script.png"),
            actual = actualPath(Date.now() + ".png");
        capturejs.capture({
            "uri": ROOT_URI,
            "output": actual,
            "web-security": "no",
            "javascript-file": path.join(__dirname, "external_script")
        }, function () {
            setTimeout(function () {
                async.map([expected, actual], md5sum, function (err, results) {
                    test.ok(!err);
                    test.equal(results[0], results[1], expected + " eq " + actual);
                    test.done();
                });
            }, 200);
        });
    },
    "user-agent": function (test) {
        var useragent = "This is the user-agent test.";
        capturejs.capture({
            "uri": ROOT_URI,
            "output": actualPath(Date.now() + ".png"),
            "web-security": "no",
            "user-agent": useragent
        }, function () {
            test.equal(useragent, request.headers["user-agent"]);
            test.done();
        });
    },
    "cookies-file": function (test) {
        var cookiesFile = path.join(__dirname, "cookies-file.txt");
        fs.unlink(cookiesFile, function (err) {
            capturejs.capture({
                "uri": ROOT_URI,
                "output": actualPath(Date.now() + ".png"),
                "web-security": "no",
                "cookies-file": cookiesFile
            }, function () {
                // fs.exists is undefined on node v0.4, v0.6
                fs.stat(cookiesFile, function (err, stats) {
                    test.ok(!err);
                    test.done();
                });
            });
        });
    },
    "timeout": function (test) {
        capturejs.capture({
            "uri": ROOT_URI + "/?responsetime=2000",
            "output": actualPath(Date.now() + ".png"),
            "web-security": "no",
            "timeout": 500
        }, function (err) {
            test.ok(!!err);
            test.done();
        });
    },
    "viewportsize": function (test) {
        var expected = expectedPath("viewportsize.png"),
            actual = actualPath(Date.now() + ".png");
        capturejs.capture({
            "uri": ROOT_URI,
            "output": actual,
            "web-security": "no",
            "viewportsize": "20x20"
        }, function () {
            setTimeout(function () {
                async.map([expected, actual], md5sum, function (err, results) {
                    test.equal(results[0], results[1], expected + " eq " + actual);
                    test.done();
                });
            }, 200);
        });
    }
};

// vim: set fenc=utf-8 ts=4 sts=4 sw=4 :
