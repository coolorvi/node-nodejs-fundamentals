import fs from "fs"
import path from "path"

async function checkExt(absPathFile, relPathFile, listPathes, file, ext) {
  const stats = await fs.promises.stat(absPathFile)

  if (stats.isDirectory()) {
    const files = await fs.promises.readdir(absPathFile)
    for (const fileDir of files) {
      const relPathFileDir = path.join(relPathFile, fileDir)
      const absPathFileDir = path.join(absPathFile, fileDir)
      await checkExt(absPathFileDir, relPathFileDir, listPathes, fileDir, ext)
    }
    return
  }

  if (path.extname(absPathFile) === ext) {
    listPathes.push(relPathFile)
  }
}

const findByExt = async () => {
  // Write your code here
  // Recursively find all files with specific extension
  // Parse --ext CLI argument (default: .txt)
  if (!fs.existsSync("workspace")) {
    throw new Error("FS operation failed")
  }

  const args = process.argv.slice(2);

  let ext = "txt";

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--ext") {
      ext = args[i + 1];
    }
  }

  ext = "." + ext;

  const workspacePath = path.resolve("workspace")
  const files = await fs.promises.readdir(workspacePath)

  const listPathes = []

  for (const file of files) {
    const absPathFile = path.join(workspacePath, file)
    const relPathFile = file
    await checkExt(absPathFile, relPathFile, listPathes, file, ext)
  }

  listPathes.sort()

  for (const pathFile of listPathes) {
    console.log(pathFile)
  }
}
await findByExt();
