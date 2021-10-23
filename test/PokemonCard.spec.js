import { mount } from '@vue/test-utils'
import PokemonCard from '@/components/PokemonCard.vue'

describe('PokemonCard', () => {
  test('calculates imageUrl well if there is an image', () => {
    const wrapper = mount(PokemonCard, {
      propsData: {
        pokemon: {
          id: 1,
          name: 'Pikachu',
          weight: 2,
          height: 4,
          hasImage: true,
          abilities: []
        }
      }
    })
    expect(wrapper.vm.imageUrl).toBe('/generated/pokemon-images/1.png')
  })
  test('calculates imageUrl well if there is no image', () => {
    const wrapper = mount(PokemonCard, {
      propsData: {
        pokemon: {
          id: 1,
          name: 'Pikachu',
          weight: 2,
          height: 4,
          hasImage: false,
          abilities: []
        }
      }
    })
    expect(wrapper.vm.imageUrl).toBe('/question-mark.svg')
  })
})
