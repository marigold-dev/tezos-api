import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Documentation } from './Documentation'
import { useParams } from 'react-router-dom'
import { fetchDocumentation, fetchGithubObjects } from '../api'
import HeaderBar from './HeaderBar'

export function Page() {
  const network = useParams().network || 'mainnet'
  const endpoint = useParams().endpoint || 'general'

  const { data: tezosDocumentations } = useQuery(
    ['tezosOpenAPI'],
    fetchGithubObjects
  )

  const selected = tezosDocumentations?.find((x) =>
    x.network === 'all' || network === 'mainnet'
      ? x.type === endpoint
      : x.network === network && x.type === endpoint
  )
  const url = selected?.url

  const {
    status,
    fetchStatus,
    data: dataDocumentation,
  } = useQuery(
    ['documentation', url],
    () => fetchDocumentation(url!, endpoint, network).then((data) => data),
    {
      enabled: !!url,
    }
  )

  const documents =
    (fetchStatus !== 'idle' && status !== 'success') || !tezosDocumentations
      ? []
      : tezosDocumentations

  return (
    <>
      <HeaderBar documents={documents}></HeaderBar>
      <Documentation redocDocument={dataDocumentation}></Documentation>
    </>
  )
}
