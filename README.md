# Ejs Layouts
This component allows you to use layouts with your ejs files.

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

**File:** home.ejs
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
const express = require('express')
const ejsLayouts = require('ec-ejs-layouts')

const app = express()

app.engine('ejs', ejsTemplates({
  default: path.join(__dirname, 'layouts/default.ejs'),
  admin: path.join(__dirname, 'layouts/admin.ejs'),
  blank: path.join(__dirname, 'layouts/blank.ejs')
}))

app.get('/', async function (req, res) {
  res.render('home')
})

app.listen(8000, function () {
  console.log('Public app listening on port 8000!')
})
```
