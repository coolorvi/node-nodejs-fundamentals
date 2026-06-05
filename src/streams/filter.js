import { Transform } from "stream"
import { stdout } from "process"

const filter = () => {
  // Write your code here
  // Read from process.stdin
  // Filter lines by --pattern CLI argument
  // Use Transform Stream
  // Write to process.stdout
  const args = process.argv.slice(2)

  if (args.indexOf("--pattern") === -1) {
    throw new Error("Missing argument")
  }

  const pattern = args[args.indexOf("--pattern") + 1]

  let buffer = ""

  const matchPattern = new Transform({
    transform(chunk, _, callback) {
      buffer += chunk.toString()

      const lines = buffer.split("\n")
      buffer = lines.pop()

      for (const line of lines) {
        if (line.includes(pattern)) {
          this.push(`${line}\n`)
        }
      }
      callback()
    },
    flush(callback) {
      if (buffer) {
        if (buffer.includes(pattern)) {
          this.push(`${buffer}\n`)
        }
      }
      callback()
    }
  })

  process.stdin.pipe(matchPattern).pipe(stdout)
};

filter();
