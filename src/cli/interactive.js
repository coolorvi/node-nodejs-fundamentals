import readline from "readline"

const interactive = () => {
  // Write your code here
  // Use readline module for interactive CLI
  // Support commands: uptime, cwd, date, exit
  // Handle Ctrl+C and unknown commands
  const rl = readline.createInterface({input: process.stdin, output: process.stdout})

  rl.setPrompt("> ")
  rl.prompt()

  rl.on("SIGINT", () => {
    console.log("Goodbye!")
    process.exit(0)
  })

  rl.on("close", () => {
    console.log("Goodbye!")
    process.exit(0)
  })

  rl.on("line", (input) => {
    switch (input) {
      case "uptime":
        console.log(`Uptime: ${process.uptime().toFixed(2)}s`)
        break
      case "cwd":
        console.log(process.cwd())
        break
      case "date":
        let now = new Date()
        console.log(now.toISOString())
        break
      case "exit":
        console.log("Goodbye!")
        process.exit(0)
      default:
        console.log("Unknown command")
        break
    }
    rl.prompt()
  })
};

interactive();
