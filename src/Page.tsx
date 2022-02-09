import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { RedocStandalone } from 'redoc'
import HeaderBar from './components/HeaderBar'

const networks = ['mainnet', 'hangzhounet'] as const
const endpoints = ['general', 'block', 'mempool'] as const
type Networks = typeof networks[number];
type Endpoints = typeof endpoints[number];

// function AnotherResult (obj: any) {
//   const object = JSON.stringify(obj)
//   return (
//     <div>
//       { object }
//     </div>
//   )
// }

export function Page () {
  const generalUrl = 'https://cdn.statically.io/gl/tezos/tezos/master/docs/api/rpc-openapi.json'
  const hangzhouBlockUrl = 'https://cdn.statically.io/gl/tezos/tezos/master/docs/api/hangzhou-openapi.json'
  const hangzhouMempoolUrl = 'https://cdn.statically.io/gl/tezos/tezos/master/docs/api/hangzhou-mempool-openapi.json'
  // const ithacaBlockUrl = 'https://cdn.statically.io/gl/tezos/tezos/master/docs/api/ithaca-openapi.json'
  // const ithacaMempoolUrl = 'https://cdn.statically.io/gl/tezos/tezos/master/docs/api/ithaca-mempool-openapi.json'

  const [obj, setObj] = useState<any>()
  const params = useParams()

  useEffect(() => {
    let url = '//mainnet.tezos.marigold.dev/'
    let title = 'General Tezos Node'
    let description = ''
    const servers: { url: string}[] = []

    let endpoint: Endpoints = 'general'
    let network: Networks = 'mainnet'
    if (endpoints.includes(params.endpoint as any)) {
      endpoint = (params.endpoint as Endpoints)
    }
    if (networks.includes(params.network as any)) {
      network = (params.network as Networks)
    }

    if (network === 'mainnet') {
      switch (endpoint) {
        case 'general':
          servers.push({ url: '//mainnet.tezos.marigold.dev/' })
          url = generalUrl
          title = 'General Tezos Node - Mainnet'
          description = 'General Tezos node endpoints are related to the most variety of root endpoints on the Tezos Node.'
          break
        case 'block':
          servers.push({ url: '//mainnet.tezos.marigold.dev/chains/main/blocks/head' })
          url = hangzhouBlockUrl
          title = 'Block Tezos Node - Mainnet'
          description = 'Block Tezos node endpoints are related to the block endpoints on the Tezos Node. ' +
          'We will use mainnet.tezos.marigold.dev/chains/main/blocks/head as root address because it returns the ' +
          'newest block, but you can use other addresses as root for to operate a specific block.'
          break
        case 'mempool':
          servers.push({ url: '//mainnet.tezos.marigold.dev/chains/main/mempool' })
          url = hangzhouMempoolUrl
          title = 'Mempool Tezos Node - Mainnet'
          description = 'Mempool Tezos node endpoints are related to the mempool endpoints on the Tezos Node. ' +
          'We will use mainnet.tezos.marigold.dev/chains/main/mempool as root address because it returns the mempool.'
          break
      }
    }

    if (network === 'hangzhounet') {
      switch (endpoint) {
        case 'general':
          servers.push({ url: '//hangzhounet.tezos.marigold.dev/' })
          url = generalUrl
          title = 'General Tezos Node - Hangzhounet'
          description = 'General Tezos node endpoints are related to the most variety of root endpoints on the Tezos Node.'
          break
        case 'block':
          servers.push({ url: '//hangzhounet.tezos.marigold.dev/chains/main/blocks/head' })
          url = hangzhouBlockUrl
          title = 'Block Tezos Node - Hangzhounet'
          description = 'Block Tezos node endpoints are related to the block endpoints on the Tezos Node. ' +
          'We will use hangzhounet.tezos.marigold.dev/chains/main/blocks/head as root address because it returns the ' +
          'newest block, but you can use other addresses as root for to operate a specific block.'
          break
        case 'mempool':
          servers.push({ url: '//hangzhounet.tezos.marigold.dev/chains/main/mempool' })
          url = hangzhouMempoolUrl
          title = 'Mempool Tezos Node - Hangzhounet'
          description = 'Mempool Tezos node endpoints are related to the mempool endpoints on the Tezos Node. ' +
          'We will use hangzhounet.tezos.marigold.dev/chains/main/mempool as root address because it returns the mempool.'
          break
      }
    }

    async function fetchDocumentation () {
      return fetch(url)
        .then(res => res.json())
        .then(out => {
          out.host = 'mainnet.tezos.marigold.dev'
          out.basePath = '/'
          out.servers = servers
          out.info = {
            description: description,
            title: title,
            'x-logo': {
              url: 'https://uploads-ssl.webflow.com/616ab4741d375d1642c19027/61793ee65c891c190fcaa1d0_Vector(1).png',
              altText: 'Marigold logo'
            }
          }
          setObj(out)
        }).catch(err => console.log(err))
    }
    fetchDocumentation()
  }, [params])

  return (
    <>
      <HeaderBar></HeaderBar>
      <div style={{ height: 'calc(100vh - 50px)', overflow: 'auto' }}>
        <RedocStandalone spec={obj} options={{ theme: { colors: { primary: { main: '#dd5522' } } } }}/>
      </div>
    </>
  )
}
