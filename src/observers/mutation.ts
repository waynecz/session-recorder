import { ObserverClass, ObserverConstructorParams } from '../models/observers'
import {
  DOMMutationRecord,
  DOMMutationTypes,
  NodeMutationData
} from '../models/observers/mutation'
import { MutationRecordX } from '../models'
import { ID_KEY } from '../constants'
import RecorderDocument from '../tools/document'
import { _log } from '../tools/helpers'

const { getRecordIdByElement } = RecorderDocument

/**
 * Observe DOM change such as DOM-add/remove text-change attribute-change
 * and generate an Record
 **/
export default class DOMMutationObserver implements ObserverClass {
  public name: string = 'DOMMutationObserver'
  public onobserved
  private observer: MutationObserver
  public status = {
    mutation: true
  }

  constructor({ onobserved }: ObserverConstructorParams) {
    this.onobserved = onobserved
    this.install()
  }

  private process(mutationRecord: MutationRecordX) {
    const { target, attributeName } = mutationRecord

    // ignore script tag's mutation
    if (target && target.tagName === 'SCRIPT') return

    switch (mutationRecord.type) {
      case 'attributes': {
        // ignore recorderId mutate
        if (attributeName === ID_KEY) return

        return this.getAttrReocrd(mutationRecord)
      }

      case 'characterData': {
        return this.getTextRecord(mutationRecord)
      }

      case 'childList': {
        return this.getNodesRecord(mutationRecord)
      }

      default: {
        return
      }
    }
  }

  // when node's attribute change
  private getAttrReocrd({
    attributeName,
    target
  }: MutationRecordX): DOMMutationRecord {
    let record = { attr: {} } as DOMMutationRecord
    record.target = getRecordIdByElement(target)

    if (record.target === undefined) return

    record.type = DOMMutationTypes.attr
    record.attr.k = attributeName
    record.attr.v = target.getAttribute(attributeName)

    return record
  }

  // when textNode's innerText change
  private getTextRecord({ target }: MutationRecordX): DOMMutationRecord {
    let record = {} as DOMMutationRecord
    record.type = DOMMutationTypes.text

    record.target = getRecordIdByElement(target)

    // 比如文本修改是在一个 contenteditable 的 `元素A` 内发生，
    // 并且 `元素A` 内有 textNode 和 element 同时存在，
    // 当只修改某个 textNode 时，MutationObserver 给的 target 会指向这个 textNode，
    // 所以 record.target 在上面代码中 getRecordIdByElement 时会取到 undefined (因为 document bufferer 字典内只缓存 element)，
    // 这时我们将 record.target 指向 `元素A` ，
    // record.html 取 `元素A` 的 innerHTML。
    // --------------------------------------------------------------------------------------------------
    // When the mutation happen with `elementA`,
    // which contains not only textNode, also element inside.
    // Note that MutationObserver will name the `target` to the textNode we modified,
    // therefore, we should get undefined of `getRecordIdByElement(target)` (since document bufferer didn't buffer textNode).
    // So we point record.target to `elementA`,
    // set `record.html = elementA.innerHTML` at the same time
    if (!record.target) {
      const parentEle = getRecordIdByElement(target.parentElement)
      // 如果这时候取不到 parentEle 或者 target.parentElement 为 null，则视该条记录作废
      // 这种情况会在删除整个 textNode 时发生，可以忽略，
      // 因为这个动作会额外的生成一个类型为 childList 的 MutationRecord
      // 交给 this.getNodesRecord 处理就好
      // ----------------------------------------------------------------
      // if (parentEle === null), means the textNode has been removed,
      // this mutation would produce a MutationRecord with type === 'childList',
      // just leave it to this.getNodesRecord to handle :)
      if (!parentEle) {
        return
      }
      record.target = parentEle
      record.html = target.parentElement.innerHTML
    } else {
      // use testConent instend of innerText(non-standard),
      // see also https://stackoverflow.com/questions/35213147/difference-between-textcontent-vs-innertext
      record.text = target.textContent
    }

    return record
  }

  /**
   * @Either:
   * when node added or removed,
   * @Or:
   * if a contenteditable textNode's text been all removed, type should be `childList`(remove #text),
   * later if you type/add some text in this empty textNode, the first mutation's type would be `childList`(add #text), fellows by `characterData`s
   **/
  private getNodesRecord({
    target,
    addedNodes,
    removedNodes,
    previousSibling,
    nextSibling
  }: MutationRecordX): DOMMutationRecord {
    let record = { add: [], remove: [] } as DOMMutationRecord
    record.target = getRecordIdByElement(target)

    if (previousSibling) {
      record.prev = getRecordIdByElement(previousSibling)
    }

    if (nextSibling) {
      record.next = getRecordIdByElement(nextSibling)
    }

    /** ------------------------------ Add or Remove nodes --------------------------------- */
    const { length: isAdd } = addedNodes
    const { length: isRemove } = removedNodes

    if (!isAdd && !isRemove) return

    // addnodes / removenodes could exist both
    record.type = DOMMutationTypes.node

    /** Add */
    this.nodesFilter(addedNodes).forEach(
      (node): void => {
        let nodeData = {} as NodeMutationData

        function getNodeHTML() {
          nodeData.html = node.outerHTML
        }

        switch (node.nodeName) {
          case '#text': {
            // add textNode
            // nodeValue: https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeValue
            nodeData.html = node.nodeValue
            if (target.childNodes.length) {
              nodeData.index = this.getNodeIndex(node.parentElement, node)
            }
            break
          }

          default: {
            const { parentElement, nodeValue } = node

            if (!parentElement) {
              // in case the node was the <html> element
              nodeData.html = nodeValue || node.outerHTML
              break
            }

            nodeData.index = this.getNodeIndex(parentElement, node)

            RecorderDocument.bufferNewElement({
              ele: node,
              beforeUnmark: getNodeHTML
            })
          }
        }

        if (nodeData.html === null) return

        record.add.push(nodeData)
      }
    )

    /** Remove */
    this.nodesFilter(removedNodes).forEach(
      (node): void => {
        let nodeData = {} as NodeMutationData

        switch (node.nodeName) {
          case '#text': {
            // 当删除一个 textNode 或 所有文本内容时
            // when delete a whole textNode
            nodeData.remaining = target.innerHTML
            break
          }

          default: {
            nodeData.target = getRecordIdByElement(node)
            if (nodeData.target === undefined) return
          }
        }

        record.remove.push(nodeData)
      }
    )

    // filter record which's addNodes and removeNode only contain SCRIPT or COMMENT
    if (!record.remove.length && !record.add.length) return
    if (record.target === undefined) return

    if (!record.remove.length) {
      delete record.remove
    }

    if (!record.add.length) {
      delete record.add
    }

    return record
  }

  // filter out comment and script
  private nodesFilter(nodeList: NodeList): HTMLElement[] {
    return Array.from(nodeList).filter(node => {
      const { nodeName, tagName } = node as HTMLElement
      return nodeName !== '#comment' && tagName !== 'SCRIPT'
    }) as HTMLElement[]
  }

  // get index of the node, attention that .childNodes return textNodes also
  private getNodeIndex(parentElement: HTMLElement, node: ChildNode) {
    return Array.from(parentElement.childNodes).indexOf(node)
  }

  install() {
    const Observer =
      (window as any).MutationObserver || (window as any).WebKitMutationObserver

    this.observer = new Observer((records: MutationRecord[]) => {
      const { onobserved } = this

      for (let record of records) {
        const DOMMutationRecord = this.process(record as MutationRecordX)

        if (DOMMutationRecord && onobserved) {
          onobserved(DOMMutationRecord)
        }
      }
    })

    this.observer.observe(document.documentElement, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true
    })

    _log('mutation installed')

    this.status.mutation = true
  }

  uninstall() {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }

    this.status.mutation = false
  }
}
