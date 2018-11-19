import { ID_KEY } from '../constants'
import { ElementX } from '../models'

/**
 * 1.Store initial document string with mark
 * 2.Create Map<node, id> for every node in DOM
 * 3.Add / Remove recorderId
 **/
class DocumentBuffer {
  public map: Map<
    HTMLElement | Element | Node | EventTarget,
    number
  > = new Map()
  public domSnapshot: string
  public inited: boolean = false
  private id: number = 0

  constructor() {}

  public init() {
    console.time('[Document buffer]')

    // Buffer every element into the Map
    // Note that textNodes wouldn't been included !!
    Array.from(document.all).forEach(this.buffer)

    this.domSnapshot = document.documentElement.outerHTML

    window.localStorage.setItem('domSnapshot', JSON.stringify(this.domSnapshot))

    // remove id from node
    Array.from(document.all).forEach((node: HTMLElement) => {
      this.unmark(node)
    })

    this.inited = true

    console.timeEnd('[Document buffer]')

    return this
  }

  private newId(): number {
    this.id += 1
    return this.id
  }

  // mark recorderId on non-textnode
  public mark(ele: ElementX, id): void {
    ele.setAttribute(ID_KEY, id)
  }

  // remove recorderId on non-textnode
  public unmark(ele: ElementX, isDeep: boolean = false): void {
    const { removeAttribute } = ele
    removeAttribute && ele.removeAttribute(ID_KEY)

    if (isDeep && ele.childElementCount) {
      Array.from(ele.children).forEach(chEle => this.unmark(chEle))
    }
  }

  private buffer = (ele: ElementX): number => {
    let recorderId = this.map.get(ele) || this.newId()
    this.map.set(ele, recorderId)

    this.mark(ele, recorderId)

    return recorderId
  }

  // if document have new node, use this method because that node may have childElement
  public bufferNewElement = (ele: ElementX): void => {
    this.buffer(ele)

    if (ele.childElementCount) {
      // element.children retun childElements without textNodes
      Array.from(ele.children).forEach(chEle => this.bufferNewElement(chEle))
    }
  }

  // get recorderId from map by element
  public getRecordIdByElement = (
    ele: ElementX | EventTarget
  ): number | undefined => {
    return this.map.get(ele)
  }
}

const RecorderDocument = new DocumentBuffer()

export default RecorderDocument
