/* eslint-disable camelcase */
/* eslint-disable no-console */

/*
Purpose of this prebuild script:
  - generate a full list of pokemons with their basic data to "targetFileName"
  - generate Pokemon profile image files to "imageDir"
  - generate non-basic Pokemon data files (one per Pokemon) to "extraDir"
*/

import { join } from 'path'
import { writeFile, access } from 'fs/promises'
import { createWriteStream } from 'fs'
import mkdirp from 'mkdirp'
import axios from 'axios'
import streamToPromise from 'stream-to-promise'
import pLimit from 'p-limit'
import { pick } from './utils/pick.mjs'

const targetFileDir = join('static', 'generated')
const targetFileName = 'pokemons.json'
const imageDir = join(targetFileDir, 'pokemon-images')
const extraDir = join(targetFileDir, 'pokemon-extra')

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
        base_experience
        pokemon_v2_pokemontypes {
          pokemon_v2_type {
            name
          }
        }
        pokemon_v2_pokemonstats {
          base_stat
          pokemon_v2_stat {
            name
          }
        }
      }
    }
  `
})

const pokemonJobs = res.data.data.pokemon_v2_pokemon.map(({
  height,
  name,
  weight,
  pokemon_v2_pokemonabilities,
  id,
  base_experience,
  pokemon_v2_pokemontypes,
  pokemon_v2_pokemonstats
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

  const formatedName = (name.slice(0, 1).toUpperCase() + name.slice(1)).replace(/-/g, ' ')
  const abilities = pokemon_v2_pokemonabilities.map(({ pokemon_v2_ability: { name } }) => name)
  const types = pokemon_v2_pokemontypes.map(({ pokemon_v2_type: { name } }) => name)

  const stats = {}
  for (const { base_stat, pokemon_v2_stat: { name } } of pokemon_v2_pokemonstats) {
    stats[name] = base_stat
  }

  return {
    height,
    name: formatedName,
    weight,
    abilities,
    id,
    hasImage,
    baseExperience: base_experience,
    types,
    stats
  }
})

const limitJob = pLimit(10)
const pokemons = await Promise.all(pokemonJobs.map(limitJob))

// Make a file for the list of basic Pokemon data.
await writeFile(
  join(targetFileDir, targetFileName),
  JSON.stringify(
    pokemons.map(pokemon => pick(pokemon, ['name', 'height', 'weight', 'abilities', 'id', 'hasImage']))
  )
)

// Make separate files for extra Pokemon data.
for (const pokemon of pokemons) {
  await writeFile(
    join(extraDir, `${pokemon.id}.json`),
    JSON.stringify(
      pick(pokemon, ['baseExperience', 'types', 'stats'])
    )
  )
}
