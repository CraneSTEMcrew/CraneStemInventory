import emailjs from '@emailjs/browser'
export default class emailService {
  constructor() {
    this.keyPublic = import.meta.env.VITE_EMAILPUBLICKEY
    this.keyService = import.meta.env.VITE_EMAILSERVICEKEY
    this.internalTemplate = import.meta.env.VITE_EMAILTEMPLATEID
  }
  createTable(request) {
    let table =
      '<table style="border:1px solid #1C6EA4;background-color:#EEEEEE;width:100%;text-align:left;border-collapse:collapse">'
    table +=
      '<thead style="background: #1C6EA4;border-bottom: 2px solid #444444;color:#FFFFFF"><tr><th>Date</th><th>Item Id</th><th>Item</th><th>Quantity</th><th>Start Date</th><th>End Date</th></tr></thead>'
    table += '<tr>'
    table += `<td>${request.requestDate}</td>`
    table += `<td>${request.id}</td>`
    table += `<td>${request.itemDescription}</td>`
    table += `<td>${request.requestedQuantity}</td>`
    table += `<td>${request.startDate}</td>`
    table += `<td>${request.endDate}</td>`
    table += '</tr>'
    table += '</table>'
    return table
  }
  createConfirmationEmail(request) {
    let emailMessage = `<p>The following request has been created:</p>`
    emailMessage += `Requested by: <b>${request.contactName}</b><br>`
    emailMessage += `Email: <b>${request.contactEmail}</b><br>`
    emailMessage += `<p>${this.createTable(request)}</p>`
    emailMessage += '<p>Once the reservation is approved, you will receive a confirmation email</p>'

    let templateParams = {
      message: emailMessage,
      to_email: request.contactEmail
    }

    return new Promise((resolve, reject) => {
      emailjs.send(this.keyService, this.internalTemplate, templateParams, this.keyPublic).then(
        () => {
          resolve(true)
          //   showModal.value = false
          //   alertComponent.value.showAlert(
          //     'Request Created',
          //     `Your request for ${request.requestedQuantity} ${request.itemDescription} has been submitted.  A confirmation email has been sent to ${request.contactEmail}`,
          //     alertType.SUCCESS
          //   )
        },
        (error) => {
          console.log('FAILED...', error)
          reject(false)
          //   showModal.value = false
          //   alertComponent.value.showAlert(
          //     'Error',
          //     'An Error Occurred.  Please contact stem@stem.com for further assistance',
          //     alertType.ERROR
          //   )
        }
      )
    })
  }
  createInternalNotificationEmail(request) {
    let emailMessage = `<p>The following request has been created:</p>`
    emailMessage += `Requested by: <b>${request.contactName}</b><br>`
    emailMessage += `Email: <b>${request.contactEmail}</b><br>`
    emailMessage += `<p>${this.createTable(request)}</p>`
    emailMessage +=
      '<p>The reservation needs to be approved in the inventory sheet before this will show as checked out</p>'

    console.log(emailMessage)
    let templateParams = {
      message: emailMessage
    }

    return new Promise((resolve, reject) => {
      emailjs.send(this.keyService, this.internalTemplate, templateParams, this.keyPublic).then(
        () => {
          resolve(true)
        },
        (error) => {
          console.log('FAILED...', error)
          reject(false)
        }
      )
    })
  }
}
