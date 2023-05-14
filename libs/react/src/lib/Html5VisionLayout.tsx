import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'

import { ConditionalPick } from 'type-fest'
import { shallow } from 'zustand/shallow'
import { AnimatePresence, motion } from 'framer-motion'
// import * as Comlink from 'comlink'

import { ScreenshotProps } from '@html5-vision/core/models'
import { captureImageFromVideo } from '@html5-vision/core/utils/canvas'

import { MenuState, useMenuStore } from '~store/menu'
import { CameraState, useCameraStore } from '~store/camera'

import { Menu } from '~components/Menu'
import { Main, MainRef } from '~components/Main'
import { CameraNotFound } from '~components/CameraNotFound'
import { AccessCameraLoader } from '~components/AccessCameraLoader'
import { PermissionDenied } from '~components/PermissionDenied'

import './styles/index.scss'
// import { barcodeWorker, proxiedWorker } from '~workers/barcode-worker'

export interface Html5VisionLayoutProps {
  /** Component to show when accessing camera. */
  loaderComponent?: JSX.Element

  /** Component to show when user denied camera persmisson. */
  permissionDeniedComponent?: JSX.Element

  /** Component to show when not found any active camera. */
  cameraNotFoundComponent?: JSX.Element

  useDefaultMenu?: boolean
}

export type Html5VisionLayoutRef = {
  menu: ConditionalPick<MenuState, () => void>
  camera: {
    captureScreenShot(specs?: ScreenshotProps): {
      toImageData(): ImageData | undefined
      toBase64(): string | undefined
    }

    startGettingVideoFrames(onFrame: (data: ImageData) => Promise<unknown>): void
    stopGettingVideoFrames(): void

    drawBarcode?: (points: { x: number; y: number }[]) => void
  }
}

export const Html5VisionLayout = forwardRef<Html5VisionLayoutRef, Html5VisionLayoutProps>(function (props, ref) {
  const { loaderComponent, permissionDeniedComponent, cameraNotFoundComponent, useDefaultMenu } = props

  const [isGettingVideoFrames, setIsGettingVideoFrames] = useState(false)
  const [videoFrameCallback, setVideoFrameCallback] = useState<(...args: any[]) => Promise<unknown>>(() => {
    return () =>
      Promise.resolve(() => {
        console.log('Start getting video frames...')
      })
  })
  const [videoFrameDelay, setVideoFrameDelay] = useState(1000)

  // const [videoFramesInterval, setVideoFramesInterval] = useState<NodeJS.Timer>()
  const videoFramesIntervalRef = useRef<NodeJS.Timer>()

  const [
    selectedCamera,
    isAccessingCamera,
    isCameraPermissionDenied,
    isCameraNotFound,
    requestCamera,
    isCameraCouldNotStart,
    isCameraPaused,
  ] = useCameraStore(
    (state) => [
      state.selectedCamera,
      state.isAccessingCamera,
      state.isCameraPermissionDenied,
      state.isCameraNotFound,
      state.requestCamera,
      state.isCameraCouldNotStart,
      state.isCameraPaused,
    ],
    shallow,
  )

  const [
    addMenuItem,
    removeMenuItemAt,
    toggleMenuVisibility,
    setPosition,
    setActiveItem,
    hideActiveMenuPanel,
    isMenuVisible,
    menuItems,
    menuPosition,
  ] = useMenuStore(
    (state) => [
      state.addMenuItem,
      state.removeMenuItemAt,
      state.toggleMenuVisibility,
      state.setPosition,
      state.setActiveItem,
      state.hideActiveMenuPanel,
      state.isVisible,
      state.items,
      state.position,
    ],
    shallow,
  )

  // handle ref impelmentations here
  useImperativeHandle(
    ref,
    () => ({
      menu: {
        addMenuItem,
        removeMenuItemAt,
        toggleMenuVisibility,
        setPosition,
        setActiveItem,
        hideActiveMenuPanel,
      },
      camera: {
        captureScreenShot() {
          return {
            toImageData() {
              if (mainRef.current?.videoRef.current && selectedCamera?.stream) {
                return captureImageFromVideo(mainRef.current?.videoRef.current).toImageData()
              }
            },
            toBase64() {
              if (mainRef.current?.videoRef.current && selectedCamera?.stream) {
                return captureImageFromVideo(mainRef.current?.videoRef.current).toBase64()
              }
            },
          }
        },
        startGettingVideoFrames(callback) {
          // setVideoFrameDelay(delay)
          setVideoFrameCallback(() => callback)
          setIsGettingVideoFrames(true)
        },
        stopGettingVideoFrames() {
          clearInterval(videoFramesIntervalRef.current)
        },
        drawBarcode(points) {
          console.log('points:', points)

          const canvas = mainRef.current?.canvasRef.current
          const ctx = mainRef.current?.canvasRef.current?.getContext('2d')
          const lastPoint = points[points.length - 1]

          if (ctx) {
            ctx.moveTo(lastPoint.x, lastPoint.y)
            points.forEach((point) => ctx.lineTo(point.x, point.y))

            ctx.lineWidth = Math.max(Math.min(canvas?.height || 0, canvas?.width || 0) / 100, 1)
            ctx.strokeStyle = '#00e00060'
            ctx.stroke()
          }
        },
      },
    }),
    [
      addMenuItem,
      hideActiveMenuPanel,
      removeMenuItemAt,
      selectedCamera,
      setActiveItem,
      setPosition,
      toggleMenuVisibility,
    ],
  )

  useEffect(() => {
    console.warn('selectedCamera:', selectedCamera)
  }, [selectedCamera])

  const layoutRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<MainRef>(null)

  useEffect(() => {
    requestCamera()
  }, [requestCamera])

  useEffect(() => {
    if (useDefaultMenu) {
      // addMenuItem({
      // })
    }
  }, [])

  const getVideoFrame = useCallback(() => {
    console.log('getVideoFrame:', mainRef.current?.videoRef.current)

    if (mainRef.current?.videoRef.current) {
      const image = captureImageFromVideo(mainRef.current?.videoRef.current).toImageData()
      console.log('image:', image)

      if (image) {
        videoFrameCallback(image).then(() => {
          setTimeout(() => {
            getVideoFrame()
          }, 1000)
        })
      } else {
        setTimeout(() => {
          getVideoFrame()
        }, 1000)
      }
    }
  }, [videoFrameCallback])

  useEffect(() => {
    console.log('isGettingVideoFrames:', isGettingVideoFrames)

    if (isGettingVideoFrames) {
      getVideoFrame()
    }
  }, [videoFrameCallback, isGettingVideoFrames, selectedCamera?.stream, videoFrameDelay, getVideoFrame])

  return (
    <div className="hv" ref={layoutRef}>
      <AnimatePresence>
        {isAccessingCamera && (
          <motion.div
            transition={{ duration: 0.5 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ height: '100%' }}
          >
            {loaderComponent ?? <AccessCameraLoader />}
          </motion.div>
        )}
      </AnimatePresence>

      {!isAccessingCamera && isCameraPermissionDenied && (
        <motion.div
          transition={{ duration: 0.5 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ height: '100%' }}
        >
          {permissionDeniedComponent ?? <PermissionDenied />}
        </motion.div>
      )}

      {!isAccessingCamera && isCameraNotFound && (
        <motion.div
          transition={{ duration: 0.5 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ height: '100%' }}
        >
          {cameraNotFoundComponent ?? <CameraNotFound />}
        </motion.div>
      )}

      {!isAccessingCamera && !isCameraPermissionDenied && !isCameraNotFound && (
        <>
          <Menu />
          <Main ref={mainRef} />
        </>
      )}
    </div>
  )
})
