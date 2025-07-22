import { reactive, defineComponent, h } from 'vue'
import { IDropdown, IDropdownOption } from './types'
import { ElDropdown } from 'element-plus'

export function useContextMenu(contextMenuHandle: (key: string) => void) {
  const dropdown: IDropdown = reactive({
    options: [] as IDropdownOption[],
    show: false,
    x: 0,
    y: 0,
    item: {} as any
  })

  const close = () => {
    dropdown.show = false
    dropdown.item = {}
  }

  const show = (e: MouseEvent, options: IDropdownOption[], item: any) => {
    dropdown.item = item
    dropdown.options = [...options]
    dropdown.x = e.clientX
    dropdown.y = e.clientY
    dropdown.show = true
  }

  const getItem = () => dropdown.item

  const handleSelect = (key: string) => {
    contextMenuHandle(key)
    close()
  }

  const handleClickOutside = () => {
    close()
  }

  const ContextMenuElement = defineComponent({
    name: 'ContextMenuElement',
    render() {
      return h(ElDropdown, {
        options: dropdown.options,
        x: dropdown.x,
        y: dropdown.y,
        show: dropdown.show,
        onSelect: handleSelect,
        onClickoutside: handleClickOutside
      })
    }
  })

  return { menu: { close, show, getItem }, ContextMenuElement }
}
