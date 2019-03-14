const parse = require('csv-parse/lib/sync')
const fs = require('fs')
const path = require('path')

const file = fs.readFileSync(path.join(__dirname, 'data', 'applications.csv'))

const applications = parse(file, { columns: true })

const total = applications.length
const cat1 = applications.filter((app) => app.category === '1').length
const cat2 = applications.filter((app) => app.category === '2').length

console.log(`
# Applications
Category 1 (family): ${cat1}
Category 2 (one-person): ${cat2}
Total: ${total}

# Ratio
For every 1 family application, there are ${cat2/cat1} one-person applications.
`)
