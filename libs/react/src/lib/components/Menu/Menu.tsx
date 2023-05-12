import { useEffect, useMemo, useRef } from 'react'

import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'

import { useMenuStore } from '~store/menu'

import { MenuItemView } from './MenuItemView'
import { MenuPanels } from './sections/MenuPanels'
import { MenuControls } from './sections/MenuControls'

const panelMargin = 15 * 2 + 5

export function Menu() {
  const [menuItems, isMenuVisible, menuPosition] = useMenuStore((state) => [
    state.items,
    state.isVisible,
    state.position,
  ])

  const menuRef = useRef<HTMLDivElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)

  const headeHeight = useMemo(() => {
    const height =
      (menuRef.current?.clientHeight ?? 0) +
      (buttonsRef.current?.clientHeight ?? 0) +
      (panelMargin ?? 0)

    return height < 177 ? 177 : height
  }, [])

  // useEffect(() => {
  //   console.log('menuRef.current?.clientHeight:', menuRef.current?.clientHeight, headeHeight)
  // }, [headeHeight])

  return (
    <header className={clsx('hv-menu', menuPosition)}>
      <div className="hv-menu-wrapper">
        {/* control buttons */}
        <MenuControls ref={buttonsRef} />

        {/* menu items */}
        <AnimatePresence>
          {isMenuVisible && (
            <motion.section
              ref={menuRef}
              className="hv-menu-buttons"
              style={{ minWidth: '300px' }}
              initial={{
                marginTop: -headeHeight,
                opacity: 0,
              }}
              animate={{
                marginTop: 0,
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                marginTop: -headeHeight,
              }}
            >
              {menuItems.map((i) => {
                return <MenuItemView key={i.key} item={i} />
              })}
            </motion.section>
          )}
        </AnimatePresence>

        {/* menu panels */}
        <MenuPanels />
      </div>
    </header>
  )
}
