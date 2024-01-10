import { useQuery } from '@tanstack/react-query'
import { Documentation } from './Documentation'
import { useParams } from 'react-router-dom'
import { fetchDocumentation, fetchGithubObjects } from '../api'
import HeaderBar from './HeaderBar'
import { TezosDocumentation } from '../models'
import { capitalizeFirstLetter } from '../helper'

export function Page() {
  const params = useParams()
  const type = params.type || 'base'
  const protocol = params.protocol || 'all'
  const rc = params.rc == 'rc' || false

  const { data: docs } = useQuery({
    queryKey: ['tezosOpenAPI'],
    queryFn: fetchGithubObjects,
  })

  const selected = docs?.find(
    (x: TezosDocumentation) =>
      x.rc === rc &&
      (x.network === 'all' || protocol === 'mainnet'
        ? x.type === type
        : x.network === protocol && x.type === type)
  )
  const url = selected?.url

  const networks = Array.from(
    new Set(
      docs
        ?.filter((data) => data.network !== 'all')
        .map((data) => capitalizeFirstLetter(data.network))
    )
  )
  networks.push('Mainnet')

  const {
    status,
    fetchStatus,
    data: dataDocumentation,
  } = useQuery({
    queryKey: ['documentation', url, type, protocol, rc, networks],
    queryFn: fetchDocumentation(url!, type, protocol, rc, networks),
    enabled: !!url,
  })

  const documents =
    (fetchStatus !== 'idle' && status !== 'success') || !docs ? [] : docs

  return (
    <>
      <HeaderBar documents={documents}></HeaderBar>
      <Documentation redocDocument={dataDocumentation}></Documentation>
    </>
  )
}
