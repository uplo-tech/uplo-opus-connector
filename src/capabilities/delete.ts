import iconsSvg from '../icons-svg'
import getMess from '../translations'
import sanitizeFilename from 'sanitize-filename'
const label = 'remove'
import api from '../api'

function handler(apiOptions, actions) {
  const {
    showDialog,
    hideDialog,
    navigateToDir,
    updateNotifications,
    getSelectedResources,
    getResource,
    getNotifications
  } = actions

  const getMessage = getMess.bind(null, apiOptions.locale)

  const selectedResources = getSelectedResources()

  const dialogFilesText =
    selectedResources.length > 1
      ? `${selectedResources.length} ${getMessage('files')}`
      : `"${selectedResources[0].title}"`

  const dialogNameText = getMessage('reallyRemove', { files: dialogFilesText })

  const rawDialogElement = {
    elementType: 'ConfirmDialog',
    elementProps: {
      onHide: hideDialog,
      onSubmit: async () => {
        hideDialog()
        try {
          await api.removeResources(apiOptions, selectedResources)
          const resource = getResource()
          navigateToDir(resource.id, null, false, false)
        } catch (err) {
          // onFailError({
          //   getNotifications,
          //   label: getMessage(label),
          //   notificationId: 'delete',
          //   updateNotifications
          // });
          console.log(err)
        }
      },
      headerText: getMessage('remove'),
      messageText: dialogNameText,
      cancelButtonText: getMessage('cancel'),
      submitButtonText: getMessage('confirm')
    }
  }

  showDialog(rawDialogElement)
}

export default (apiOptions, actions) => {
  const { getSelectedResources } = actions
  return {
    id: label,
    icon: { svg: iconsSvg.delete },
    label: 'Delete',
    shouldBeAvailable: () => true,
    handler: () => handler(apiOptions, actions),
    availableInContexts: ['row', 'toolbar']
  }
}
