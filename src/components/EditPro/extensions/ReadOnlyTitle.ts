import { Node } from '@tiptap/core'
import { Plugin, TextSelection } from 'prosemirror-state'

export const ReadOnlyTitle = Node.create({
  name: 'readOnlyTitle',
  group: 'block',
  content: 'text*',
  selectable: true,
  draggable: false,
  atom: true,
  // 设置优先级高于默认 heading 节点
  priority: 1000,
  addAttributes() {
    return {
      class: {
        default: 'doc-title',
        rendered: true
      },
      style: {
        default: 'text-align: center; pointer-events: none;',
        rendered: true
      },
      contenteditable: {
        default: 'false',
        rendered: true
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'h1.doc-title',
        getAttrs: (el: HTMLElement) => {
          // 可选：你可以在这里验证是否符合预期
          return { class: el.getAttribute('class') }
        }
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['h1', HTMLAttributes, '']
  },

  addCommands() {
    return {
      insertReadOnlyTitle:
        (options = {}) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {},
            content: [
              {
                type: 'text',
                text: options.content || '默认标题'
              }
            ]
          })
        }
    }
  },

  // 使用 addProseMirrorPlugins 注入插件来控制选中行为
  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleClickOn: (view, pos, node, nodePos, event) => {
            console.log('handleClickOn', node.type)
            console.log(event, pos)
            // 如果点击的是只读标题节点，阻止光标进入
            if (node.type.name === this.name) {
              view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, nodePos)))
              return true
            }
            return false
          },
          handleKeyDown(view, event) {
            const { state, dispatch } = view
            console.log(event, dispatch)
            const { selection } = state
            const { $from } = selection

            // 获取当前光标位置的节点
            const currentNode = $from.node($from.depth)

            // 如果当前节点是只读标题，阻止任何输入
            if (currentNode?.type.name === this.name) {
              return true // 阻止所有按键事件
            }

            return false
          }
        }
      })
    ]
  }
})
