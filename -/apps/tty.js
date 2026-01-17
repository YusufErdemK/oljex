// apps/tty.js - OlJex TTY terminal (HTML terminal üzerinden çalışacak)
class Terminal {
  constructor(rootPath) {
    this.fs = rootPath; // sadece "-" klasörü
    this.currentPath = "-"; // root "-" klasörü
    this.currentUser = "root";
    this.users = { root: { password: "", home: "-/users/oljex" } };
  }

  run(input) {
    const [cmd, ...args] = input.trim().split(" ");
    switch(cmd) {
      case "ls": return this.ls();
      case "pwd": return this.pwd();
      case "cd": return this.cd(args[0]);
      case "mkdir": return this.mkdir(args[0]);
      case "touch": return this.touch(args[0]);
      case "tree": return this.tree(this.getDir(this.currentPath));
      case "neofetch": return this.neofetch();
      case "useradd": return this.useradd(args[0]);
      case "passwd": return this.passwd(args[0]);
      case "su": return this.su(args[0]);
      case "nano": return this.nano(args.join(" "));
      default: return `Command not found: ${cmd}`;
    }
  }

  // Helpers
  getDir(path) {
    if(path === "/") return this.fs;
    const parts = path.split("/").filter(Boolean);
    let dir = this.fs;
    for(const part of parts){
      if(dir[part] && typeof dir[part] === "object") dir = dir[part];
      else return null;
    }
    return dir;
  }

  ls() {
    const dir = this.getDir(this.currentPath);
    return Object.keys(dir).join("  ");
  }

  pwd() { return this.currentPath; }

  cd(path) {
    if(!path || path === "~") { this.currentPath = this.users[this.currentUser].home; return ""; }
    if(path.startsWith("/")) {
      if(this.getDir(path)) { this.currentPath = path; return ""; }
      return `cd: no such file or directory: ${path}`;
    }
    const newPath = this.currentPath === "/" ? `/${path}` : `${this.currentPath}/${path}`;
    if(this.getDir(newPath)) { this.currentPath = newPath; return ""; }
    return `cd: no such file or directory: ${path}`;
  }

  mkdir(name) {
    const dir = this.getDir(this.currentPath);
    if(dir[name]) return `mkdir: cannot create directory '${name}': File exists`;
    dir[name] = {};
    return "";
  }

  touch(name) {
    const dir = this.getDir(this.currentPath);
    dir[name] = null;
    return "";
  }

  nano(filename) {
    return `[Nano Editor] Editing ${filename}... (not implemented)`;
  }

  tree(dir=this.getDir(this.currentPath), prefix="") {
    let output = "";
    for(const key in dir){
      output += prefix + "├──" + key + "\n";
      if(typeof dir[key] === "object") output += this.tree(dir[key], prefix + "│  ");
    }
    return output;
  }

  neofetch() {
    return `
User: ${this.currentUser}
OS: OlJex OS (Electron)
Terminal: TTY
Path: ${this.currentPath}
`;
  }

  useradd(username) {
    if(this.users[username]) return `useradd: user '${username}' exists`;
    this.users[username] = { password: "", home: "/" };
    this.fs.users[username] = {};
    return `User '${username}' added`;
  }

  passwd(newPass) {
    if(!newPass) return "Usage: passwd <newpassword>";
    this.users[this.currentUser].password = newPass;
    return "Password updated";
  }

  su(username) {
    if(!this.users[username]) return `su: user '${username}' does not exist`;
    this.currentUser = username;
    this.currentPath = this.users[username].home;
    return `Switched to user '${username}'`;
  }
}

// --- HTML terminal entegrasyonu ---
const tty = new Terminal({
  apps: { tty: null },
  boot: { "oljex-kernel.js": null, oloader: { "boot.html": null, "oloader.conf": null } },
  oljex: { fonts: {}, icons: {}, skel: {} },
  temp: {},
  users: {}
});

// assume HTML terminal input: <input id="terminalInput"> and output: <pre id="terminalOutput">
const input = document.getElementById("terminalInput");
const output = document.getElementById("terminalOutput");

input.addEventListener("keydown", e => {
  if(e.key === "Enter"){
    e.preventDefault();
    const cmd = input.value;
    output.textContent += `┌──(${tty.currentUser}@oljex)-[~]\n└─$ ${cmd}\n`;
    output.textContent += tty.run(cmd) + "\n";
    input.value = "";
    output.scrollTop = output.scrollHeight;
  }
});

window.tty = new Terminal({
  apps: { tty: null },
  boot: { "oljex-kernel.js": null, oloader: { "boot.html": null, "oloader.conf": null } },
  oljex: { fonts: {}, icons: {}, skel: {} },
  temp: {},
  users: { oljex: { password: "", home: "-/users/oljex" } }
});
