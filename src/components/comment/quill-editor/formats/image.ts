// ImageBlot.ts
import Quill from 'quill'

const { EmbedBlot } = Quill.import('parchment')

class ImageBlot extends EmbedBlot {
  static blotName = 'image'
  static tagName = 'img'
  static className = 'ed-image'

  static create(value: { src: string; width?: string; height?: string }) {
    const node = super.create() as HTMLImageElement

    node.setAttribute('src', value.src)

    if (value.width) node.setAttribute('width', value.width)
    if (value.height) node.setAttribute('height', value.height)

    return node
  }

  static value(node: HTMLImageElement) {
    return {
      src: node.getAttribute('src'),
      width: node.getAttribute('width'),
      height: node.getAttribute('height')
    }
  }
}

export default ImageBlot
