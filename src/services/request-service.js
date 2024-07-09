import googleSheetsService from './google-sheets-service'
import axios from 'axios'
export default class requestService {
  constructor(id) {
    this.inventoryId = id
    this.svc = new googleSheetsService(import.meta.env.VITE_SHEETID)
  }

  insertRequest(request) {
    console.log(request)
    var data = {
      range: 'reservations!A1:H1',
      majorDimension: 'ROWS',
      values: [
        [
          'Data',
          new Date().toString('YYYY-MM-DD'),
          request.startDate,
          request.endDate,
          this.inventoryId,
          request.requestedQuantity,
          request.contactName,
          request.contactEmail,
          false
        ]
      ]
    }
    axios
      .post(
        `https://sheets.googleapis.com/v4/spreadsheets/${import.meta.env.VITE_SHEETID}/values/reservations!A1:H1:append`,
        data
      )
      .then((result) => {
        console.log(result)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  isRequestFeasible(request, qtyAvailable) {
    return new Promise((resolve, reject) => {
      let applicableDates = {}
      this.svc
        .GetSheetData(
          'reservations',
          `SELECT B,C,E WHERE D = ${request.id} AND  (B >=  date '${request.startDate}' OR B <= date '${request.endDate}') AND (C >=  date '${request.startDate}' OR C <= date '${request.endDate}') `
        )
        .then((result) => {
          result.forEach((val) => {
            for (var d = new Date(val.start); d <= new Date(val.end); d.setDate(d.getDate() + 1)) {
              if (!applicableDates[d.toDateString()]) {
                applicableDates[d.toDateString()] = val.requested_qty
              } else {
                applicableDates[d.toDateString()] += val.requested_qty
              }
            }
          })

          for (
            var d = new Date(request.startDate);
            d <= new Date(request.endDate);
            d.setDate(d.getDate() + 1)
          ) {
            if (applicableDates[d.toDateString()]) {
              if (qtyAvailable < request.requestedQuantity + applicableDates[d.toDateString()]) {
                resolve(false)
              }
            }
          }
          resolve(true)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
