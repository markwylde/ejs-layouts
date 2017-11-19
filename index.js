const fs = require('fs')
const path = require('path')

const minify = require('html-minifier').minify
const ejs = require('ejs')

module.exports = function (rootDir) { 
  return function (filePath, options, callback) {
    function parse (data) {
      data = ejs.render(data.toString(), options)
      let vars = {}

      const varsRx = new RegExp(`<vars ([\\s\\S]*?)(><\\/vars>|\\/>)`, 'g')
      data = data.replace(varsRx, function (all, items) {
        items.replace(/(.*?)="(.*?)("|$|\n)/g, function (all, key, val) {
          if (val.substr(-1) === '"') {
            vars[key.trim()] = val.trim().slice(1, -1)
          } else {
            vars[key.trim()] = val.trim()
          }
        })
        return ''
      })

      let injects = {
        leftovers: [data]
      }

      const insertRx = new RegExp(`<insert into="(.*?)">([\\s\\S]*?)</insert>`, 'g')
      data.replace(insertRx, function (all, where, content) {
        if (!injects[where]) injects[where] = []
        injects[where].push(content)
        injects.leftovers[0] = injects.leftovers[0].replace(all, '')
      })

      for (let key in injects) {
        injects[key] = injects[key].join('\n')
      }

      options = Object.assign(options, vars, injects)

      fs.readFile(path.join(rootDir, (options.template || 'default') + '.ejs'), function (err, data) {
        if (err) console.log(err)
        let finalHtml = ejs.render(data.toString(), options)
        if (!options.disableMinify) {
          finalHtml = minify(finalHtml, {
            html5: true,
            collapseInlineTagWhitespace: true,
            collapseWhitespace: true,
            conservativeCollapse: true,
            ignoreCustomComments: true,
            minifyCSS: true,
            minifyJS: true,
            quoteCharacter: '"',
            removeComments: true,
            removeEmptyAttributes: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            useShortDoctype: true
          })
        }
        callback(null, finalHtml)
      })
    }

    if (filePath === 'data') {
      parse(options.data)
    } else {
      fs.readFile(filePath, function (err, data) {
        if (err) throw err
        parse(data)
      })
    }
  }
}
