import { strict as assert } from 'node:assert'
import test from 'node:test'

import { createFetcher } from '.'

const fetcher = createFetcher()

test('fetcher instanciates', async (t) => {
  await t.test('createFetcher is a function', () => {
    assert.equal(typeof createFetcher, 'function')
  })

  await t.test('fetcher is an object', () => {
    assert.equal(typeof fetcher, 'object')
  })
})

test('fetch makes api calls', async (t) => {
  const genUrl = (...args: string[]) => ['https://api.punkapi.com/v2', ...args].join('/')

  await t.test('fetches specific beer', async () => {
    const { json } = await fetcher.fetchJson(genUrl('beers/256'))
    if (!Array.isArray(json)) throw new Error('Invalid response')

    assert.deepEqual(
      json[0],
      JSON.parse(
        '{"id":256,"name":"Small Batch: Vermont IPA","tagline":"Juicy, Tropical, Citrusy.","first_brewed":"2017","description":"A vermont style IPA, with low background bitterness, loaded with intense juicy fruit character.","image_url":"https://images.punkapi.com/v2/keg.png","abv":6.9,"ibu":35,"target_fg":1012,"target_og":1066,"ebc":15,"srm":7.62,"ph":4.2,"attenuation_level":79,"volume":{"value":20,"unit":"litres"},"boil_volume":{"value":25,"unit":"litres"},"method":{"mash_temp":[{"temp":{"value":65,"unit":"celsius"},"duration":75}],"fermentation":{"temp":{"value":19,"unit":"celsius"}},"twist":null},"ingredients":{"malt":[{"name":"Pale Ale","amount":{"value":3.3,"unit":"kilograms"}},{"name":"Maris Otter","amount":{"value":0.8,"unit":"kilograms"}},{"name":"Wheat","amount":{"value":0.5,"unit":"kilograms"}},{"name":"Flaked Oats","amount":{"value":0.2,"unit":"kilograms"}}],"hops":[{"name":"Chinook","amount":{"value":1,"unit":"grams"},"add":"Middle","attribute":"Aroma"},{"name":"Chinook","amount":{"value":20,"unit":"grams"},"add":"End","attribute":"Flavour"},{"name":"Amarillo","amount":{"value":30,"unit":"grams"},"add":"End","attribute":"Flavour"},{"name":"Simcoe","amount":{"value":30,"unit":"grams"},"add":"End","attribute":"Flavour"},{"name":"Citra","amount":{"value":50,"unit":"grams"},"add":"Dry Hop","attribute":"Aroma"},{"name":"Amarillo","amount":{"value":50,"unit":"grams"},"add":"Dry Hop","attribute":"Aroma"},{"name":"Mosaic","amount":{"value":50,"unit":"grams"},"add":"Dry Hop","attribute":"Aroma"},{"name":"Simcoe","amount":{"value":50,"unit":"grams"},"add":"Dry Hop","attribute":"Aroma"}],"yeast":"Wyeast 1056 - American Ale™"},"food_pairing":["Chicken Korma","Lobster Tail Salad","Chickpea and Apricot Tagine"],"brewers_tips":"Add the dry hops in separate muslin bags to increase surface area contact and reduce the amount of hop matter in the beer after dry hopping without reducing the characteristic hazy look of the beer.","contributed_by":"John Jenkman <johnjenkman>"}',
      ),
    )
  })

  await t.test('fetches a random beer', async () => {
    const response = await fetcher.fetch(genUrl('beers/random'))
    assert.equal(response.status, 200)
  })
})
