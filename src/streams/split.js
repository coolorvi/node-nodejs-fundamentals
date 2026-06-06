import fs from "fs"
import { Transform } from "stream";

const split = async () => {
  // Write your code here
  // Read source.txt using Readable Stream
  // Split into chunk_1.txt, chunk_2.txt, etc.
  // Each chunk max N lines (--lines CLI argument, default: 10)
  const args = process.argv.slice(2)
  let countLines = 10

  if (args.indexOf("--lines") !== -1 && Number(args[args.indexOf("--lines") + 1]) !== 0 && Number(args[args.indexOf("--lines") + 1]) !== NaN) {
    countLines = Number(args[args.indexOf("--lines") + 1])
  }

  if (!fs.existsSync("source.txt")) {
    throw new Error("FS operation failed")
  }
  const readStream = fs.createReadStream("source.txt")

  let buffer = ""
  let numCurFile = 1
  let curFile = "chunk_1.txt"
  let curFileCountLines = 0

  let stream = fs.createWriteStream(curFile)

  const separationLines = new Transform({
    transform(chunk, _, callback) {
      buffer = buffer + chunk.toString()

      const lines = buffer.split("\n")
      buffer = lines.pop()

      for (const line of lines) {
        if (curFileCountLines === countLines) {
          curFileCountLines = 0
          stream.end()
          numCurFile++
          curFile = `chunk_${numCurFile}.txt`
          stream = fs.createWriteStream(curFile)
        }
        stream.write(`${line}\n`)
        curFileCountLines++
      }
      callback()
    },
    flush(callback) {
      if (buffer) {
        if (curFileCountLines === countLines) {
          curFileCountLines = 0
          stream.end()
          numCurFile++
          curFile = `chunk_${numCurFile}.txt`
          stream = fs.createWriteStream(curFile)
        }
        stream.write(`${buffer}`)
      }
      stream.end()
      callback()
    }
  })

  readStream.pipe(separationLines)
};

await split();
