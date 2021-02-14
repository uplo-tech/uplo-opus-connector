import getMess from '../translations'
import emitter from '../emitter'
import nanoid from 'nanoid'
import iconsSvg from '../icons-svg'
import notifUtils from '../utils/notifications'
import { getIcon } from '../icons'
import api from '../api'
import { triggerHiddenForm, promptToSaveBlob, saveLocalFile } from '../utils/download'
import { getDownloadParams } from '../uplo-utils'
const path = require('path')

const label = 'download'

async function handler(apiOptions, actions) {
  const { updateNotifications, getSelectedResources, getNotifications } = actions

  const getMessage = getMess.bind(null, apiOptions.locale)

  const notificationId = label
  const notificationChildId = nanoid()

  const onFail = err => console.log('Failed to download:', err)

  let downloadPath = null
  try {
    const resources = getSelectedResources()
    downloadPath = await saveLocalFile(
      resources.length > 1 ? 'Multi Download Will Save With Original Filenames' : resources[0].title
    )
    if (resources.length === 1) {
      const res = resources[0]
      const params = getDownloadParams(res)
      const p = api.cleanRootFromPath(params.uplopath)
      const result = await api.queueDownload(p, downloadPath)
      console.log('getting download', downloadPath)
    } else {
      const dir = path.dirname(downloadPath)
      resources.forEach(async r => {
        const params = getDownloadParams(r)
        const downloadPath = path.posix.join(dir, params.fileName)
        const p = api.cleanRootFromPath(params.uplopath)
        const result = await api.queueDownload(p, downloadPath)
        console.log('multi download', result)
      })
    }
  } catch (err) {
    onFail(err)
  }
}

const updateNotifications = async (apiOptions, actions) => {
  const { updateNotifications, getSelectedResources, getNotifications } = actions
  const ds = await api.allDownloads()
  const getMessage = getMess.bind(null, apiOptions.locale)
  const itemsDownloading = ds.filter(x => !x.completed).length
  // if more than 5 items downloading, show as one notification
  if (itemsDownloading > 5) {
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
            title: `${itemsDownloading} Items Downloading`,
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
        title: getMessage('downloadingItems', { quantity: itemsDownloading }),
        children: newChildren
      })
      return updateNotifications(newNotifications)
    }
    // create a new notification
    const childElement = {
      elementType: 'NotificationProgressItem',
      elementProps: {
        title: `${itemsDownloading} Items Downloading`,
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
      title: getMessage('downloadingItems', { quantity: itemsDownloading }),
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
      const progress = (d.received / d.length) * 100

      const notificationExists = (notification && notification.children
        ? notification.children
        : []
      ).filter(c => c.element.elementProps.path === d.uplopath)

      // if the child notification already exists, just update progress
      if (notificationExists.length > 0) {
        const n = notificationExists[0]
        const notificationChildId = n.id
        // if the download is completed, remove the notification
        if (d.completed) {
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
        if (d.completed) {
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
              ? getMessage('downloadingItems', { quantity: newChildren.length })
              : getMessage('downloadingItem'),
          children: newChildren
        }

        const newNotifications = notification
          ? notifUtils.updateNotification(notifications, label, newNotification)
          : notifUtils.addNotification(notifications, label, newNotification)
        return updateNotifications(newNotifications)
      }
    })
    // // create notification
    // ds.forEach(d => {
    //   const notifications = getNotifications()
    //   const notification = notifUtils.getNotification(notifications, label)
    //   const title = path.basename(d.uplopath)
    //   const progress = (d.received / d.length) * 100
    //   const notificationExists = (notification && notification.children
    //     ? notification.children
    //     : []
    //   ).filter(c => c.element.elementProps.path === d.uplopath)
    //   // if the child notification already exists, just update progress
    //   if (notificationExists.length > 0) {
    //     const n = notificationExists[0]
    //     const notificationChildId = n.id
    //     // if the download is completed, remove the notification
    //     if (d.completed) {
    //       const notificationChildrenCount = notification.children.length
    //       let newNotifications
    //       if (notificationChildrenCount > 1) {
    //         newNotifications = notifUtils.updateNotification(notifications, label, {
    //           children: notifUtils.removeChild(notification.children, notificationChildId)
    //         })
    //       } else {
    //         newNotifications = notifUtils.removeNotification(notifications, label)
    //       }
    //       return updateNotifications(newNotifications)
    //     } else {
    //       // else update the notification for progress
    //       const child = notifUtils.getChild(notification.children, notificationChildId)
    //       const newChild = {
    //         ...child,
    //         element: {
    //           ...child.element,
    //           elementProps: {
    //             ...child.element.elementProps,
    //             progress
    //           }
    //         }
    //       }
    //       const newChildren = notifUtils.updateChild(
    //         notification.children,
    //         notificationChildId,
    //         newChild
    //       )
    //       const newNotifications = notifUtils.updateNotification(notifications, label, {
    //         children: newChildren
    //       })
    //       return updateNotifications(newNotifications)
    //     }
    //   } else {
    //     // if completed return
    //     if (d.completed) {
    //       return
    //     }
    //     // create a new notification
    //     const childElement = {
    //       elementType: 'NotificationProgressItem',
    //       elementProps: {
    //         title,
    //         path: d.uplopath,
    //         progress,
    //         icon: getIcon({ title })
    //       }
    //     }
    //     const notificationChildId = nanoid()
    //     const newChildren = notifUtils.addChild(
    //       (notification && notification.children) || [],
    //       notificationChildId,
    //       childElement
    //     )
    //     const newNotification = {
    //       title:
    //         newChildren.length > 1
    //           ? getMessage('downloadingItems', { quantity: newChildren.length })
    //           : getMessage('downloadingItem'),
    //       children: newChildren
    //     }
    //     const newNotifications = notification
    //       ? notifUtils.updateNotification(notifications, label, newNotification)
    //       : notifUtils.addNotification(notifications, label, newNotification)
    //     updateNotifications(newNotifications)
    //   }
    // })
  }
}

export default (apiOptions, actions) => {
  const localeLabel = getMess(apiOptions.locale, label, null)
  const { getSelectedResources } = actions
  const hoistNotifications = async () => {
    await updateNotifications(apiOptions, actions)
  }
  emitter.on('startdownloadpoll', () => {
    console.log('polling downloads')
    hoistNotifications()
  })
  return {
    id: label,
    icon: { svg: iconsSvg.fileDownload },
    label: localeLabel,
    shouldBeAvailable: () => {
      const selectedResources = getSelectedResources()
      return selectedResources.length > 0 && selectedResources[0].type !== 'dir'
    },
    handler: () => handler(apiOptions, actions),
    availableInContexts: ['row', 'toolbar']
  }
}
