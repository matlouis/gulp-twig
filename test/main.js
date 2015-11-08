var fs = require('fs');
var path = require('path');
var should = require('should');
var gutil = require('gulp-util');
var twig = require('../');

require('mocha');

describe('gulp-twig', function () {

    it('should compile twig templates to html files', function (done) {
        var twg = twig({
            data: {
                title: 'twig'
            }
        });

        var fakeFile = new gutil.File({
            base: 'test/',
            cwd: 'test/',
            path: path.join(__dirname, '/templates/file.twig'),
            contents: fs.readFileSync(__dirname + '/templates/file.twig')
        });

        twg.on('data', function (newFile) {
            should.exist(newFile);
            should.exist(newFile.contents);
            should.exist(newFile.path);
            String(newFile.contents).should.equal(fs.readFileSync(__dirname + '/expected/file.html', 'utf8'));
            done();
        });
        twg.write(fakeFile);
    });

    it('should compile twig templates to html files without options', function (done) {
        var twg = twig();

        var fakeFile = new gutil.File({
            base: 'test/',
            cwd: 'test/',
            path: path.join(__dirname, '/templates/file.twig'),
            contents: fs.readFileSync(__dirname + '/templates/file.twig')
        });

        twg.on('data', function (newFile) {
            should.exist(newFile);
            should.exist(newFile.contents);
            should.exist(newFile.path);
            String(newFile.contents).should.equal(fs.readFileSync(__dirname + '/expected/file-noopts.html', 'utf8'));
            done();
        });
        twg.write(fakeFile);
    });

    it('should return \'null\' file when no file put in', function (done) {
        var twg = twig();

        var fakeFile = new gutil.File({
            base: 'test/',
            cwd: 'test/'
        });

        twg.on('data', function (newFile) {
            should.exist(newFile);
            should.not.exist(newFile.contents);
            should.not.exist(newFile.path);
            String(newFile.contents).should.equal('null');
            done();
        });
        twg.write(fakeFile);
    });

    it('should accept data from file.data', function (done) {
        var twg = twig();

        var fakeFile = new gutil.File({
            base: 'test/',
            cwd: 'test/',
            path: path.join(__dirname, '/templates/file.twig'),
            contents: fs.readFileSync(__dirname + '/templates/file.twig'),
        });

        // simulate data attribute being added by gulp-data plugin
        fakeFile['data'] = {
            title: 'twig'
        };

        twg.on('data', function (newFile) {
            should.exist(newFile);
            should.exist(newFile.contents);
            should.exist(newFile.path);
            String(newFile.contents).should.equal(fs.readFileSync(__dirname + '/expected/file.html', 'utf8'));
            done();
        });
        twg.write(fakeFile);
    });

    it('should emit an error when the template includes a non-existent file', function (done) {
        var twg = twig({
            // Disable twig.js error logs to not pollute the test output.
            extend: function(Twig) {
                Twig.log.error = function() {};
            }
        });

        var fakeFile = new gutil.File({
            base: 'test/',
            cwd: 'test/',
            path: path.join(__dirname, '/templates/invalid-include.twig'),
            contents: fs.readFileSync(__dirname + '/templates/invalid-include.twig')
        });

        twg.on('error', function(error) {
            should.exist(error);
            should.exist(error.message);
            String(error.message).should.startWith('ENOENT, no such file or directory');
            done();
        });

        twg.write(fakeFile);
    });
});
