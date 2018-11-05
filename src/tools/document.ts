import { ID_KEY } from '../constants'
import { ElementX } from 'models/friday'
import { _newuuid } from './helpers'

/**
 * 1.Store initial document string with mark
 * 2.Create Map<node, id> for every node in DOM
 * 3.Add / Remove fridayId
 **/
class FridayDocumentMarker {
  public map: Map<
    HTMLElement | Element | Node | EventTarget,
    string
  > = new Map()
  public initialDocument: string

  constructor() {
  }

  public init(): void {
    console.time('[Doc buffer]')

    // buffer every node in the Map
    Array.from(document.all).forEach(this.addOneNode2Map.bind(this))

    this.initialDocument = document.documentElement.outerHTML

    // remove id from node
    Array.from(document.all).forEach((node: HTMLElement) => {
      this.unmarkNode(node)
    })

    console.timeEnd('[Doc buffer]')
  }

  // mark fridayId on non-textnode
  markNode(node, id): void {
    node.setAttribute(ID_KEY, id)
  }

  // remove fridayId on non-textnode
  unmarkNode(node): void {
    node.removeAttribute(ID_KEY)
  }

  private addOneNode2Map = (node: ElementX): string => {
    let fridayId = this.map.get(node) || _newuuid()
    this.map.set(node, fridayId)

    this.markNode(node, fridayId)

    return fridayId
  }

  // if document have new node, use this method because that node may have childElement
  public storeNewNode = ({
    node,
    beforeUnmark,
    afterUnmark
  }: {
    node: ElementX
    beforeUnmark?: (node: ElementX, id: string) => void
    afterUnmark?: (node: ElementX, id: string) => void
  }): void => {
    const { addOneNode2Map } = this
    const fridayId = addOneNode2Map(node)

    if (node.childElementCount) {
      // node.children retun childElements without textNodes
      Array.from(node.children).forEach(addOneNode2Map)
    }

    beforeUnmark && beforeUnmark(node, fridayId)

    this.unmarkNode(node)

    afterUnmark && afterUnmark(node, fridayId)
  }

  // get fridayId from map by node
  public getFridayIdByNode = (node: ElementX | EventTarget): string => {
    return this.map.get(node)
  }
}

const FridayDocument = new FridayDocumentMarker()

;(window as any).__FDOCUMENT__ = FridayDocument

export default FridayDocument
