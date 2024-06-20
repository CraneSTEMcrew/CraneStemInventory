export class inventoryRequest {
  startDate = undefined
  endDate = undefined
  requestedQuantity = 0
  contactName = ''
  contactEmail = ''
  approved = false

  constructor(inventoryId, inventoryName) {
    this.requestDate = new Date().toLocaleDateString()
    this.id = inventoryId
    this.itemDescription = inventoryName
  }
}
