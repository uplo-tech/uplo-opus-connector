import * as FileSaver from 'file-saver'
import emitter from '../emitter'

// a case when we need to silently download a file using Javascript, and prompt to save it afterwards
function promptToSaveBlob({ content, name, downloadUrl }) {
  if (downloadUrl) {
    const iframeId = 'oc-fm--filemanager-download-iframe'
    let iframeDOMNode = document.getElementById(iframeId)

    if (!iframeDOMNode) {
      iframeDOMNode = document.createElement('iframe')
      iframeDOMNode.style.display = 'none'
      iframeDOMNode.id = iframeId
      document.body.appendChild(iframeDOMNode)
    }

    ;(iframeDOMNode as any).src = downloadUrl
  } else {
    const blob = new Blob([content], { type: 'octet/stream' })
    FileSaver.saveAs(blob, name)
  }
}

// a case when we trigger a direct download in browser
// used in google drive' connector
function triggerHiddenForm({ downloadUrl, target = '_self' }) {
  const form = document.createElement('form')
  form.action = downloadUrl
  form.target = target
  form.method = 'GET'

  document.body.appendChild(form)
  form.submit()
  document.body.removeChild(form)
}

async function saveLocalFile(filename: string) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject('no path received after 60s')
    }, 60000)
    emitter.on('downloadpath', (data: string) => {
      console.log('got download path', data)
      if (data) {
        clearTimeout(timeout)
        resolve(data)
      } else {
        console.log('no path received')
        reject('no path received')
      }
    })
    emitter.emit('downloadrequestpath', filename)
  })
}

export { promptToSaveBlob, triggerHiddenForm, saveLocalFile }
