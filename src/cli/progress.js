const progress = () => {
  // Write your code here
  // Simulate progress bar from 0% to 100% over ~5 seconds
  // Update in place using \r every 100ms
  // Format: [████████████████████          ] 67%
  let duration = 5000
  let interval = 100
  let length = 30
  let color = ""

  const args = process.argv.slice(2)

  if (args.indexOf("--duration") !== -1) {
    duration = Number(args[args.indexOf("--duration") + 1])
  }
  if (args.indexOf("--interval") !== -1) {
    interval = Number(args[args.indexOf("--interval") + 1])
  }
  if (args.indexOf("--length") !== -1) {
    length = Number(args[args.indexOf("--length") + 1])
  }
  if (args.indexOf("--color") !== -1) {
    color = args[args.indexOf("--color") + 1]
  }

  let colorCode = ""

  if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    colorCode = `\x1b[38;2;${r};${g};${b}m`
  }

  const startTime = Date.now()

  const timer = setInterval(() => {
    const elapsed = Date.now() - startTime

    const progress = Math.min(elapsed / duration, 1)

    const filled = Math.round(length * progress);
    const empty = length - filled;

    process.stdout.write(`\r[${colorCode}${"█".repeat(filled)}${"\x1b[0m"}${" ".repeat(empty)}] ${Math.round(progress * 100)}%`)

    if (elapsed >= duration) {
      process.stdout.write(`\r[${colorCode}${"█".repeat(length)}${"\x1b[0m"}] 100%`)
      clearInterval(timer)
      console.log("\nDone!")
    }
  }, interval)
};

progress();
