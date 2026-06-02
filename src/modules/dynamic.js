const dynamic = async () => {
  // Write your code here
  // Accept plugin name as CLI argument
  // Dynamically import plugin from plugins/ directory
  // Call run() function and print result
  // Handle missing plugin case
  const arg = process.argv.slice(2)

  let plugin = ""

  try {
    plugin = await import(`../modules/plugins/${arg[0]}.js`)
  } catch {
    console.log("Plugin not found")
    process.exit(1)
  }

  console.log(plugin.run())
};

await dynamic();
