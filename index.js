const getPoemBtn = document.getElementById('get-poem')
const poemEl = document.getElementById('poem')
const poemURL = 'https://poetrydb.org/random,linecount/1;12/author,title,lines.json'

const getJSON = url => fetch(url).then(res => res.json())

const pipe = (...fns) => firstArg => fns.reduce((returnValue, fn) => fn(returnValue), firstArg)

const makeTag = tag => str => `<${tag}>${str}</${tag}>`

const makePoemHTML = (poemData) => {
  const poem = poemData[0]

  const makeH2 = makeTag('h2')
  const makeH3 = makeTag('h3')
  const makeEm = makeTag('em')
  const makeP = makeTag('p')

  const title = makeH2(poem.title)
  const author = pipe(
    str => 'by ' + str,
    makeEm,
    makeH3,
  )(poem.author)

  const stanzas = []
  let currentStanza = []

  poem.lines.forEach(line => {
    if (line === '') {
      if (currentStanza.length > 0) {
        stanzas.push(currentStanza)
        currentStanza= []
      }
    } else {
      currentStanza.push(line)
    }
  })

  if (currentStanza.length > 0) {
    stanzas.push(currentStanza)
  }

  const stanzaHTML = stanzas
    .map(lines => makeP(
      lines.map((line, i) => {
        const isLastLine = i === lines.length - 1
        return isLastLine ? line : `${line}<br>`
      }).join('')
    ))
    .join('')

  return title + author + stanzaHTML

}

getPoemBtn.onclick = async function() {
  poemEl.innerHTML = makePoemHTML(await getJSON(poemURL))
}
