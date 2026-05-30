import fs from "fs"
import path from "path"

const restore = async () => {
  // Write your code here
  // Read snapshot.json
  // Treat snapshot.rootPath as metadata only
  // Recreate directory/file structure in workspace_restored
  if (!fs.existsSync("snapshot.json")) {
    throw new Error("FS operation failed")
  }

  const snapshotPath = path.resolve("snapshot.json")
  const snapshotUndecoded = await fs.promises.readFile(snapshotPath, "utf8")

  const snapshot = JSON.parse(snapshotUndecoded)

  if (fs.existsSync("workspace_restored")) {
    throw new Error("FS operation failed")
  }

  await fs.promises.mkdir("workspace_restored")
  const workspacePath = path.resolve("workspace_restored")

  for (const entry of snapshot.entries) {
    const filePath = path.join(workspacePath, entry.path)

    if (entry.type === "directory") {
      await fs.promises.mkdir(filePath)
      continue
    }

    const buffer = Buffer.from(entry.content, "base64")

    await fs.promises.writeFile(filePath, buffer)
  }
};

await restore();
