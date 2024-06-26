import googleSheetsService from './google-sheets-service'
export default class requestService {
  constructor(id) {
    this.inventoryId = id
    this.svc = new googleSheetsService(import.meta.env.VITE_SHEETID)
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
