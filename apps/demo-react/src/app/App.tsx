import { useEffect, useRef, useState } from 'react'

import toast from 'react-simple-toasts'
import { ZBarSymbol, scanImageData } from '@undecaf/zbar-wasm'

import { IoMusicalNote } from 'react-icons/io5'

import { Html5VisionLayout, Html5VisionLayoutRef } from '@html5-vision/react'
import { MenuCamera, MenuMasks } from '@html5-vision/react/menus'
import { log } from '@html5-vision/core/utils/logger'

import styles from './App.module.scss'
import { barcodeWorker } from './workers/barcode-worker'

function App() {
  const scannerLayoutRef = useRef<Html5VisionLayoutRef>(null)
  const [useSoundEffects, setUseSoundEffects] = useState(false)

  useEffect(() => {
    addDefaultMenuItems()

    scannerLayoutRef.current?.camera.startGettingVideoFrames((screenshot) => {
      return detectBarcodes(screenshot)
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
    console.log('detectBarcodes...', screenshot.width, screenshot.height)

    try {
      // const symbols = await scanImageData(screenshot)

      // barcodeWorker
      //   .detectZBar(screenshot)
      //   .then((symbols) => {
      //     alert('worker run succeeded:' + symbols.length)
      //   })
      //   .catch((err) => {
      //     alert('worker error:' + err.message)
      //   })
      //   .finally(() => {
      //     alert('worker run finished')
      //   })

      const symbols = await barcodeWorker.detectZBar(screenshot)
      console.log('done zbar off worker', symbols)

      if (symbols.length) {
        const barcodes = new Array<string>()

        for (const s of symbols) {
          // barcodes.push(s.decode())

          const barcode = await barcodeWorker.decodeZbarData(s.data)
          barcodes.push(barcode)
        }

        toast(
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {barcodes.map((b) => (
              <p>{b}</p>
            ))}
          </div>,
        )
      }
    } catch (error) {
      console.log(error)

      if (error instanceof Error) {
        alert('Error:' + error.message)
      }
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
