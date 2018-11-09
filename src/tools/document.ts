import { ID_KEY } from '../constants'
import { ElementX } from '../models'

/**
 * 1.Store initial document string with mark
 * 2.Create Map<node, id> for every node in DOM
 * 3.Add / Remove recorderId
 **/
class RecorderDocumentMarker {
  public map: Map<
    HTMLElement | Element | Node | EventTarget,
    number
  > = new Map()
  public initialDocument: string
  public installed: boolean = false
  private id: number = 0

  constructor() {}

  public init() {
    console.time('[Document cached]')

    // buffer every node in the Map
    Array.from(document.all).forEach(this.addOneNode2Map.bind(this))

    this.initialDocument = document.documentElement.outerHTML

    // remove id from node
    Array.from(document.all).forEach((node: HTMLElement) => {
      this.unmarkNode(node)
    })

    this.installed = true

    console.timeEnd('[Document cached]')

    return this
  }

  private newID(): number {
    this.id += 1
    return this.id
  }

  // mark recorderId on non-textnode
  public markNode(node, id): void {
    node.setAttribute(ID_KEY, id)
  }

  // remove recorderId on non-textnode
  public unmarkNode(node): void {
    node.removeAttribute(ID_KEY)
  }

  private addOneNode2Map = (node: ElementX): number => {
    let recorderId = this.map.get(node) || this.newID()
    this.map.set(node, recorderId)

    this.markNode(node, recorderId)

    return recorderId
  }

  // if document have new node, use this method because that node may have childElement
  public storeNewNode = ({
    node,
    beforeUnmark,
    afterUnmark
  }: {
    node: ElementX
    beforeUnmark?: (node: ElementX, id: number) => void
    afterUnmark?: (node: ElementX, id: number) => void
  }): void => {
    const { addOneNode2Map } = this
    const recorderId = addOneNode2Map(node)

    if (node.childElementCount) {
      // node.children retun childElements without textNodes
      Array.from(node.children).forEach(addOneNode2Map)
    }

    beforeUnmark && beforeUnmark(node, recorderId)

    this.unmarkNode(node)

    afterUnmark && afterUnmark(node, recorderId)
  }

  // get recorderId from map by node
  public getRecorderIdByNode = (node: ElementX | EventTarget): number => {
    return this.map.get(node)
  }
}

const RecorderDocument = new RecorderDocumentMarker()

export default RecorderDocument
