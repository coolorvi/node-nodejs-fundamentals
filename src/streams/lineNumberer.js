import { stdout } from "process";
import { Transform } from "stream"

const lineNumberer = () => {
  // Write your code here
  // Read from process.stdin
  // Use Transform Stream to prepend line numbers
  // Write to process.stdout
  let buffer = ""
  let lineNumber = 1

  const numberLine = new Transform({
    transform(chunk, _, callback) {
      buffer += chunk.toString()

      const lines = buffer.split("\n")
      buffer = lines.pop()

      for (const line of lines) {
        this.push(`${lineNumber++} | ${line}\n`)
      }

      callback()
    },

    flush(callback) {
      if (buffer) {
        this.push(`${lineNumber++} | ${buffer}\n`)
      }
      callback()
    }
  })

  process.stdin.pipe(numberLine).pipe(stdout)
};

lineNumberer();
