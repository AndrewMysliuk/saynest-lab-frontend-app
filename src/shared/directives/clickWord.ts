import { DirectiveBinding } from "vue"

type WordClickHandler = (word: string, event: MouseEvent) => void
type WithWordHandler = HTMLElement & {
  __wordClickHandler__?: (event: MouseEvent) => void
}

function getWordAtPoint(_elem: HTMLElement, x: number, y: number): string | null {
  let node: Node | null = null
  let offset: number | null = null

  if ("caretPositionFromPoint" in document) {
    const pos = document.caretPositionFromPoint(x, y)
    if (!pos || pos.offsetNode.nodeType !== Node.TEXT_NODE) return null
    node = pos.offsetNode
    offset = pos.offset
  } else if ("caretRangeFromPoint" in document) {
    const range = (document as any).caretRangeFromPoint(x, y) as Range | null
    if (!range || range.startContainer.nodeType !== Node.TEXT_NODE) return null
    node = range.startContainer
    offset = range.startOffset
  } else {
    return null
  }

  const text = node.textContent
  if (!text || offset === null) return null

  const left = text.slice(0, offset).search(/\S+$/)
  const right = text.slice(offset).search(/\s|$/)

  if (left === -1 || right === -1) return null

  const word = text.slice(left, offset + right).trim()

  return word.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "") || null
}

export const wordClickDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding<WordClickHandler>) {
    const _el = el as WithWordHandler
    const handler = (event: MouseEvent) => {
      const word = getWordAtPoint(el, event.clientX, event.clientY)
      if (word && binding.value) {
        binding.value(word, event)
      }
    }

    _el.__wordClickHandler__ = handler
    el.addEventListener("click", handler)
  },
  unmounted(el: HTMLElement) {
    const _el = el as WithWordHandler
    if (_el.__wordClickHandler__) {
      el.removeEventListener("click", _el.__wordClickHandler__)
      delete _el.__wordClickHandler__
    }
  },
}
