//image service a singleton, thus no constructor needed or wanted
export default {
  formatImageUrl(url) {
    if (url.length == 0) {
      return import.meta.env.VITE_NOIMAGEID //no image
    }

    if (url.indexOf('dropbox' >= 0)) {
      return url.toString().replace('&dl=0', '&raw=1')
    }

    if (url.indexOf('file') > 0 && url.indexOf('google')) {
      //its the file link to the google drive
      let imageUrl = url.split('/')
      let id = undefined

      if (imageUrl.indexOf('d') >= 0) {
        id = imageUrl[imageUrl.indexOf('d') + 1]
        return `https://drive.google.com/file/d/${id}/preview`
      }
    }
    return url
  }
}
