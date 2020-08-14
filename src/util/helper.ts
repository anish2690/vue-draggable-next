function getConsole() {
  if (typeof window !== 'undefined') {
    return window.console
  }
  return global.console
}
const console = getConsole()

function cached(fn: any) {
  const cache = Object.create(null)
  return function cachedFn(str: string) {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }
}

const regex = /-(\w)/g
const camelize = cached((str: string) =>
  str.replace(regex, (_, c) => (c ? c.toUpperCase() : ''))
)

function removeNode(node: any) {
  if (node.parentElement !== null) {
    node.parentElement.removeChild(node)
  }
}

function insertNodeAt(fatherNode: any, node: any, position: number) {
  const refNode =
    position === 0
      ? fatherNode.children[0]
      : fatherNode.children[position - 1].nextSibling
  fatherNode.insertBefore(node, refNode)
}

export { insertNodeAt, camelize, console, removeNode }
