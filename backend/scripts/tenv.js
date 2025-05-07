const fs = require("fs");
const path = require("path");
global.__root = process.cwd();

const envPath = path.join(__root, ".env");
const exampleEnvPath = path.join(__root, ".env.template");

// ANSI color codes
const RESET = "\x1b[0m";
const CYAN = "\x1b[36m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";

// ASCII Banner
console.log(CYAN + BOLD + `
______________________ ___________   ____ 
\\__    ___/\\_   _____/ \\      \\   \\ /   / 
  |    |    |    __)_  /   |   \\   Y   /  
  |    |    |        \\/    |    \\     /   
  |____|   /_______  /\\____|__  /\\___/    
                   \\/         \\/          
` + RESET);

// My watermark, hehe :)
console.log(DIM + "by Malay Patra ฅ≽^•⩊•^≼ฅ" + RESET + "\n");

if (!fs.existsSync(envPath)) {
    console.log(RED + BOLD + "❌ No .env file found!" + RESET);
    console.log(YELLOW + "⚠️  Please ensure you have a .env file before running this script." + RESET);
    process.exit(1);
}

console.log(GREEN + `✅ .env file detected, Generating .env.template ...` + RESET);

try {
    const envContent = fs.readFileSync(envPath, "utf-8");
    const exampleEnvContent = envContent
        .split("\n")
        .map(line => {
            if (line.trim() && !line.startsWith("#")) {
                const [key] = line.split("=");
                return `${key}=`;
            }
            return line;
        })
        .join("\n");

    fs.writeFileSync(exampleEnvPath, exampleEnvContent, "utf-8");
    console.log(GREEN + BOLD + `🎉 .env.template has been successfully generated!` + RESET);
} catch (error) {
    console.error(RED + BOLD + `❌ Error generating .env.template:` + RESET, error.message);
    process.exit(1);
}
