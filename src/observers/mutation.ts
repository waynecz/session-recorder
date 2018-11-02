import { ObserverClass } from 'models/observers'
import {
  DOMMutationRecord,
  DOMMutationTypes,
  NodeMutationData
} from 'models/observers/mutation'
import { MutationRecordX } from 'models/friday'

import { ID_KEY } from 'constants'
import FridayDocument from 'tools/document'
import { _log } from 'tools/helpers'

const { getFridayIdByNode } = FridayDocument

window.DC = FridayDocument

/**
 * Observe DOM change such as DOM-add/remove text-change attribute-change
 * and generate an Record
 **/
export default class DOMMutationObserver implements ObserverClass {
  public name: string = 'DOMMutationObserver'
  private observer: MutationObserver
  public active: boolean

  constructor(public onobserved) {
    this.install()
  }

  private process(mutationRecord: MutationRecordX) {
    const { target, attributeName } = mutationRecord

    // ignore script tag's mutation
    if (target && target.tagName === 'SCRIPT') return

    switch (mutationRecord.type) {
      case 'attributes': {
        // ignore fridayId mutate
        if (attributeName !== ID_KEY) return

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
    record.target = getFridayIdByNode(target)

    record.type = DOMMutationTypes.attr
    record.attr.k = attributeName
    record.attr.v = target.getAttribute(attributeName)

    return record
  }

  // when textNode's innerText change
  private getTextRecord({ target }: MutationRecordX): DOMMutationRecord {
    let record = {} as DOMMutationRecord
    record.target = getFridayIdByNode(target)

    record.type = DOMMutationTypes.text
    // use testConent instend of innerText(non-standard),
    // see also https://stackoverflow.com/questions/35213147/difference-between-textcontent-vs-innertext
    record.text = target.textContent

    return record
  }

  /**
   * @Either:
   * invoke when node added or removed,
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
    let record = {} as DOMMutationRecord
    record.target = getFridayIdByNode(target)

    if (previousSibling) {
      record.prev = getFridayIdByNode(previousSibling)
    }

    if (nextSibling) {
      record.next = getFridayIdByNode(nextSibling)
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
        record.add = []

        function getNodeHTML() {
          nodeData.html = node.outerHTML
        }

        switch (node.nodeName) {
          case '#text': {
            // nodeValue: https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeValue
            nodeData.html = node.nodeValue
            record.add.push(nodeData)
            break
          }

          default: {
            const { parentElement, nodeValue } = node

            if (!parentElement) {
              // in case the node was the <html> element
              // TODO: find out when should the nodeData.index === -1
              nodeData.html = nodeValue
              break
            }

            nodeData.index = this.getNodeIndex(parentElement, node)

            FridayDocument.storeNewNode({
              node,
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
        record.remove = []

        switch (node.nodeName) {
          case '#text': {
            nodeData.html = node.nodeValue
            break
          }

          default: {
            nodeData.target = getFridayIdByNode(node)
            if (nodeData.target === null) {
              console.log('TCL: node', node)
            }
          }
        }

        record.remove.push(nodeData)
      }
    )

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
    console.log('TCL: install -> Observer', Observer)

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

    this.active = true
  }

  uninstall() {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }

    this.active = false
  }
}
