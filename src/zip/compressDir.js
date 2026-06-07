import fs from "fs"
import zlib from "zlib"
import { Readable } from "stream"
import { pipeline } from "stream/promises"

async function* infFiles(entries) {
  for (const entry of entries) {
    const stat = await fs.promises.stat(`workspace/toCompress/${entry}`)
    if (stat.isDirectory()) {
      continue
    }
    yield `PATH:${entry}\nSIZE:${stat.size}\n\n`
    const content = fs.createReadStream(`workspace/toCompress/${entry}`)
    for await (const chunk of content) {
      yield chunk
    }
  }
}

const compressDir = async () => {
  // Write your code here
  // Read all files from workspace/toCompress/
  // Compress entire directory structure into archive.br
  // Save to workspace/compressed/
  // Use Streams API
  if (!fs.existsSync("workspace/toCompress")) {
    throw new Error("FS operation failed")
  }
  const entries = await fs.promises.readdir("workspace/toCompress/", {recursive: true})

  const br = zlib.createBrotliCompress()

  await fs.promises.mkdir("workspace/compressed/", {recursive: true})
  const out = fs.createWriteStream("workspace/compressed/archive.br")

  const gen = infFiles(entries)

  await pipeline(Readable.from(gen), br, out)
};

await compressDir();
