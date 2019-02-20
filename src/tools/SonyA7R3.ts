import { RECORDER_ID } from '../constants'
import { ElementX, SonyA7R3 } from '../models'

/**
 * SonyA7R3 is a camera with abilities list below:
 * @feature take snapshot for page
 * @feature buffer every node in document up in Map<node, id> format
 * @feature mark / unmark node with unique ID
 */
class SonyA7R3Camera implements SonyA7R3 {
  public map: Map<HTMLElement | Element | Node | EventTarget, number> = new Map()
  public latestSnapshot: string
  public inited: boolean = false
  private id: number = 0 // self-increase id

  public takeSnapshotForPage(): string {
    console.time('[Snapshot for page]')

    // Buffer every element into the Map
    // Note that textNodes wouldn't been included !!
    Array.prototype.slice.call(document.querySelectorAll('*')).forEach(this.buffer)

    this.latestSnapshot = document.documentElement.outerHTML

    // remove recorder-id from node
    Array.prototype.slice.call(document.querySelectorAll('*')).forEach((node: HTMLElement) => {
      this.unmark(node)
    })

    console.timeEnd('[Snapshot for page]')

    return this.latestSnapshot
  }

  private newId(): number {
    this.id += 1
    return this.id
  }

  // mark recorderId on non-textnode
  public mark(ele: ElementX, id): void {
    ele.setAttribute(RECORDER_ID, id)
  }

  // remove recorderId on non-textnode
  public unmark(ele: ElementX, isDeep: boolean = false): void {
    const { removeAttribute } = ele
    removeAttribute && ele.removeAttribute(RECORDER_ID)

    if (isDeep && ele.childElementCount) {
      Array.prototype.slice.call(ele.children).forEach(chEle => this.unmark(chEle))
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
      Array.prototype.slice.call(ele.children).forEach(chEle => this.bufferNewElement(chEle))
    }
  }

  // get recorderId from map by element
  public getRecordIdByElement = (ele: ElementX | EventTarget): number | undefined => {
    return this.map.get(ele)
  }
}

const SonyA7R3 = new SonyA7R3Camera()

export default SonyA7R3
