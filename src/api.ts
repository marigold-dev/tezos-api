import { GithubObject, TezosDocumentation, TezosAPIStorage } from './models'
import { capitalizeFirstLetter } from './helper'

export const fetchGithubObjects = async () => {
  try {
    const cache = localStorage.getItem('tezos_api_storage')

    if (cache) {
      const storage = JSON.parse(cache) as TezosAPIStorage
      if (Date.now() > storage.timestamp + 1000 * 60 * 60 * 24) {
        return storage.tezosNodes
      }
    }

    const apiUrl =
      'https://api.github.com/repos/tezos/tezos-mirror/contents/docs/api'
    const githubResponse = await fetch(apiUrl)
    const githubObjects = (await githubResponse.json()) as GithubObject[]
    const tezosNodes = githubObjects
      .filter((file) => file.name.includes('openapi.json'))
      .map((file) => {
        const args = file.name.split('-')
        if (args[0] === 'rpc') {
          return {
            network: 'all',
            type: 'general',
            url: file.download_url,
          }
        } else if (args[1] === 'mempool') {
          return {
            network: args[0] + 'net',
            type: args[1],
            url: file.download_url,
          }
        } else {
          return {
            network: args[0] + 'net',
            type: 'blocks',
            url: file.download_url,
          }
        }
      })

    const storage: TezosAPIStorage = {
      tezosNodes,
      timestamp: Date.now(),
    }

    localStorage.setItem('tezos_api_storage', JSON.stringify(storage))
    return tezosNodes as TezosDocumentation[]
  } catch (e) {
    console.log(e)
    localStorage.removeItem('tezos_api_storage')
    return []
  }
}

export const fetchDocumentation = async (
  url: string,
  endpoint: string,
  network: string
) => {
  return fetch(url)
    .then((res) => res.json())
    .then((out) => {
      const tezosUrl = `${network}.tezos.marigold.dev/`
      const serverUrl = `//${tezosUrl}`
      const servers: { url: string }[] = []

      out.host = tezosUrl
      out.basePath = '/'
      out.info = {
        'x-logo': {
          url: 'https://uploads-ssl.webflow.com/616ab4741d375d1642c19027/61793ee65c891c190fcaa1d0_Vector(1).png',
          altText: 'Marigold logo',
        },
      }
      switch (endpoint) {
        case 'general':
          servers.push({ url: serverUrl })
          out.info.title = `General Tezos Node - ${capitalizeFirstLetter(
            network
          )}`
          out.info.description =
            'General Tezos node endpoints are related to the most variety of root endpoints on the Tezos Node.'
          break
        case 'blocks':
          servers.push({ url: serverUrl + 'chains/main/blocks/head' })
          out.info.title = `Block Tezos Node - ${capitalizeFirstLetter(
            network
          )}`
          out.info.description =
            'Block Tezos node endpoints are related to the block endpoints on the Tezos Node. ' +
            `We will use ${network}.tezos.marigold.dev/chains/main/blocks/head as root address because it returns the ` +
            'newest block, but you can use other addresses as root for to operate a specific block.'
          break
        case 'mempool':
          servers.push({ url: serverUrl + 'chains/main/mempool' })
          out.info.title = `Mempool Tezos Node - ${capitalizeFirstLetter(
            network
          )}`
          out.info.description =
            'Mempool Tezos node endpoints are related to the mempool endpoints on the Tezos Node. ' +
            `We will use ${network}.tezos.marigold.dev/chains/main/mempool as root address because it returns the mempool.`
          break
      }
      out.servers = servers
      return out
    })
}
