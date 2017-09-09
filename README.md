# Ejs Layouts
This component allows you to use layouts with your ejs files.

## Options
You can pass options to the render function.

Name          | Description                        | Default
--------------|------------------------------------|--------
disableMinify | Do not minify the HTML once merged | false

## Example
**File:** layouts/default.ejs
```ejs
<html>

  <head>
    <%- locals.head ? head : '' %>
  </head>

  <body>
    <div class="container">
      <header>
        <p>This is the default layout. You passed <%= exampleVariable %>.</p>
      </header>
      <%- body %>
      <%- leftovers %>
    </div>
  </body>

  <%- locals.scripts ? scripts : '' %>
</html>
```

**File:** views/home.ejs
```ejs
<vars template="default" exampleVariable="Some example variable" />

<insert into="head">
  <title>Home Page</title>
</insert>

<insert into="body">
  <p>This is a test message</p>
</insert>

<insert into="scripts">
  <script>
    console.log('Scripts can be injected here')
  </script>
</insert>

```

**File:** index.js
```js
const path = require('path')

const express = require('express')
const ejsLayouts = require('ec-ejs-layouts')

const app = express()

app.engine('ejs', ejsLayouts(path.join(__dirname, 'layouts')))

app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('pages/home')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
```
