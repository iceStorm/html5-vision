import { mountStoreDevtool } from 'simple-zustand-devtools'

import { useCameraStore } from '~store/camera'
import { useMenuStore } from '~store/menu'
import { useConfigStore } from '~store/config'

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('camera-store', useCameraStore)
  mountStoreDevtool('menu-store', useMenuStore)
  mountStoreDevtool('config-store', useConfigStore)
}

export * from './MenuBarcodes'
export * from './MenuCamera'
export * from './MenuMasks'
