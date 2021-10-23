# Pokemon app
Search for your favorite Pokemon!

## Live demo
See demo here: [trustedtomato.github.io/pokemon-app/](https://trustedtomato.github.io/pokemon-app/)

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt's documentation](https://nuxtjs.org).

## TODO
- [ ] limit number of characters in search when using fuzzy-search because its performance cost increases when the number of characters increase 
- [ ] add unit tests for everything (reach 100% coverage)
- [ ] display even more things on the Pokemon modal
- [ ] add fade-in and fade-out transition to modal dialog
- [ ] do search work in a Worker