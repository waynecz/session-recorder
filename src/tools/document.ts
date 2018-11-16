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
  public initialDocument: string
  public installed: boolean = false
  private id: number = 0

  constructor() {}

  public init() {
    console.time('[Document buffer]')

    // Buffer every element into the Map
    // Note that textNodes wouldn't been included !!
    Array.from(document.all).forEach(this.buffer)

    this.initialDocument = document.documentElement.outerHTML

    // remove id from node
    Array.from(document.all).forEach((node: HTMLElement) => {
      this.unmark(node)
    })

    this.installed = true

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
  public unmark(ele: ElementX): void {
    ele.removeAttribute(ID_KEY)
  }

  private buffer = (ele: ElementX): number => {
    let recorderId = this.map.get(ele) || this.newId()
    this.map.set(ele, recorderId)

    this.mark(ele, recorderId)

    return recorderId
  }

  // if document have new node, use this method because that node may have childElement
  public bufferNewElement = ({
    ele,
    beforeUnmark,
    afterUnmark
  }: {
    ele: ElementX
    beforeUnmark?: (ele: ElementX, id: number) => void
    afterUnmark?: (ele: ElementX, id: number) => void
  }): void => {
    const { buffer } = this
    const recorderId = buffer(ele)

    if (ele.childElementCount) {
      // element.children retun childElements without textNodes
      Array.from(ele.children).forEach(buffer)
    }

    beforeUnmark && beforeUnmark(ele, recorderId)

    this.unmark(ele)

    afterUnmark && afterUnmark(ele, recorderId)
  }

  // get recorderId from map by element
  public getRecordIdByElement = (ele: ElementX | EventTarget): number | undefined => {
    return this.map.get(ele)
  }
}

const RecorderDocument = new DocumentBuffer()

export default RecorderDocument
