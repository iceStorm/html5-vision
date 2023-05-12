import clsx from 'clsx'

import { useMenuStore } from '~store/menu'

export function MenuPanels() {
  const [menuPosition, menuItems] = useMenuStore((state) => [state.position, state.items])

  return (
    <section className={clsx('hv-menu-panels', menuPosition)}>
      {menuItems.map((i) => {
        if (!i.settingsPanel) {
          return null
        }

        return (
          <div
            key={i.key}
            className={clsx('hv-menu-panels-tab', {
              hidden: !i.isActive,
            })}
          >
            <header className="hv-menu-panels-header">{i.title} settings.</header>

            <main className="hv-menu-panels-main">{i.settingsPanel}</main>
          </div>
        )
      })}
    </section>
  )
}
