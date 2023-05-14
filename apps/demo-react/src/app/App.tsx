import { useEffect, useRef, useState } from 'react'

import toast from 'react-simple-toasts'
import { ZBarSymbol, scanImageData } from '@undecaf/zbar-wasm'

import { IoMusicalNote } from 'react-icons/io5'

import { Html5VisionLayout, Html5VisionLayoutRef } from '@html5-vision/react'
import { MenuCamera, MenuMasks } from '@html5-vision/react/menus'
import { log } from '@html5-vision/core/utils/logger'

import styles from './App.module.scss'
import { barcodeWorker } from './workers'

function App() {
  const scannerLayoutRef = useRef<Html5VisionLayoutRef>(null)
  const [useSoundEffects, setUseSoundEffects] = useState(false)

  useEffect(() => {
    addDefaultMenuItems()

    scannerLayoutRef.current?.camera.startGettingVideoFrames(1000, (screenshot) => {
      detectBarcodes(screenshot)
    })

    return () => {
      scannerLayoutRef.current?.camera.stopGettingVideoFrames()
    }
  }, [])

  useEffect(() => {
    //
  }, [])

  function addDefaultMenuItems() {
    scannerLayoutRef.current?.menu.addMenuItem(MenuCamera)
    scannerLayoutRef.current?.menu.addMenuItem(MenuMasks)
    scannerLayoutRef.current?.menu.addMenuItem({
      key: 'sounds',
      title: (
        <span style={{ fontSize: 13 }}>
          Sound <br /> Effects
        </span>
      ),
      icon: <IoMusicalNote size={20} />,
      toggleActiveOnClick: true,
      onClick() {
        setUseSoundEffects(!useSoundEffects)
      },
    })
  }

  async function detectBarcodes(screenshot: ImageData) {
    console.log('detectBarcodes...', screenshot)

    try {
      // const symbols = await barcodeWorker.detectZBar(screenshot)
      const symbols = await scanImageData(screenshot)

      if (symbols && symbols.length) {
        const barcodes = symbols.map((s) => {
          log('[ZBar detected]', s.typeName, s.decode())

          scannerLayoutRef.current?.camera.drawBarcode?.(s.points)

          return (
            <p>
              [{s.typeName}] {s.decode()}
            </p>
          )
        })

        toast(<div style={{ display: 'flex', flexDirection: 'column' }}>{barcodes.join('')}</div>)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>0</h1>
        <p>parcels scanned successfully</p>
      </header>

      <main className={styles.main}>
        <Html5VisionLayout ref={scannerLayoutRef} />
      </main>

      <footer className={styles.footer}>
        <button className={styles.button}>Enter barcode manually</button>
      </footer>
    </div>
  )
}

export default App
