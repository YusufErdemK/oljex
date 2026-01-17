// boot/oljex-kernel.js
window.OlJexKernel = {
  booted: false,
  boot: function() {
    const logEl = document.getElementById("log");
    logEl.textContent += "\n[ OK ] Kernel initialized.\n";
    this.booted = true;

    // Launch TTY terminal
    logEl.textContent += "[ OK ] Launching OlJex TTY...\n";

    // iframe veya window.location ile tty.html açabiliriz
    setTimeout(() => {
      try {
        window.location.href = "/home/erdem/oljex/-/oljex/ttyoljex.html";
      } catch(err) {
        logEl.innerHTML += "\n<span class='panic'>KERNEL PANIC: Failed to load TTY</span>\n";
      }
    }, 1000);
  },

  panic: function(message) {
    const logEl = document.getElementById("log");
    logEl.innerHTML += "\n<span class='panic'>KERNEL PANIC: " + message + "</span>\n";
  }
};
