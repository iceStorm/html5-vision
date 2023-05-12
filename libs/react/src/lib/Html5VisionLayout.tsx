import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'

import { ConditionalPick } from 'type-fest'
import { shallow } from 'zustand/shallow'
import { AnimatePresence, motion } from 'framer-motion'

import { ScreenshotProps } from '@html5-vision/shared/models'
import { captureImageFromVideo } from '@html5-vision/shared/utils/canvas'

import { MenuState, useMenuStore } from '~store/menu'
import { CameraState, useCameraStore } from '~store/camera'

import { Menu } from '~components/Menu'
import { Main, MainRef } from '~components/Main'
import { CameraNotFound } from '~components/CameraNotFound'
import { AccessCameraLoader } from '~components/AccessCameraLoader'
import { PermissionDenied } from '~components/PermissionDenied'

import './styles/index.scss'

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
  menu: MenuState
  camera: ConditionalPick<CameraState, boolean> & {
    captureScreenShot(specs?: ScreenshotProps): {
      toImageData(): ImageData | undefined
      toBase64(): string | undefined
    }

    startGettingVideoFrames(onFrame: (data: ImageData) => void): void
    stopGettingVideoFrames(): void

    drawBarcode?: (points: { x: number; y: number }[]) => void

    selectedCamera: CameraState['selectedCamera']
  }
}

export const Html5VisionLayout = forwardRef<Html5VisionLayoutRef, Html5VisionLayoutProps>(function (
  props,
  ref,
) {
  const { loaderComponent, permissionDeniedComponent, cameraNotFoundComponent, useDefaultMenu } =
    props

  const [isGettingVideoFrames, setIsGettingVideoFrames] = useState(false)

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getVideoFrame = (callback: (data: ImageData) => void, runnable?: boolean) => {
    if (runnable || isGettingVideoFrames) {
      console.log('getVideoFrame')

      if (mainRef.current?.videoRef.current) {
        const image = captureImageFromVideo(mainRef.current?.videoRef.current).toImageData()

        console.log('getVideoFrame image', image)

        if (image) {
          callback(image)
        }
      }

      requestAnimationFrame(() => {
        getVideoFrame(callback)
      })
    }
  }

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
        isVisible: isMenuVisible,
        items: menuItems,
        position: menuPosition,
      },
      camera: {
        isAccessingCamera,
        isCameraCouldNotStart,
        isCameraNotFound,
        isCameraPaused,
        isCameraPermissionDenied,
        selectedCamera: selectedCamera,
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
          console.log('startGettingVideoFrames')

          setIsGettingVideoFrames(true)
          getVideoFrame(callback, true)
        },
        stopGettingVideoFrames() {
          if (frameIdRef.current) {
            cancelAnimationFrame(frameIdRef.current)
          }

          setIsGettingVideoFrames(false)
        },
        drawBarcode(points) {
          // mainRef.current?.canvasRef.current.
        },
      },
    }),
    [
      addMenuItem,
      getVideoFrame,
      hideActiveMenuPanel,
      isAccessingCamera,
      isCameraCouldNotStart,
      isCameraNotFound,
      isCameraPaused,
      isCameraPermissionDenied,
      isMenuVisible,
      menuItems,
      menuPosition,
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
  const frameIdRef = useRef<number>()

  useEffect(() => {
    requestCamera()
  }, [requestCamera])

  useEffect(() => {
    if (useDefaultMenu) {
      // addMenuItem({
      // })
    }
  }, [])

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
