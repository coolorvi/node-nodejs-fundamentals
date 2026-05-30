import fs from 'fs';
import path from 'path';

async function scan(curPath, snapshot) {
  const stats = fs.statSync(curPath)
  if (stats.isDirectory()) {
    snapshot.entries.push({"path": path.relative("./workspace", curPath), "type": "directory"})
    const files = await fs.promises.readdir(curPath)
    for (const file of files) {
      const curPathFile = path.join(curPath, file)
      await scan(curPathFile, snapshot)
    }
    return
  }
  const contentFile = await fs.promises.readFile(curPath)
  snapshot.entries.push({"path": path.relative("./workspace", curPath), "type": "file", "size": stats.size, "content": contentFile.toString("base64")})
}

const snapshot = async () => {
  // Write your code here
  // Recursively scan workspace directory
  // Write snapshot.json with:
  // - rootPath: absolute path to workspace
  // - entries: flat array of relative paths and metadata
  if (!fs.existsSync("./workspace")) {
    throw new Error("FS operation failed");
  }

  const workspacePath = path.resolve("./workspace");
  const stats = fs.statSync(workspacePath);

  if (!stats.isDirectory()) {
    throw new Error("FS operation failed");
  }

  const snapshot = {
    rootPath: workspacePath,
    entries: []
  }

  const files = await fs.promises.readdir(workspacePath);

  let curPath = "./workspace";

  for (const file of files) {
    const curPathFile = path.join(curPath, file)
    await scan(curPathFile, snapshot)
  }

  const json = JSON.stringify(snapshot, null, 2)
  await fs.promises.writeFile(path.join(path.dirname(workspacePath), "snapshot.json"), json)
};

await snapshot();
