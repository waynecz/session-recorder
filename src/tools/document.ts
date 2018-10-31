import { ID_KEY } from 'constants'
import { ElementX } from 'models/friday'
import { _newuuid } from './helpers';

/**
 * 1.Store initial document string
 * 2.Create Map<node, id> for every node in DOM
 * 3.Add / Remove fridayId
 **/
class FridayDocumentMachine {
  public map: Map<HTMLElement | Element | Node | EventTarget, string> = new Map()
  public initialDocument: string

  constructor() {
    this.init()
  }

  init(): void {
    console.time('[Doc buffer]: ')

    // buffer every node in the Map
    Array.from(document.all).forEach(this.addOneNode2Map)

    this.initialDocument = document.documentElement.outerHTML

    // remove id from node
    Array.from(document.all).forEach((node: HTMLElement) => {
      this.unmarkNode(node)
    })

    console.timeEnd('[Doc buffer]: ')
  }

  // mark fridayId on non-textnode
  markNode(node, id): void {
    node.setAttribute(ID_KEY, id)
  }

  // remove fridayId on non-textnode
  unmarkNode(node): void {
    node.removeAttribute(ID_KEY)
  }

  addOneNode2Map(node: ElementX): string {
    let fridayId = this.map.get(node) || _newuuid()
    this.map.set(node, fridayId)
    this.markNode(node, fridayId)
    return fridayId
  }

  // if document have new node, use this method because that node may have childElement
  storeNewNode({
    node,
    beforeUnmark,
    afterUnmark
  }: {
    node: ElementX
    beforeUnmark?: (node: ElementX, id: string) => void
    afterUnmark?: (node: ElementX, id: string) => void
  }): void {
    const { addOneNode2Map } = this
    const fridayId = addOneNode2Map(node)

    if (node.childElementCount) {
      // node.children retun childElements without textNodes
      Array.from(node.children).forEach(addOneNode2Map)
    }

    beforeUnmark(node, fridayId)
    this.unmarkNode(node)
    afterUnmark(node, fridayId)
  }

  // get fridayId from map by node
  getFridayIdByNode(node: ElementX | EventTarget): string {
    return this.map.get(node)
  }
}

const FridayDocument = new FridayDocumentMachine()

export default FridayDocument
