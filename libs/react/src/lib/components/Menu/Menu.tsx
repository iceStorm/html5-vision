import { useMemo, useRef } from 'react'

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
    const height = (menuRef.current?.clientHeight ?? 0) + (buttonsRef.current?.clientHeight ?? 0) + (panelMargin ?? 0)

    return height < 177 ? 177 : height
  }, [])

  return (
    <header className={clsx('hv-menu', menuPosition)}>
      <div className="hv-menu-wrapper">
        {/* control buttons */}
        <MenuControls ref={buttonsRef} />

        {/* menu items */}
        <section
          ref={menuRef}
          className={clsx('hv-menu-buttons')}
          style={{ minWidth: '300px', marginTop: isMenuVisible ? 0 : -headeHeight }}
        >
          {menuItems.map((i) => {
            return <MenuItemView key={i.key} item={i} />
          })}
        </section>

        {/* menu panels */}
        <MenuPanels />
      </div>
    </header>
  )
}
