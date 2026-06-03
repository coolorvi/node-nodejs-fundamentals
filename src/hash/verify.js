import fs from "fs"
import path from "path"
import crypto from "crypto"

function getHash(filename) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256")
    const stream = fs.createReadStream(filename)

    stream.on("data", chunk => hash.update(chunk))
    stream.on("end", () => resolve(hash.digest("hex")))
    stream.on("error", reject)
  })
}

const verify = async () => {
  // Write your code here
  // Read checksums.json
  // Calculate SHA256 hash using Streams API
  // Print result: filename — OK/FAIL
  if (!fs.existsSync("checksums.json")) {
    throw new Error("FS operation failed")
  }

  const checksumsPath = path.resolve("checksums.json")
  const checksumsUndecoded = await fs.promises.readFile(checksumsPath, "utf8")

  const checksums = JSON.parse(checksumsUndecoded)

  for (const [filename, expextedHash] of Object.entries(checksums)) {
    const hash = await getHash(filename)

    if (hash === expextedHash) {
      console.log(`${filename} — OK`)
    } else {
      console.log(`${filename} — FAIL`)
    }
  }
};

await verify();
