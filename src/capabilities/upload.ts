import api from '../api'
import notifUtils from '../utils/notifications'
import { getIcon } from '../icons'
import nanoid from 'nanoid'
import icons from '../icons-svg'
import getMess from '../translations'
import { readLocalFile } from '../utils/upload'
import emitter from '../emitter'
const fs = require('fs.promises')
const path = require('path')
const readDirRecursive = require('fs-readdir-recursive')

const label = 'upload'

async function handler(apiOptions, actions) {
  let paths = null
  try {
    paths = await readLocalFile(apiOptions.uploadType)
  } catch (e) {
    console.log('catching on fail for fetching path', e)
    return
  }

  uploadLogic(actions)(paths)
}

function uploadLogic(actions) {
  return async paths => {
    const { navigateToDir, updateNotifications, getResource, getNotifications } = actions

    const onFail = err => emitter.emit('notification', err)

    const resource = getResource()
    // this function will go through each path and upload it to Uplo
    for (let eachPath of paths) {
      // first, let's first out if it's a dir or file
      const fileStatus = await fs.stat(eachPath)
      // Handler for directories
      if (fileStatus.isDirectory()) {
        // first we'll recursively get the subpaths of the dir
        const files = readDirRecursive(eachPath)
        // loop over each subpath and create the uplopath to be uploaded
        for (let subPath of files) {
          const folderName = path.basename(eachPath)
          const uploadPath = path.join(eachPath, subPath)
          const combinedPath = path.posix
            .join(resource.id, folderName, subPath)
            .split(path.posix.sep)
          const uploPath = combinedPath.slice(1).join(path.posix.sep)
          try {
            await api.uploadFileToId(uploPath, uploadPath)
          } catch (err) {
            console.log('error uploading file', err)
          }
        }
        navigateToDir(resource.id, null, false, false)
        // onFail('directories are not support just yet')
      } else {
        // default handler for files
        const fileName = path.basename(eachPath)
        const combinedPath = path.posix.join(resource.id, fileName).split(path.posix.sep)
        const uploPath = combinedPath.slice(1).join(path.posix.sep)
        try {
          await api.uploadFileToId(uploPath, eachPath)
          navigateToDir(resource.id, null, false, false)
        } catch (err) {
          console.log('error uploading file', err)
          onFail(err)
        }
      }
    }
  }
}

const updateNotifications = async (apiOptions, actions) => {
  const {
    updateNotifications,
    getSelectedResources,
    navigateToDir,
    getNotifications,
    getResource
  } = actions
  const getMessage = getMess.bind(null, apiOptions.locale)
  // fetch all uploads from /renter/files
  const ds = await api.allUploads()

  // filter number of files that are less than 2.5 redundancy
  const itemsUploading = ds.filter(x => x.redundancy < 2.5).length
  // loop for more than 5 items uploading
  if (itemsUploading > 5) {
    const notifications = getNotifications()
    const notification = notifUtils.getNotification(notifications, label)
    // check if old notification exists, and remove them from the list
    const oldNotificationsExist = (notification && notification.children
      ? notification.children
      : []
    ).filter(c => c.element.elementProps.path !== '_multipleitems')
    if (oldNotificationsExist.length > 0) {
      let newNotifications = notifUtils.removeNotification(notifications, label)
      return updateNotifications(newNotifications)
    }
    // decide whether we need to create a new notification or not
    const notificationExists = (notification && notification.children
      ? notification.children
      : []
    ).filter(c => c.element.elementProps.path === '_multipleitems')
    if (notificationExists.length > 0) {
      const n = notificationExists[0]
      const notificationChildId = n.id
      // else update the notification for progress
      const child = notifUtils.getChild(notification.children, notificationChildId)
      const newChild = {
        ...child,
        element: {
          ...child.element,
          elementProps: {
            ...child.element.elementProps,
            title: `${itemsUploading} Items Uploading`,
            progress: 11
          }
        }
      }
      const newChildren = notifUtils.updateChild(
        notification.children,
        notificationChildId,
        newChild
      )
      const newNotifications = notifUtils.updateNotification(notifications, label, {
        title: getMessage('uploadingItems', { quantity: itemsUploading }),
        children: newChildren
      })
      return updateNotifications(newNotifications)
    }
    // create a new notification
    const childElement = {
      elementType: 'NotificationProgressItem',
      elementProps: {
        title: `${itemsUploading} Items Uploading`,
        path: '_multipleitems',
        progress: 10,
        icon: getIcon({ title: 'archive.zip' })
      }
    }

    const notificationChildId = nanoid()
    const newChildren = notifUtils.addChild(
      (notification && notification.children) || [],
      notificationChildId,
      childElement
    )

    const newNotification = {
      title: getMessage('uploadingItems', { quantity: itemsUploading }),
      children: newChildren
    }

    const newNotifications = notification
      ? notifUtils.updateNotification(notifications, label, newNotification)
      : notifUtils.addNotification(notifications, label, newNotification)
    return updateNotifications(newNotifications)
  } else {
    // loop for individual file notifications
    const notifications = getNotifications()
    const notification = notifUtils.getNotification(notifications, label)

    const multiuploadExists = (notification && notification.children
      ? notification.children
      : []
    ).filter(c => c.element.elementProps.path === '_multipleitems')
    // if the multi-items exist, remove it from tree
    if (multiuploadExists.length > 0) {
      let newNotifications = notifUtils.removeNotification(notifications, label)
      updateNotifications(newNotifications)
    }

    // check for removed notifications
    const childrenExists = notification && notification.children ? notification.children : []
    if (childrenExists.length > ds.length) {
      let newNotifications = notifUtils.removeNotification(notifications, label)
      updateNotifications(newNotifications)
    }

    ds.forEach(d => {
      const notifications = getNotifications()
      const notification = notifUtils.getNotification(notifications, label)
      const title = path.basename(d.uplopath)
      const progress = d.uploadprogress

      const notificationExists = (notification && notification.children
        ? notification.children
        : []
      ).filter(c => c.element.elementProps.path === d.uplopath)

      // if the child notification already exists, just update progress
      if (notificationExists.length > 0) {
        const n = notificationExists[0]
        const notificationChildId = n.id
        // if the download is completed, remove the notification
        if (d.available) {
          const notificationChildrenCount = notification.children.length
          let newNotifications

          if (notificationChildrenCount > 1) {
            const newChildren = notifUtils.removeChild(notification.children, notificationChildId)
            newNotifications = notifUtils.updateNotification(notifications, label, {
              title:
                newChildren.length > 1
                  ? getMessage('uploadingItems', { quantity: newChildren.length })
                  : getMessage('uploadingItem'),
              children: newChildren
            })
          } else {
            newNotifications = notifUtils.removeNotification(notifications, label)
          }
          const resource = getResource()
          navigateToDir(resource.id, null, false, false)
          return updateNotifications(newNotifications)
        } else {
          // else update the notification for progress
          const child = notifUtils.getChild(notification.children, notificationChildId)
          const newChild = {
            ...child,
            element: {
              ...child.element,
              elementProps: {
                ...child.element.elementProps,
                progress
              }
            }
          }
          const newChildren = notifUtils.updateChild(
            notification.children,
            notificationChildId,
            newChild
          )
          const newNotifications = notifUtils.updateNotification(notifications, label, {
            children: newChildren
          })
          return updateNotifications(newNotifications)
        }
      } else {
        // if we believe the file is done uploading then return
        if (d.redundancy >= 2.5 || d.uploadprogress >= 100) {
          return
        }
        // otherwise we'll create a new notification
        const childElement = {
          elementType: 'NotificationProgressItem',
          elementProps: {
            title,
            path: d.uplopath,
            progress,
            icon: getIcon({ title })
          }
        }

        const notificationChildId = nanoid()
        const newChildren = notifUtils.addChild(
          (notification && notification.children) || [],
          notificationChildId,
          childElement
        )

        const newNotification = {
          title:
            newChildren.length > 1
              ? getMessage('uploadingItems', { quantity: newChildren.length })
              : getMessage('uploadingItem'),
          children: newChildren
        }

        const newNotifications = notification
          ? notifUtils.updateNotification(notifications, label, newNotification)
          : notifUtils.addNotification(notifications, label, newNotification)
        return updateNotifications(newNotifications)
      }
    })
  }
}

export const uploadFile = (apiOptions, actions) => {
  const localeLabel = getMess(apiOptions.locale, label, null)
  const hoistNotifications = async () => {
    await updateNotifications(apiOptions, actions)
  }
  emitter.on('startuploadpoll', () => {
    console.log('polling uploads')
    hoistNotifications()
  })

  return {
    id: label,
    icon: { svg: icons.fileUpload },
    label: localeLabel,
    shouldBeAvailable: apiOptions => true,
    availableInContexts: ['files-view', 'new-button'],
    handler: () => handler({ ...apiOptions, uploadType: 'file' }, actions)
  }
}
export const uploadFolder = (apiOptions, actions) => {
  const localeLabel = 'Upload Folder'
  return {
    id: label,
    icon: { svg: icons.folderUpload },
    label: localeLabel,
    shouldBeAvailable: apiOptions => true,
    availableInContexts: ['files-view', 'new-button'],
    handler: () => handler({ ...apiOptions, uploadType: 'folder' }, actions),
    uploadLogic: uploadLogic(actions)
  }
}
