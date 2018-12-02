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
    public db: any 

    constructor(dbPath: string) {
        this.db = LevelDb.open(dbPath)
    }

    public list(key: string, callback: (error: Error | null, result?: Metric[]) => void) {

        let result: any[] = []

        this.db.createReadStream()
            .on('data', (data) => {
                if (data.key.split(':')[1] == key) {
                    result.push(data)
                }
            })
            .on('error', (err) => {callback(err)})
            .on('end', () => {callback(null, result)})
    }

    /*public get(key: string, callback: (error: Error | null, result?: Metric[]) => void) {

        let result: any[] = []

        this.db.createReadStream()
            .on('data', (data) => {
                if (data.key.split(':')[1] == key) {
                    result.push(data)
                }
            })
            .on('error', (err) => {callback(err)})
            .on('end', () => {callback(null, result)})
    }*/

    public save(key: string, metrics: Metric[], callback: (error: Error | null) => void) {

        const stream = WriteStream(this.db)

        if (!Array.isArray(metrics)) {
            metrics = [metrics]
        }

        stream.on('error', callback)
        stream.on('close', callback)

        metrics.forEach(m => {
            stream.write({ key: `metric:${key}:${m.timestamp}`, value: m.value })
        })

        stream.end(() => {
            callback
        })
    }

    public remove(key: any, callback: (error: Error | null) => void) {

      this.db.del(key, (err) => {
          if (err) console.log(err)
          callback(err)
      })
    }
}