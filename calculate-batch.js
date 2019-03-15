const parse = require('csv-parse/lib/sync')
const fs = require('fs')
const path = require('path')
const prompt = require('prompt')

const file = fs.readFileSync(path.join(__dirname, 'data', 'applications.csv'))

const applications = parse(file, { columns: true })
applications.forEach((app) => {
  app.priority = parseInt(app.priority)
})

prompt.start()

prompt.get([
  {
    name: 'id',
    description: 'Application No.',
    required: true,
  }
], (err, { id }) => {
  if (err) {
    console.error(err.stack)
    return
  }

  id = id.toUpperCase()
  const target = applications.find((app) => app.id === id)

  if (!target) {
    console.log('The application no. does not exist.')
    return
  }

  const pos = applications
    .filter((app) => app.category === target.category && app.priority <= target.priority)
    .length

  let batch
  if (target.category === '1') {
    batch = Math.ceil(pos / 6)
  } else {
    batch = Math.ceil(pos / 4)
  }

  console.log(`
    Note: Each batch consists of 10 applications [6 cat1 (family) + 4 cat2 (one-person)].

    Application no.: ${target.id}
    Priority: ${target.priority}
    Category: ${target.category}

    Position in the category: ${pos}
    Batch: ${batch}
  `)
})
