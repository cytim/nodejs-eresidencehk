const axios = require('axios')
const cheerio = require('cheerio')
const csv = require('csv')
const fs = require('fs')
const https = require('https')
const path = require('path')
const Promise = require('bluebird')
const qs = require('querystring')

const transformer = csv.transform((x) => x)
const file = fs.createWriteStream(path.join(__dirname, 'data', 'applications.csv'), { flags: 'a' })

const eresidencehk = axios.create({
  baseURL: 'https://www.eresidence.hk/en/',
  httpsAgent: new https.Agent({ keepAlive: true }),
})

function handleSearchError(skip, limit, total) {
  return (e) => {
    if (e.response) {
      console.error(`[${e.response.status}] ${e.response.data}`)
    }
    console.error(`skip: ${skip} / limit: ${limit} / total: ${total}`)
    console.error(e.stack)
    console.error('Retrying in 5 seconds...')
    setTimeout(() => {
      search(skip, limit, total).catch(handleSearchError(skip, limit, total))
    }, 5000)
  }
}

async function search(skip, limit, total) {
  const ids = []
  for (let i = 0; i < limit && i < total; i++) {
    ids.push(`U${skip + i}`)
  }
  console.error(`Processing application ${ids[0]} to ${ids[ids.length - 1]}...`)

  const results = await Promise.map(ids, async (id) => {
    const q = qs.stringify({ search: id })
    const { data } = await eresidencehk.post('/search_result.php', q)
    return data
  })

  results.forEach((data) => {
    const $ = cheerio.load(data)
    if ($('.nofind').length) {
      return
    }
    const rows = $('.result-wrapper__table table tr')
    const result = [
      rows.eq(0).find('td').eq(1).text(),
      rows.eq(1).find('td').eq(1).text(),
      rows.eq(2).find('td').eq(1).text().match(/Category ([0-9])/)[1],
    ]
    transformer.write(result)
  })

  skip += limit
  if (skip < total) {
    search(skip, limit, total).catch(handleSearchError(skip, limit, total))
  }
}

transformer
  .pipe(csv.stringify({
    header: true,
    columns: [ 'id', 'priority', 'category', ],
  }))
  .pipe(file)

const start = 100000
const end = 303000
const parallel = 100
search(start, parallel, end).catch(start, parallel, end)
