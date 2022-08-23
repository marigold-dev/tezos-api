import { GithubObject, TezosDocumentation } from './models'
import { capitalizeFirstLetter } from './helper'

export const fetchGithubObjects = async () => {
  const cache = localStorage.getItem('tezosOpenAPI')

  if (cache) {
    return JSON.parse(cache) as TezosDocumentation[]
  }

  const apiUrl =
    'https://api.github.com/repos/tezos/tezos-mirror/contents/docs/api'
  const githubResponse = await fetch(apiUrl)
  const githubObjects = (await githubResponse.json()) as GithubObject[]
  const apiList = githubObjects
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

  localStorage.setItem('tezosOpenAPI', JSON.stringify(apiList))
  return apiList as TezosDocumentation[]
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
