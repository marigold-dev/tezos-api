import { GithubObject, TezosDocumentation, TezosAPIStorage } from './models'
import { capitalizeFirstLetter } from './helper'

function typeByArgs(args: string[]) {
  if (args[0] === 'rpc') {
    return 'base'
  } else if (args[1] === 'mempool') {
    return 'mempool'
  } else if (args[1] === 'smart' && args[2] === 'rollup') {
    return 'smart-rollup'
  }

  return 'blocks'
}

function buildTezosDoc(args: string[], url: string): TezosDocumentation {
  const isRc = args[args.length - 1] === 'rc.json'
  const network = args[0] === 'rpc' ? 'all' : args[0] + 'net'
  let type = typeByArgs(args)

  return {
    network: network,
    type: type,
    url: url,
    rc: isRc,
  }
}

export const fetchGithubObjects = async () => {
  const apiUrl =
    'https://api.github.com/repos/tezos/tezos-mirror/contents/docs/api'
  const githubResponse = await fetch(apiUrl)
  const githubObjects = (await githubResponse.json()) as GithubObject[]
  const tezosNodes = githubObjects
    .filter(
      (file) =>
        file.name.includes('openapi.json') ||
        file.name.includes('openapi-rc.json')
    )
    .map((file) => {
      const args = file.name.split('-')
      const doc = buildTezosDoc(args, file.download_url)
      return doc
    })

  const storage: TezosAPIStorage = {
    tezosNodes,
    timestamp: Date.now(),
  }

  localStorage.setItem('tezos_api_storage', JSON.stringify(storage))
  return tezosNodes as TezosDocumentation[]
}

export const fetchDocumentation = (
  url: string,
  type: string,
  protocol: string,
  rc: boolean,
  networks: string[]
) => {
  return () =>
    fetch(url)
      .then((res) => res.json())
      .then((out) => {
        const allNetworks = networks.map((network) => {
          const tezosUrl = `${network.toLowerCase()}.tezos.marigold.dev/`
          const serverUrl = `//${tezosUrl}`
          return { tezosUrl, serverUrl, network }
        })
        const servers: { url: string }[] = []
        out.basePath = '/'
        out.info = {
          'x-logo': {
            url: 'https://uploads-ssl.webflow.com/616ab4741d375d1642c19027/61793ee65c891c190fcaa1d0_Vector(1).png',
            altText: 'Marigold logo',
          },
        }

        switch (type) {
          case 'base':
            allNetworks.forEach(({ serverUrl }) => {
              servers.push({ url: serverUrl })
            })
            out.info.title = `Base Tezos Node Endpoints - ${capitalizeFirstLetter(
              protocol
            )} Protocol${protocol === 'all' ? 's' : ''} ${
              rc ? '-- Release Candidate' : ''
            }`
            out.info.description =
              'Base Tezos node endpoints are related to the most variety of root endpoints on the Tezos Node.'
            break
          case 'blocks':
            allNetworks.forEach(({ serverUrl }) => {
              servers.push({ url: serverUrl + 'chains/main/blocks/head' })
            })

            out.info.title = `Blocks Tezos Node Endpoints - ${capitalizeFirstLetter(
              protocol
            )} Protocol ${rc ? '-- Release Candidate' : ''}`

            out.info.description =
              'Block Tezos node endpoints are related to the block endpoints on the Tezos Node. ' +
              +'We will use ${network}.tezos.marigold.dev/chains/main/blocks/head as root address because it returns the' +
              'newest block, but you can use other addresses as root for to operate a specific block.'
            break
          case 'mempool':
            allNetworks.forEach(({ serverUrl }) => {
              servers.push({ url: serverUrl + 'chains/main/mempool' })
            })
            out.info.title = `Mempool Tezos Node - ${capitalizeFirstLetter(
              protocol
            )} Protocol ${rc ? '-- Release Candidate' : ''}`

            out.info.description =
              'Mempool Tezos node endpoints are related to the mempool endpoints on the Tezos Node. ' +
              'We will use ${network}.tezos.marigold.dev/chains/main/mempool as root address because it returns the mempool.'
            break
          case 'smart-rollup':
            const smartRollupUrl = 'https://YOUR_SMART_ROLLUP_NODE_URL/'
            out.host = smartRollupUrl
            servers.push({ url: smartRollupUrl })
            out.info.title = `Smart Rollup Tezos Node - ${capitalizeFirstLetter(
              protocol
            )} ${rc ? '-- Release Candidate' : ''}`
            out.info.description =
              'Smart Rollup Tezos node endpoints are related to the Smart Rollup endpoints. '
            break
        }
        out.servers = servers
        return out
      })
}
