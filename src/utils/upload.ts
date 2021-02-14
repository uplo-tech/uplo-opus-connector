import emitter from '../emitter'

async function readLocalFile(uploadType) {
  return new Promise((resolve, reject) => {
    emitter.on('uploadpath', (data: string[]) => {
      console.log('received upload path', data)
      const to = setTimeout(() => {
        reject('no path received after 60s')
      }, 60000)
      if (data) {
        clearTimeout(to)
        resolve(data)
      } else {
        console.log('rejecting no path received')
        reject('no path received')
      }
    })
    emitter.emit('uploadrequestpath', uploadType)
    // const uploadInput = document.createElement('input')
    // const reader = new FileReader()

    // uploadInput.addEventListener('change', e => {
    //   const file = uploadInput.files[0]
    //   reader.addEventListener('load', e => {
    //     resolve({
    //       content: (e as any).target.result,
    //       type: file.type,
    //       name: file.name
    //     })
    //   })
    //   reader.addEventListener('error', err => reject(err))
    //   reader.readAsBinaryString(file)
    // })

    // uploadInput.type = 'file'
    // document.body.appendChild(uploadInput)
    // uploadInput.click()
    // document.body.removeChild(uploadInput)
  })
}

export { readLocalFile }
