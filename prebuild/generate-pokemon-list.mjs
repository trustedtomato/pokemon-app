/* eslint-disable no-console */
import { join } from 'path'
import { writeFile, access } from 'fs/promises'
import { createWriteStream } from 'fs'
import mkdirp from 'mkdirp'
import axios from 'axios'
import streamToPromise from 'stream-to-promise'
import pLimit from 'p-limit'

const targetFileDir = join('static', 'generated')
const targetFileName = 'pokemons.json'
const imageDir = join(targetFileDir, 'pokemon-images')

await mkdirp(targetFileDir)
await mkdirp(imageDir)

console.log('Generating pokemon list...')

const res = await axios.post('https://beta.pokeapi.co/graphql/v1beta', {
  operationName: 'search',
  query: `
    query search {
      pokemon_v2_pokemon(order_by: {name: asc}) {
        height
        name
        weight
        pokemon_v2_pokemonabilities {
          pokemon_v2_ability {
            name
          }
        }
        id
      }
    }
  `
})

const pokemonJobs = res.data.data.pokemon_v2_pokemon.map(({
  height,
  name,
  weight,
  // eslint-disable-next-line camelcase
  pokemon_v2_pokemonabilities,
  id
}) => async () => {
  const imageTargetPath = join(imageDir, `${id}.png`)

  let hasImage = false
  if (await access(imageTargetPath).then(() => true).catch(() => false)) {
    console.log(`Already created image for ${id}.`)
    hasImage = true
  } else {
    console.log(`Streaming the image of ${name} (id: ${id})`)
    const imageStream = await axios.get(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`, {
      responseType: 'stream'
    }).catch(() => null)
    if (imageStream) {
      const writer = createWriteStream(join(imageDir, `${id}.png`))
      imageStream.data.pipe(writer)
      await streamToPromise(writer)
        .then(() => {
          hasImage = true
        })
        .catch((err) => {
          hasImage = false
          console.error('Failed to stream image! Error:', err)
        })
    } else {
      console.error(`Cannot access image for ${id}.`)
    }
  }

  return {
    height,
    name: (name.slice(0, 1).toUpperCase() + name.slice(1)).replace(/-/g, ' '),
    weight,
    abilities: pokemon_v2_pokemonabilities.map(({ pokemon_v2_ability: { name } }) => name),
    id,
    hasImage
  }
})

const limitJob = pLimit(10)
const pokemons = await Promise.all(pokemonJobs.map(limitJob))

await writeFile(join(targetFileDir, targetFileName), JSON.stringify(pokemons))
