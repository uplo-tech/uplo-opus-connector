import iconsSvg from '../icons-svg'
import getMess from '../translations'
import sanitizeFilename from 'sanitize-filename'
const label = 'createFolder'
import api from '../api'

function handler(apiOptions, actions) {
  const getMessage = getMess.bind(null, apiOptions.locale)

  const { showDialog, hideDialog, navigateToDir, getResource } = actions

  const rawDialogElement = {
    elementType: 'SetNameDialog',
    elementProps: {
      onHide: hideDialog,
      onSubmit: async folderName => {
        const resource = getResource()
        const resourceChildren = await api.getChildrenForId(apiOptions, { id: resource.id })

        const alreadyExists = resourceChildren.some(o => o.title === folderName)
        if (alreadyExists) {
          return getMessage('fileExist', { name: folderName })
        } else {
          hideDialog()
          await api.createFolder(apiOptions, resource.id, folderName)
          console.log('navigatin to resource with id ', resource.id)
          navigateToDir(resource.id, null, false, false)
        }
        return null
      },
      onValidate: async folderName => {
        if (!folderName) {
          return getMessage('emptyName')
        } else if (folderName === 'CON') {
          return getMessage('doNotRespectBill')
        } else if (folderName.length >= 255) {
          return getMessage('tooLongName')
        } else if (folderName.trim() !== sanitizeFilename(folderName.trim())) {
          return getMessage('notAllowedCharacters')
        }
        return null
      },
      headerText: getMessage('folderName'),
      submitButtonText: getMessage('create')
    }
  }

  showDialog(rawDialogElement)
}

export default (apiOptions, actions) => {
  const { getSelectedResources } = actions
  return {
    id: label,
    icon: { svg: iconsSvg.createNewFolder },
    label: 'Create Folder',
    shouldBeAvailable: () => true,
    handler: () => handler(apiOptions, actions),
    availableInContexts: ['files-view', 'new-button']
  }
}
