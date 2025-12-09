"use client"
import {NextUIProvider} from '@nextui-org/react'
import LoadingScreen from './components/LoadingScreen'

export function Providers({children}: { children: React.ReactNode }) {
  return (
    <NextUIProvider className="bg-white min-h-screen">
      <LoadingScreen minDuration={3000}>
        {children}
      </LoadingScreen>
    </NextUIProvider>
  )
}