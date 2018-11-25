import {LevelDb} from './leveldb'
import WriteStream from 'level-ws'

export class Metric {
  public timestamp: Date
  public value: number

  constructor(ts: string, v: number) {
    this.timestamp = new Date(ts)
    this.value = v
  }
}

export class MetricsHandler {
  private db: any 

  constructor(dbPath: string) {
    this.db = LevelDb.open(dbPath)
  }

  public get(callback: (error: Error | null, result?: Metric[]) => void) {

    const stream = this.db.createReadStream()
    
    let result: any[] = []

    stream.on('data', (data) => {result.push(data)})

    stream.on('error', callback)
    stream.on('close', callback)

    stream.on('end', () => {
        this.db.close()
        callback(null, result)
    })
  }

  public save(key: number, metrics: Metric[], callback: (error: Error | null) => void) {
    
    const stream = WriteStream(this.db)

    stream.on('error', callback)
    stream.on('close', callback)

    metrics.forEach(m => {
      stream.write({ key: `metric:${key}:${m.timestamp}`, value: m.value })
    })

    stream.end(() => {
        this.db.close
    })
  }

  public remove(key: any, callback: (error: Error | null) => void) {

      this.db.del(key, (err) => {
          if (err) console.log(err)
          this.db.close()
          callback(err)
      })
  }
}