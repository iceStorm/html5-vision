import { useMemo } from 'react'

import clsx from 'clsx'
import { shallow } from 'zustand/shallow'
import { IoVideocam } from 'react-icons/io5'

import { useCameraStore } from '~store/camera'
import { MenuItem } from '~store/menu'

import { sleep } from '@html5-vision/shared/utils/async'

import './MenuCamera.scss'

export function MenuCameraPanel() {
  const [
    isCameraPaused,
    cameraList,
    selectedCamera,
    avalableResolutions,
    // setSelectedCameraSettings,
    requestCamera,
  ] = useCameraStore(
    (state) => [
      state.isCameraPaused,
      state.cameraList,
      state.selectedCamera,
      state.avalableResolutions,
      // state.setSelectedCameraSettings,
      state.requestCamera,
    ],
    shallow,
  )

  const selectedCameraInfo = useMemo(() => {
    return cameraList.find((c) => c.deviceId === selectedCamera?.deviceId)
  }, [selectedCamera, cameraList])

  return (
    <div
      className={clsx('hv-preset-menu menu-camera', {
        // 'pointer-events-none text-gray-700': isCameraPaused,
      })}
    >
      <section>
        <p className="hv-preset-menu-headline">Pick a camera from your device</p>

        <div className="camera-grid">
          {cameraList.map((camera) => {
            return (
              <button
                key={camera.deviceId}
                className={clsx('hv-btn-toggle', {
                  active: camera.deviceId === selectedCamera?.deviceId,
                  // 'text-gray-500': isCameraPaused,
                })}
                onClick={() => {
                  console.log('Selected camera:', camera)
                  requestCamera({ video: { deviceId: camera.deviceId } })
                }}
              >
                {camera.label}
              </button>
            )
          })}
        </div>
      </section>

      <section>
        <p className="hv-preset-menu-headline">
          Select a resolution for the camera "{selectedCameraInfo?.label}". Higher is better.
        </p>

        <div className="resolution-grid">
          {avalableResolutions.map(({ width, height, name }) => {
            return (
              <button
                key={name}
                className={clsx('hv-btn-toggle', {
                  active:
                    (selectedCamera?.width === width && selectedCamera?.height === height) ||
                    (selectedCamera?.width === height && selectedCamera?.height === width),
                  'text-gray-500': isCameraPaused,
                })}
                onClick={(e) => {
                  requestCamera({ video: { width, height } })
                  e.currentTarget.blur()
                }}
              >
                <p className="">{name}</p>
                <div>
                  <span>{width}</span> × <span>{height}</span>
                </div>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export const MenuCamera: MenuItem = {
  key: 'camera',
  title: 'Camera',
  icon: <IoVideocam size={20} />,
  settingsPanel: <MenuCameraPanel />,
}
