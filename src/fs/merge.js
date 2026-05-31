import fs from "fs"
import path from "path"

const merge = async () => {
  // Write your code here
  // Default: read all .txt files from workspace/parts in alphabetical order
  // Optional: support --files filename1,filename2,... to merge specific files in provided order
  // Concatenate content and write to workspace/merged.txt
  if (!fs.existsSync("workspace/parts")) {
    throw new Error("FS operation failed")
  }

  const args = process.argv.slice(2)

  let listEntries = []

  if (args[0] === "--files") {
    if (args[1] === undefined) {
      throw new Error("FS operation failed")
    }
    const listArgs = args[1].split(",")
    for (const arg of listArgs) {
      const pathFile = path.join("workspace", "parts", arg)
      if (!fs.existsSync(pathFile)) {
        throw new Error("FS operation failed")
      }
      const contentFile = await fs.promises.readFile(pathFile, "utf8")
      listEntries.push({name: arg, content: contentFile})
    }
  } else {
    const entries = await fs.promises.readdir("workspace/parts", {withFileTypes: true, recursive: true})

    for (const entry of entries) {
      if (entry.isFile() && path.extname(entry.name) === ".txt") {
        const pathFile = path.join(entry.parentPath, entry.name)
        const contentFile = await fs.promises.readFile(pathFile, "utf8")

        listEntries.push({name: entry.name, content: contentFile})
      }
    }

    listEntries.sort((a, b) => a.name.localeCompare(b.name))
  }

  if (listEntries.length === 0) {
    throw new Error("FS operation failed")
  }

  let listContents = []

  for (const entry of listEntries) {
    listContents.push(entry.content)
  }

  const contents = listContents.join("")

  await fs.promises.writeFile("workspace/merged.txt", contents)
};

await merge();
