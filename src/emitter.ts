import { EventEmitter } from 'events'

class FileManagerEmitter extends EventEmitter {}

const emitter = new FileManagerEmitter()
export default emitter
