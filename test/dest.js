var vfs = require('../');

var path = require('path');
var fs = require('graceful-fs');
var rimraf = require('rimraf');

var bufEqual = require('buffer-equal');
var through = require('through2');
var File = require('vinyl');

var should = require('should');
require('mocha');

var wipeOut = function(cb) {
  rimraf(path.join(__dirname, "./out-fixtures/"), cb);
};

var dataWrap = function(fn) {
  return function(data, enc, cb) {
    fn(data);
    cb();
  };
};

describe('dest stream', function() {
  beforeEach(wipeOut);
  afterEach(wipeOut);

  it('should pass through writes with cwd', function(done) {
    var inputPath = path.join(__dirname, "./fixtures/test.coffee");

    var expectedFile = new File({
      base: __dirname,
      cwd: __dirname,
      path: inputPath,
      contents: null
    });

    var onEnd = function(){
      buffered.length.should.equal(1);
      buffered[0].should.equal(expectedFile);
      done();
    };

    var stream = vfs.dest("./out-fixtures/", {cwd: __dirname});

    var buffered = [];
    bufferStream = through.obj(dataWrap(buffered.push.bind(buffered)), onEnd);
    stream.pipe(bufferStream);
    stream.write(expectedFile);
    stream.end();
  });

  it('should pass through writes with default cwd', function(done) {
    var inputPath = path.join(__dirname, "./fixtures/test.coffee");

    var expectedFile = new File({
      base: __dirname,
      cwd: __dirname,
      path: inputPath,
      contents: null
    });

    var onEnd = function(){
      buffered.length.should.equal(1);
      buffered[0].should.equal(expectedFile);
      done();
    };

    var stream = vfs.dest(path.join(__dirname, "./out-fixtures/"));

    var buffered = [];
    bufferStream = through.obj(dataWrap(buffered.push.bind(buffered)), onEnd);
    stream.pipe(bufferStream);
    stream.write(expectedFile);
    stream.end();
  });

  it('should not write null files', function(done) {
    var inputPath = path.join(__dirname, "./fixtures/test.coffee");
    var inputBase = path.join(__dirname, "./fixtures/");
    var expectedPath = path.join(__dirname, "./out-fixtures/test.coffee");
    var expectedCwd = __dirname;
    var expectedBase = path.join(__dirname, "./out-fixtures");

    var expectedFile = new File({
      base: inputBase,
      cwd: __dirname,
      path: inputPath,
      contents: null
    });

    var onEnd = function(){
      buffered.length.should.equal(1);
      buffered[0].should.equal(expectedFile);
      buffered[0].cwd.should.equal(expectedCwd, 'cwd should have changed');
      buffered[0].base.should.equal(expectedBase, 'base should have changed');
      buffered[0].path.should.equal(expectedPath, 'path should have changed');
      fs.existsSync(expectedPath).should.equal(false);
      done();
    };

    var stream = vfs.dest("./out-fixtures/", {cwd: __dirname});

    var buffered = [];
    bufferStream = through.obj(dataWrap(buffered.push.bind(buffered)), onEnd);
    stream.pipe(bufferStream);
    stream.write(expectedFile);
    stream.end();
  });

  it('should write buffer files to the right folder with relative cwd', function(done) {
    var inputPath = path.join(__dirname, "./fixtures/test.coffee");
    var inputBase = path.join(__dirname, "./fixtures/");
    var expectedPath = path.join(__dirname, "./out-fixtures/test.coffee");
    var expectedCwd = __dirname;
    var expectedBase = path.join(__dirname, "./out-fixtures");
    var expectedContents = fs.readFileSync(inputPath);

    var expectedFile = new File({
      base: inputBase,
      cwd: __dirname,
      path: inputPath,
      contents: expectedContents
    });

    var onEnd = function(){
      buffered.length.should.equal(1);
      buffered[0].should.equal(expectedFile);
      buffered[0].cwd.should.equal(expectedCwd, 'cwd should have changed');
      buffered[0].base.should.equal(expectedBase, 'base should have changed');
      buffered[0].path.should.equal(expectedPath, 'path should have changed');
      fs.existsSync(expectedPath).should.equal(true);
      bufEqual(fs.readFileSync(expectedPath), expectedContents).should.equal(true);
      done();
    };

    var stream = vfs.dest("./out-fixtures/", {cwd: path.relative(process.cwd(), __dirname)});

    var buffered = [];
    bufferStream = through.obj(dataWrap(buffered.push.bind(buffered)), onEnd);
    stream.pipe(bufferStream);
    stream.write(expectedFile);
    stream.end();
  });

  it('should write buffer files to the right folder', function(done) {
    var inputPath = path.join(__dirname, "./fixtures/test.coffee");
    var inputBase = path.join(__dirname, "./fixtures/");
    var expectedPath = path.join(__dirname, "./out-fixtures/test.coffee");
    var expectedContents = fs.readFileSync(inputPath);
    var expectedCwd = __dirname;
    var expectedBase = path.join(__dirname, "./out-fixtures");

    var expectedFile = new File({
      base: inputBase,
      cwd: __dirname,
      path: inputPath,
      contents: expectedContents
    });

    var onEnd = function(){
      buffered.length.should.equal(1);
      buffered[0].should.equal(expectedFile);
      buffered[0].cwd.should.equal(expectedCwd, 'cwd should have changed');
      buffered[0].base.should.equal(expectedBase, 'base should have changed');
      buffered[0].path.should.equal(expectedPath, 'path should have changed');
      fs.existsSync(expectedPath).should.equal(true);
      bufEqual(fs.readFileSync(expectedPath), expectedContents).should.equal(true);
      done();
    };

    var stream = vfs.dest("./out-fixtures/", {cwd: __dirname});

    var buffered = [];
    bufferStream = through.obj(dataWrap(buffered.push.bind(buffered)), onEnd);
    stream.pipe(bufferStream);
    stream.write(expectedFile);
    stream.end();
  });

  it('should write streaming files to the right folder', function(done) {
    var inputPath = path.join(__dirname, "./fixtures/test.coffee");
    var inputBase = path.join(__dirname, "./fixtures/");
    var expectedPath = path.join(__dirname, "./out-fixtures/test.coffee");
    var expectedContents = fs.readFileSync(inputPath);
    var expectedCwd = __dirname;
    var expectedBase = path.join(__dirname, "./out-fixtures");

    var contentStream = through.obj();
    var expectedFile = new File({
      base: inputBase,
      cwd: __dirname,
      path: inputPath,
      contents: contentStream
    });

    var onEnd = function(){
      buffered.length.should.equal(1);
      buffered[0].should.equal(expectedFile);
      buffered[0].cwd.should.equal(expectedCwd, 'cwd should have changed');
      buffered[0].base.should.equal(expectedBase, 'base should have changed');
      buffered[0].path.should.equal(expectedPath, 'path should have changed');
      fs.existsSync(expectedPath).should.equal(true);
      bufEqual(fs.readFileSync(expectedPath), expectedContents).should.equal(true);
      done();
    };

    var stream = vfs.dest("./out-fixtures/", {cwd: __dirname});

    var buffered = [];
    bufferStream = through.obj(dataWrap(buffered.push.bind(buffered)), onEnd);
    stream.pipe(bufferStream);
    stream.write(expectedFile);
    setTimeout(function(){
      contentStream.write(expectedContents);
      contentStream.end();
    }, 100);
    stream.end();
  });

  it('should write directories to the right folder', function(done) {
    var inputPath = path.join(__dirname, "./fixtures/test");
    var inputBase = path.join(__dirname, "./fixtures/");
    var expectedPath = path.join(__dirname, "./out-fixtures/test");
    var expectedCwd = __dirname;
    var expectedBase = path.join(__dirname, "./out-fixtures");

    var expectedFile = new File({
      base: inputBase,
      cwd: __dirname,
      path: inputPath,
      contents: null,
      stat: {
        isDirectory: function(){
          return true;
        }
      }
    });

    var onEnd = function(){
      buffered.length.should.equal(1);
      buffered[0].should.equal(expectedFile);
      buffered[0].cwd.should.equal(expectedCwd, 'cwd should have changed');
      buffered[0].base.should.equal(expectedBase, 'base should have changed');
      buffered[0].path.should.equal(expectedPath, 'path should have changed');
      fs.existsSync(expectedPath).should.equal(true);
      fs.lstatSync(expectedPath).isDirectory().should.equal(true);
      done();
    };

    var stream = vfs.dest("./out-fixtures/", {cwd: __dirname});

    var buffered = [];
    bufferStream = through.obj(dataWrap(buffered.push.bind(buffered)), onEnd);
    stream.pipe(bufferStream);
    stream.write(expectedFile);
    stream.end();
  });

});
