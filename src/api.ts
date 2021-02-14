import * as s from 'uplo.js'
import emitter from './emitter'
import { Client } from '@uplo-tech/uplojs-lib'
import * as agent from 'superagent'
const connect = s.connect
const path = require('path')
const fs = require('fs.promises')
const readDirRecursive = require('fs-readdir-recursive')

import cache from './cache'
import apiOptions from 'apiOptions'

let Uplo = null
let UploAddress = ''
const hasSignedIn = () => true

const initClient = async options => {
  const { uploClientConfig } = options
  try {
    Uplo = new Client(uploClientConfig)
    return {
      apiInitialized: true,
      apiSignedIn: hasSignedIn()
    }
  } catch (e) {
    console.log("Can't init Uplo Client", e)
    return {
      apiInitialized: false,
      apiSignedIn: false
    }
  }
}

const init = async options => {
  return await initClient(options)
}

// measurePerformance takes the method name and t0 t1 items to generate a log
// output. It will filter times lower than the default set time in ms.
const measurePerformance = (name, t0, t1) => {
  // const time = t1 - t0
  // if (time > 250) {
  // console.log(`Call for ${name} took ${time} milliseconds.`)
  // }
}

// const FILE_CACHE_KEY = 'FILE_CACHE'
// const FILE_CACHE_EXPIRE = 1000
const getFiles = async () => {
  // if (cache.get(FILE_CACHE_KEY)) {
  //   return cache.get(FILE_CACHE_KEY)
  // }
  const t0 = performance.now()

  const { files } = await Uplo.call('/renter/files')
  const filesAppendRoot = files.map((f: UploResource) => {
    return {
      ...f,
      uplopath: path.posix.join('root', f.uplopath)
    }
  })
  // cache.set(FILE_CACHE_KEY, filesAppendRoot, FILE_CACHE_EXPIRE)
  const t1 = performance.now()
  measurePerformance('getFiles', t0, t1)
  return filesAppendRoot as UploResource[]
}

// const DIR_KEY = 'DIRECTORY_CACHE_'
// const DIR_CACHE_EXPIRE = 5000
const getDirectory = async (p): Promise<DirResponse> => {
  console.log('getDirectory for path', p)
  // if (cache.get(DIR_KEY + p)) {
  //   return cache.get(DIR_KEY + p)
  // }
  const t0 = performance.now()
  const dir: DirResponse = await Uplo.call(`/renter/dir/${p}`)
  // cache.set(DIR_KEY + p, dir, DIR_CACHE_EXPIRE)

  const t1 = performance.now()
  measurePerformance('getDirectory', t0, t1)
  return dir
}

// Returns 'root' id
const getRootId = async () => {
  return 'root'
}

// The resource object returned by Uplo
interface UploResource {
  uplopath: string
  localpath: string
  filesize: number
  available: boolean
  renewing: boolean
  redundancy: number
  uploadedbytes: number
  uploadprogress: number
  expiration: number
  recoverable: boolean
  accesstime: string
  changetime: string
  createtime: string
  modtime: string
}

const NORMALIZE_RESOURCE_CACHE_KEY = 'NORMALIZE_RESOURCE_CACHE_KEY_'
const NORMALIZE_RESOURCE_EXPIRE = 5000
const normalizedResource = async (resource: UploResource, filetype = 'file') => {
  const t0 = performance.now()
  const cacheKey = NORMALIZE_RESOURCE_CACHE_KEY + resource.uplopath
  if (cache.get(cacheKey)) {
    return cache.get(cacheKey)
  }
  // const parents = await getParentsForId(null, resource.uplopath)
  const res = {
    createdDate: Date.parse(resource.createtime),
    modifiedDate: Date.parse(resource.changetime),
    id: resource.uplopath,
    title: path.posix.basename(resource.uplopath),
    type: filetype,
    redundancy: resource.redundancy,
    mimeType: 'application/octet-stream',
    downloadUrl:
      UploAddress +
      '/renter/stream/' +
      resource.uplopath
        .split(path.posix.sep)
        .slice(1)
        .join(path.posix.sep),
    size: resource.filesize,
    parents: [],
    capabilities: {
      canDelete: true,
      canRename: false,
      canCopy: false,
      canEdit: false,
      canDownload: resource.available
    },
    uploResource: resource
  }
  cache.set(cacheKey, res, NORMALIZE_RESOURCE_EXPIRE)
  const t1 = performance.now()
  measurePerformance('normalizedResource', t0, t1)
  return res
}

const removeResources = async (apiOptions, selectedResources = []) => {
  const t0 = performance.now()
  for (const x of selectedResources) {
    const uploPath = cleanRootFromPath(x.id)
    if (x.type === 'file') {
      await deleteFileById(uploPath)
    }
    if (x.type === 'dir') {
      await deleteFolderById(uploPath)
    }
  }
  const t1 = performance.now()
  measurePerformance('removeResources', t0, t1)
  return true
}

const cleanRootFromPath = (p: string) => {
  const t0 = performance.now()
  const res = p
    .split(path.posix.sep)
    .slice(1)
    .join(path.posix.sep)
  const t1 = performance.now()
  measurePerformance('cleanRootFromPath', t0, t1)
  return res
}

const getUploResourceById = async id => {
  console.log('gettingUplo Resource', id)
  const t0 = performance.now()
  const cleanPath = cleanRootFromPath(id)
  // const parentPath = path.posix.dirname(cleanPath)
  console.log('cleanPath', cleanPath)
  const dir = await getDirectory(cleanPath)
  const t1 = performance.now()
  measurePerformance('getUploByResourceId', t0, t1)
  return (dir.files || []).find(s => s.uplopath === cleanPath)
}

interface UploDir {
  aggregatenumfiles: number
  aggregatenumstuckchunks: number
  aggregatesize: number
  health: number
  lasthealthchecktime: string
  maxhealth: number
  minredundancy: number
  mostrecentmodtime: string
  stuckhealth: number
  numfiles: number
  numsubdirs: number
  uplopath: string
}

interface DirResponse {
  directories: UploDir[]
  files: UploResource[]
}

const getUploDirById = async id => {
  const t0 = performance.now()
  const p = id
    .split(path.posix.sep)
    .slice(1)
    .join(path.posix.sep)
  const dir: DirResponse = await getDirectory(p)
  const t1 = performance.now()
  measurePerformance('getUploDirById', t0, t1)
  return dir
}

const getCapabilitiesForResource = (options, resource) => {
  return resource.capabilities || []
}

const createFolder = async (apiOptions, resourceId, folderName) => {
  const t0 = performance.now()
  console.log('createFolder', resourceId, folderName)
  const pathToCreate = path.posix.join(cleanRootFromPath(resourceId), folderName)
  console.log('pathToCreate', pathToCreate)
  try {
    const res = await Uplo.call({
      url: `/renter/dir/${pathToCreate}`,
      method: 'POST',
      qs: {
        action: 'create'
      }
    })
    const t1 = performance.now()
    measurePerformance('createFolder', t0, t1)
    console.log('results are', res)
  } catch (e) {
    console.log('error creating uplo folder', e)
  }
}

const deleteFileById = async uplopath => {
  const t0 = performance.now()
  try {
    console.log('deleting', uplopath)
    const result = await Uplo.call({
      url: '/renter/delete/' + encodeURI(uplopath),
      timeout: 20000,
      method: 'POST'
    })
    const t1 = performance.now()
    measurePerformance('deleteFileById', t0, t1)
    return result
  } catch (e) {
    console.log('error deleting file', e)
  }
}

const deleteFolderById = async uplopath => {
  const t0 = performance.now()
  try {
    console.log('deleting folder', uplopath)
    const result = await Uplo.call({
      url: '/renter/dir/' + encodeURI(uplopath),
      timeout: 20000,
      method: 'POST',
      qs: {
        action: 'delete'
      }
    })
    const t1 = performance.now()
    measurePerformance('deleteFolderById', t0, t1)
    return result
  } catch (e) {
    console.log('error deleting file', e)
  }
}

const uploadFileToId = (uplopath, source) => {
  return Uplo.call({
    url: '/renter/upload/' + encodeURI(uplopath),
    timeout: 20000,
    method: 'POST',
    qs: {
      source
    }
  })
}

const sumFileSize = (files: UploResource[]) => {
  const t0 = performance.now()
  const res = (files || []).reduce((x, y) => x + y.filesize, 0)
  const t1 = performance.now()
  measurePerformance('sumFileSize', t0, t1)
  return res
}

const sumUploadBytes = (files: UploResource[]) => {
  const t0 = performance.now()
  const res = (files || []).reduce((x, y) => x + y.uploadedbytes, 0)
  const t1 = performance.now()
  measurePerformance('sumUploadBytes', t0, t1)
  return res
}

const topOfList = (n: number[]) => {
  const t0 = performance.now()
  const res = Math.max(...n)
  const t1 = performance.now()
  measurePerformance('topOfList', t0, t1)
  return res
}

// const NORMALIZE_DIR_CACHE_KEY = 'NORMALIZE_DIR_CACHE_KEY_'
// const NORMALIZE_DIR_CACHE_EXPIRE = 5000
const normalizedDirResource = async id => {
  // const cacheKey = NORMALIZE_DIR_CACHE_KEY + id
  // if (cache.get(cacheKey)) {
  //   return cache.get(cacheKey)
  // }
  const t0 = performance.now()
  const dirPath = cleanRootFromPath(id)
  console.log('normalizing dir with id', id)
  const resource = await getUploDirById(id)
  const selectedDir = resource.directories.filter(i => i.uplopath === dirPath)[0]
  const dirObj: UploResource = {
    uplopath: id,
    localpath: id,
    filesize: selectedDir.aggregatesize,
    available: false,
    renewing: true,
    expiration: 1000,
    recoverable: true,
    redundancy: selectedDir.minredundancy,
    uploadedbytes: sumUploadBytes(resource.files),
    uploadprogress: 100,
    accesstime: new Date(
      topOfList((resource.directories || []).map(n => Date.parse(n.mostrecentmodtime)))
    ).toISOString(),
    changetime: new Date(
      topOfList((resource.directories || []).map(n => Date.parse(n.mostrecentmodtime)))
    ).toISOString(),
    createtime: new Date(
      topOfList((resource.directories || []).map(n => Date.parse(n.mostrecentmodtime)))
    ).toISOString(),
    modtime: new Date(
      topOfList((resource.directories || []).map(n => Date.parse(n.mostrecentmodtime)))
    ).toISOString()
  }
  const res = await normalizedResource(dirObj, 'dir')
  const t1 = performance.now()
  measurePerformance('normalizedDirResource', t0, t1)
  // cache.set(cacheKey, res, NORMALIZE_DIR_CACHE_EXPIRE)
  return res
}

const createFileResource = async (resource, id) => {
  return {
    createdDate: Date.parse(resource.createtime),
    modifiedDate: Date.parse(resource.changetime),
    id,
    title: path.posix.basename(resource.uplopath),
    type: 'file',
    redundancy: resource.redundancy,
    mimeType: 'application/octet-stream',
    downloadUrl:
      UploAddress +
      '/renter/stream/' +
      resource.uplopath
        .split(path.posix.sep)
        .slice(1)
        .join(path.posix.sep),
    size: resource.filesize,
    parents: [],
    capabilities: {
      canDelete: true,
      canRename: false,
      canCopy: false,
      canEdit: false,
      canDownload: resource.available
    },
    uploResource: resource
  }
}

const createDirResource = async (resource, id) => {
  const t0 = performance.now()
  const time = new Date(resource.mostrecentmodtime).toISOString()
  const dirObj: UploResource = {
    uplopath: resource.uplopath,
    localpath: id,
    filesize: resource.aggregatesize,
    available: false,
    renewing: true,
    expiration: 1000,
    recoverable: true,
    redundancy: resource.minredundancy,
    uploadedbytes: 0,
    uploadprogress: 100,
    accesstime: time,
    changetime: time,
    createtime: time,
    modtime: time
  }
  // console.log('dirObj', dirObj)
  // const parents = await createParentResources(id)
  const res = {
    createdDate: Date.parse(dirObj.createtime),
    modifiedDate: Date.parse(dirObj.changetime),
    id,
    title: dirObj.uplopath === '' ? 'root' : path.posix.basename(dirObj.uplopath),
    type: 'dir',
    redundancy: dirObj.redundancy,
    mimeType: 'application/octet-stream',
    downloadUrl:
      UploAddress +
      '/renter/stream/' +
      resource.uplopath
        .split(path.posix.sep)
        .slice(1)
        .join(path.posix.sep),
    size: dirObj.filesize,
    parents: [],
    capabilities: {
      canDelete: true,
      canRename: false,
      canCopy: false,
      canEdit: false,
      canDownload: resource.available
    },
    uploResource: resource
  }
  // console.log('create FR', res)
  const t1 = performance.now()
  measurePerformance('createDirResource', t0, t1)
  return res
}

const createRootResource = async () => {
  const date = Date.now().toString()
  const rootObj: UploResource = {
    uplopath: 'root',
    localpath: 'root',
    filesize: null,
    available: false,
    renewing: true,
    expiration: 1000,
    recoverable: true,
    redundancy: 1,
    uploadedbytes: 0,
    uploadprogress: 100,
    accesstime: date,
    changetime: date,
    createtime: date,
    modtime: date
  }
  const res = await normalizedResource(rootObj, 'dir')
  return res
}

// Returns the normalized resource given an id (or path, in this case)
const getResourceById = async (options, id) => {
  // console.log('getting resource by id', id)
  const t0 = performance.now()
  if (id === 'root') {
    const date = Date.now().toString()
    const rootObj: UploResource = {
      uplopath: 'root',
      localpath: 'root',
      filesize: null,
      available: false,
      renewing: true,
      expiration: 1000,
      recoverable: true,
      redundancy: 1,
      uploadedbytes: 0,
      uploadprogress: 100,
      accesstime: date,
      changetime: date,
      createtime: date,
      modtime: date
    }
    // console.log('start normalize resource')
    const res = await normalizedResource(rootObj, 'dir')
    // console.log('finish normalizing rouescr')
    return res
  }
  // console.log('start get uplo resource')
  const file = await getUploResourceById(id)
  // console.log('finish get uplo resource')
  if (file) {
    // console.log('aw333')
    const resource = await normalizedResource(file)
    // console.log('awegaweg')
    const t1 = performance.now()
    measurePerformance('getResourceById', t0, t1)
    return resource
  } else {
    // console.log('GRBI normalizing dir resource', id)
    const resource = await normalizedDirResource(id)
    const t1 = performance.now()
    measurePerformance('getResourceById', t0, t1)
    return resource
  }
}

const normalizeDirResource = async id => {}

// My assumption is that getParentsForId is currently only used to build a path
// to resolve at the bottom of the FM. Therefore we should be able to create a fake parent free.
const createFakeParent = async parentPath => {
  const uploPath = cleanRootFromPath(parentPath)

  const date = Date.now().toString()
  const dirObj: UploResource = {
    uplopath: uploPath,
    localpath: parentPath,
    filesize: 0,
    available: false,
    renewing: true,
    expiration: 1000,
    recoverable: true,
    redundancy: 0,
    uploadedbytes: 0,
    uploadprogress: 100,
    accesstime: date,
    changetime: date,
    createtime: date,
    modtime: date
  }
  // console.log('dirObj', dirObj)
  // const parents = await createParentResources(id)
  const res = {
    createdDate: Date.parse(dirObj.createtime),
    modifiedDate: Date.parse(dirObj.changetime),
    id: parentPath,
    title: dirObj.uplopath === '' ? 'root' : path.posix.basename(dirObj.uplopath),
    type: 'dir',
    redundancy: dirObj.redundancy,
    mimeType: 'application/octet-stream',
    downloadUrl:
      UploAddress +
      '/renter/stream/' +
      parentPath
        .split(path.posix.sep)
        .slice(1)
        .join(path.posix.sep),
    size: dirObj.filesize,
    parents: [],
    capabilities: {
      canDelete: true,
      canRename: false,
      canCopy: false,
      canEdit: false,
      canDownload: false
    },
    uploResource: dirObj
  }
  return res
}

const getParentsForId = async (options, id) => {
  console.log('getting parents for id ', id)
  let currentId = id
  let res = []
  let mem = {}
  while (currentId !== 'root') {
    const parentPath = path.posix.dirname(currentId)
    currentId = parentPath
    const parentResource = await createFakeParent(parentPath)
    res = [parentResource].concat(res)
    // const res = await createParentResources(allFiles, parentPath, [parentResource].concat(result))
  }
  console.log('getParentsForId', res)
  return res
}

// const getParentsForId = async (options, id) => {
//   console.log('getting parents for id ', id)
//   let currentId = id
//   let res = []
//   let mem = {}
//   while (currentId !== 'root') {
//     const parentPath = path.posix.dirname(currentId)
//     currentId = parentPath
//     const dirPath = cleanRootFromPath(parentPath)
//     console.log('dirPath is', dirPath)
//     // try to get from mem
//     let parentUploResource = null
//     if (mem[dirPath]) {
//       parentUploResource = mem[dirPath]
//     } else {
//       const dir: DirResponse = await getDirectory(dirPath)
//       parentUploResource = dir.directories.filter(i => i.uplopath === dirPath)[0]
//       console.log('got resource', parentUploResource)
//       mem[dirPath] = parentUploResource
//     }
//     const parentResource = await createDirResource(parentUploResource, parentPath)
//     res = [parentResource].concat(res)
//     // const res = await createParentResources(allFiles, parentPath, [parentResource].concat(result))
//   }
//   console.log('getParentsForId', res)
//   return res
// }

// Returns a list of the parent resources going back to the root
// /media/movies/avengers.mp4 -> [Resource<movies>, Resource<media>]
// const getParentsForIdLegacy = async (options, id, result = []) => {
//   if (id === 'root') {
//     return result
//   }
//   const parentPath = path.posix.dirname(id)

//   const parent = await normalizedDirResource(parentPath)
//   const res = await getParentsForIdLegacy(options, parentPath, [parent].concat(result))
//   const t1 = performance.now()
//   return res
// }

// getChildrenForId is only called on dirs
const getChildrenForId = async (options, { id, sortBy = 'title', sortDirection = 'ASC' }) => {
  const t0 = performance.now()
  let results = {}
  const dirPath = cleanRootFromPath(id)
  const allFiles = await getDirectory(dirPath)

  for (const x of allFiles.files || []) {
    const finalPath = path.posix.join('root', x.uplopath)
    const resource = await createFileResource(x, finalPath)

    if (!(finalPath in results)) {
      results[finalPath] = resource
    }
  }

  for (const y of allFiles.directories || []) {
    const finalPath = path.posix.join('root', y.uplopath)
    const resource = await createDirResource(y, finalPath)

    if (!(finalPath in results) && y.uplopath !== dirPath) {
      results[finalPath] = resource
    }
  }

  const finalResourceList = Object.keys(results).map(x => results[x])
  const t1 = performance.now()
  measurePerformance('getChildrenForId', t0, t1)
  return finalResourceList
}

const getResourceName = (options, resource) => {
  return resource.title
}

// Get the nearest parent id for a specified resource
const getParentIdForResource = async (options, resource) => {
  if (resource.parents.length) {
    return 'root'
  }
  return resource.parents[0].id
}

const downloadResource = async ({ resource, params, onProgress, i = 0, l = 1 }) => {
  const { downloadUrl, direct, mimeType, fileName } = params

  let res

  try {
    res = await agent
      .get('http://' + downloadUrl)
      .responseType('blob')
      .on('progress', event => {
        onProgress((i * 100 + event.percent) / l)
      })
  } catch (err) {
    throw new Error(`failed to download resource: ${err}`)
  }
  return {
    downloadUrl,
    direct,
    file: res.body,
    mimeType
  }
}

interface UploDownloadObject {
  destination: string
  destinationtype: string
  filesize: number
  length: number
  offset: number
  uplopath: string
  completed: boolean
  endtime: string
  error: string
  received: number
  starttime: string
  starttimeunix: number
  totaldatatransferred: number
}

interface UploUploadObject {
  accesstime: string
  available: boolean
  changetime: string
  ciphertype: string
  createtime: string
  expiration: number
  filesize: number
  health: number
  localpath: string
  maxhealth: number
  maxhealthpercent: number
  modtime: string
  numstuckchunks: number
  ondisk: boolean
  recoverable: boolean
  redundancy: number
  renewing: boolean
  uplopath: string
  stuck: boolean
  stuckhealth: number
  uploadedbytes: number
  uploadprogress: number
}

const allDownloads = async () => {
  const t0 = performance.now()
  const { downloads } = await Uplo.call('/renter/downloads')
  const filteredDownloads = (downloads || []).filter(
    (d: UploDownloadObject) => d.destinationtype === 'file'
  )
  const map = {}
  // We run this through a loop to remove streaming objects bug from uplod.
  filteredDownloads.forEach((d: UploDownloadObject) => {
    if (map.hasOwnProperty(d.uplopath)) {
      if (map[d.uplopath].starttime < d.starttime) {
        map[d.uplopath] = d
      }
    } else {
      map[d.uplopath] = d
    }
  })
  const results = Object.values(map)
  const t1 = performance.now()
  measurePerformance('allDownloads', t0, t1)
  return results as UploDownloadObject[]
}

const allUploads = async () => {
  const t0 = performance.now()
  const { files } = await Uplo.call('/renter/files')
  const t1 = performance.now()
  measurePerformance('allUploads', t0, t1)
  return (files || []) as UploUploadObject[]
}

const queueDownload = async (uplopath: string, downloadpath: string) => {
  const t0 = performance.now()
  const data = await Uplo.call({
    url: `/renter/download/${uplopath}`,
    qs: {
      destination: downloadpath,
      async: true
    }
  })
  const t1 = performance.now()
  measurePerformance('queueDownload', t0, t1)
  return data
}

// const uploadAction = async (paths)  => {

//   const onFail = err => emitter.emit('notification', err)

//   // this function will go through each path and upload it to Uplo
//   for (let eachPath of paths) {
//     // first, let's first out if it's a dir or file
//     const fileStatus = await fs.stat(eachPath)
//     // Handler for directories
//     if (fileStatus.isDirectory()) {
//       // first we'll recursively get the subpaths of the dir
//       const files = readDirRecursive(eachPath)
//       // loop over each subpath and create the uplopath to be uploaded
//       for (let subPath of files) {
//         const folderName = path.basename(eachPath)
//         const uploadPath = path.join(eachPath, subPath)
//         const combinedPath = path.posix.join(resource.id, folderName, subPath).split(path.posix.sep)
//         const uploPath = combinedPath.slice(1).join(path.posix.sep)
//         try {
//           await uploadFileToId(uploPath, uploadPath)
//         } catch (err) {
//           console.log('error uploading file', err)
//         }
//       }
//       // onFail('directories are not support just yet')
//     } else {
//       // default handler for files
//       const fileName = path.basename(eachPath)
//       const combinedPath = path.posix.join(resource.id, fileName).split(path.posix.sep)
//       const uploPath = combinedPath.slice(1).join(path.posix.sep)
//       try {
//         await uploadFileToId(uploPath, eachPath)
//       } catch (err) {
//         console.log('error uploading file', err)
//         onFail(err)
//       }
//     }
//   }
// }

export default {
  init,
  hasSignedIn,
  getResourceById,
  getChildrenForId,
  getRootId,
  getParentsForId,
  getParentIdForResource,
  getCapabilitiesForResource,
  getResourceName,
  downloadResource,
  allDownloads,
  allUploads,
  uploadFileToId,
  cleanRootFromPath,
  queueDownload,
  createFolder,
  removeResources
}
