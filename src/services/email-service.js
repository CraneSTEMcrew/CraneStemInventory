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
      '<thead style="border:1px solid #1C6EA4;border-collapse:collapse;background: #1C6EA4;border-bottom: 2px solid #444444;color:#FFFFFF"><tr><th style="border:1px solid #1C6EA4;border-collapse:collapse;">Date</th><th style="border:1px solid #1C6EA4;border-collapse:collapse;">Item Id</th><th style="border:1px solid #1C6EA4;border-collapse:collapse;">Item</th><th>Quantity</th><th style="border:1px solid #1C6EA4;border-collapse:collapse;">Start Date</th><th style="border:1px solid #1C6EA4;border-collapse:collapse;">End Date</th></tr></thead>'
    table += '<tr>'
    table += `<td style="border:1px solid #1C6EA4;border-collapse:collapse;">${request.requestDate}</td>`
    table += `<td style="border:1px solid #1C6EA4;border-collapse:collapse;">${request.id}</td>`
    table += `<td style="border:1px solid #1C6EA4;border-collapse:collapse;">${request.itemDescription}</td>`
    table += `<td style="border:1px solid #1C6EA4;border-collapse:collapse;">${request.requestedQuantity}</td>`
    table += `<td style="border:1px solid #1C6EA4;border-collapse:collapse;">${request.startDate}</td>`
    table += `<td style="border:1px solid #1C6EA4;border-collapse:collapse;">${request.endDate}</td>`
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

    let templateParams = {
      message: emailMessage,
      to_email: import.meta.env.VITE_SERVICEEMAIL
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
