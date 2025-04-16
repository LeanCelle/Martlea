'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const AllProfilesFoundClient = dynamic(() => import('./AllProfilesFoundClient'), {
  ssr: false,
})

export default function Page() {
  return (
    <Suspense fallback={<div>Cargando resultados...</div>}>
      <AllProfilesFoundClient />
    </Suspense>
  )
}
