import axios from 'axios'
export default class googleSheetsService {
  constructor(sheetId) {
    this.id = sheetId
    this.baseURL = `https://docs.google.com/spreadsheets/d/${this.id}/gviz/tq?`
  }

  createRequest(request) {
    let requestSheetName = import.meta.env.VITE_REQUESTSHEET
    let updateURL = `https://sheets.googleapis.com/v4/spreadsheets/${this.id}/values/${requestSheetName}:append`
    let requestBody = {
      range: requestSheetName,
      values: [
        request.requestDate,
        request.startDate,
        request.endDate,
        request.id,
        request.requestedQuantity,
        request.contactName,
        request.contactEmail,
        request.approved
      ]
    }

    axios.post(updateURL, requestBody).then((result) => {
      console.log(result)
    })
  }

  getSheetTotal(sheetName, query) {
    let url = `${this.baseURL}&sheet=${encodeURIComponent(sheetName)}&tq=${encodeURIComponent('Select count(A)')}`
    if (query) {
      url += encodeURIComponent(` ${query}`)
    }
    return new Promise((resolve, reject) => {
      axios
        .get(url)
        .then((result) => {
          resolve(this.parseEvaluatedResponse(result.data))
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  //get Function
  GetSheetData(sheetName, query, pageSize, pageNumber, sortBy) {
    var offset = pageNumber == 1 ? 0 : pageSize * (pageNumber - 1)
    let pagedQuery = pageSize
      ? `${query} ORDER BY ${sortBy.column} LIMIT ${pageSize} OFFSET ${offset}`
      : query

    let url = `${this.baseURL}&sheet=${encodeURIComponent(sheetName)}&tq=${encodeURIComponent(pagedQuery)}`

    return new Promise((resolve, reject) => {
      axios
        .get(url)
        .then((result) => {
          resolve(this.parseResponse(result.data))
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  //gets the first result of the search, used for details by ID column
  getFirstRecord(sheetName, colVal, val) {
    let url = `${this.baseURL}&sheet=${encodeURIComponent(sheetName)}&tq=WHERE ${colVal}=${val} LIMIT 1`
    return new Promise((resolve, reject) => {
      axios
        .get(url)
        .then((result) => {
          let detailResult = this.parseResponse(result.data)
          if (detailResult && detailResult.length === 0) {
            reject(`Could not find a record for '${val}'`)
          }
          resolve(detailResult[0])
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  parseEvaluatedResponse(res) {
    const jsData = JSON.parse(res.substring(47).slice(0, -2))
    const rows = jsData.table.rows
    if (rows.length == 0) return 0
    return rows[0].c[0].v
  }
  parseResponse(res) {
    const jsData = JSON.parse(res.substring(47).slice(0, -2))
    let data = []
    const columns = jsData.table.cols
    const rows = jsData.table.rows
    let rowObject
    let cellData
    let propName

    for (let r = 0, rowMax = rows.length; r < rowMax; r++) {
      rowObject = {}
      for (let c = 0, colMax = columns.length; c < colMax; c++) {
        cellData = rows[r]['c'][c]
        propName = columns[c].label
        if (cellData === null) {
          rowObject[propName] = ''
        } else if (typeof cellData['v'] == 'string' && cellData['v'].startsWith('Date')) {
          rowObject[propName] = new Date(cellData['f'])
        } else {
          rowObject[propName] = cellData['v']
        }
      }
      data.push(rowObject)
    }
    return data
  }
}
