const path = require('path')
const fs = require('fs')
const vm = require('vm')


function Module(id) {
  this.id = id
  this.exports = {}
}

Module._load = function (path) {
  let filename = Module._resolveFilename(path)

  // if cache, return cachedModules[filename].exports
  if (Module._cache[filename]) {
    return Module._cache[filename].exports
  }

  // if NativeModule, return nativeModule.require

  let module = new Module(filename)
  // cache module  ---> cachedModules[filename] = module
  Module._cache[filename] = module
  tryLoadModule(module)

  return module.exports
}

Module._resolveFilename = function (filename) {
  // 简化处理，需要写文件后缀
  return path.resolve(filename)
}

Module._cache = {}

Module._extensions = {
  '.js': function (module, filename) {
    let content = fs.readFileSync(filename, 'utf8')
    module._compile(content, filename)
  },
  '.json': function (module, filename) {
    let content = fs.readFileSync(filename, 'utf8')
    module.exports = JSON.parse(content)
  },
  // '.node'
}

Module.prototype._compile = function (content, filename) {
  let wrapper = Module._wrap(content)
  let fn = vm.runInThisContext(wrapper)
  let dirname = '' // 省略
  // let filename = '' // 审理而过
  fn.call(this.exports, this.exports, req, this, dirname, filename)
}

Module._wrap = function (content) {
  return Module.wrapper[0] + content + Module.wrapper[1]
}
Module.wrapper = [
  '(function(exports, require, module, __dirname, __filename){',
  '})'
]

function tryLoadModule(module) {
  let filename = module.id
  let extension = path.extname(filename)
  Module._extensions[extension](module, filename)
}


function req(path) {
  return Module._load(path)
}

module.exports = req