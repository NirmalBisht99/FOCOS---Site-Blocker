import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { resolve, join } from 'path'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { execSync, exec } from 'child_process'
import os from 'os'
import { randomUUID } from 'crypto'
import { is } from '@electron-toolkit/utils'

// constant
const MARKER_START = '# FOCOS_BLOCK_START'
const MARKER_END = '# FOCOS_BLOCK_END'


// Host file configure
const getHostsPath = () =>
  os.platform() === 'win32'
    ? 'C:\\Windows\\System32\\drivers\\etc\\hosts'
    : '/etc/hosts'

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    webPreferences: {
      preload: resolve(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  })

  mainWindow.on('ready-to-show', () => mainWindow.show())

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(resolve(app.getAppPath(), 'out/renderer/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

function writeHostsElevated(content) {
  return new Promise((resolve) => {
    const hostsPath = getHostsPath()
    const tempPath = join(os.tmpdir(), `focos-${randomUUID()}.tmp`)

    try {
      writeFileSync(tempPath, content, 'utf8')
    } catch (e) {
      return resolve({ success: false, error: `Failed to write temp file: ${e.message}` })
    }

    const platform = os.platform()

    if (platform === 'win32') {
        const psScript = `
$src  = '${tempPath.replace(/'/g, "''")}'
$dst  = '${hostsPath.replace(/'/g, "''")}'
Copy-Item -Path $src -Destination $dst -Force
Remove-Item -Path $src -Force
`
      const scriptPath = join(os.tmpdir(), `focos-${randomUUID()}.ps1`)
      try {
        writeFileSync(scriptPath, psScript, 'utf8')
      } catch (e) {
        return resolve({ success: false, error: `Failed to write PS script: ${e.message}` })
      }

    
      const cmd = `powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process powershell -ArgumentList '-NoProfile -ExecutionPolicy Bypass -File \\\"${scriptPath}\\\"' -Verb RunAs -Wait"`

      exec(cmd, (error) => {
      
        try { execSync(`del /f "${scriptPath}"`, { shell: 'cmd.exe' }) } catch {}

        if (error) {
          resolve({ success: false, error: `Elevation failed: ${error.message}` })
        } else {
          flushDNS()
          resolve({ success: true })
        }
      })

    } else if (platform === 'darwin') {
      // macOS: 
      const cmd = `cp '${tempPath}' '${hostsPath}'`
      const osascript = `osascript -e 'do shell script "${cmd.replace(/'/g, "\\'")}" with administrator privileges'`

      exec(osascript, (error) => {
        try { execSync(`rm -f '${tempPath}'`) } catch {}
        if (error) {
          resolve({ success: false, error: `Elevation failed: ${error.message}` })
        } else {
          flushDNS()
          resolve({ success: true })
        }
      })

    } else {
      // Linux: 
      const tryCommands = [
        `pkexec cp '${tempPath}' '${hostsPath}'`,
        `gksudo "cp '${tempPath}' '${hostsPath}'"`,
        `kdesudo "cp '${tempPath}' '${hostsPath}'"`,
      ]

      let tried = 0
      const tryNext = () => {
        if (tried >= tryCommands.length) {
          try { execSync(`rm -f '${tempPath}'`) } catch {}
          return resolve({ success: false, error: 'No supported elevation method found (pkexec/gksudo/kdesudo).' })
        }
        exec(tryCommands[tried++], (error) => {
          if (error) {
            tryNext()
          } else {
            try { execSync(`rm -f '${tempPath}'`) } catch {}
            flushDNS()
            resolve({ success: true })
          }
        })
      }
      tryNext()
    }
  })
}

/** Flush the OS DNS cache so host file changes take effect immediately */
function flushDNS() {
  try {
    const platform = os.platform()
    if (platform === 'win32') {
      execSync('ipconfig /flushdns', { stdio: 'ignore' })
    } else if (platform === 'darwin') {
      execSync('dscacheutil -flushcache; killall -HUP mDNSResponder', { stdio: 'ignore', shell: '/bin/bash' })
    } else {
      // Linux 
      try { execSync('systemd-resolve --flush-caches', { stdio: 'ignore' }) } catch {}
      try { execSync('service nscd restart', { stdio: 'ignore' }) } catch {}
    }
  } catch {
     }
}

/** Read current hosts file, strip any existing FOCOS block, return clean string */
function readHostsStripped() {
  const hostsPath = getHostsPath()
  if (!existsSync(hostsPath)) return ''
  const raw = readFileSync(hostsPath, 'utf8')
  // Remove everything between (and including) the FOCOS markers
  return raw.replace(
    new RegExp(`\\n?${MARKER_START}[\\s\\S]*?${MARKER_END}\\n?`, 'g'),
    ''
  )
}

//IPC handlers 

ipcMain.handle('block-sites', async (_event, sites) => {
  if (!Array.isArray(sites) || sites.length === 0) {
    return { success: false, error: 'No sites provided.' }
  }

  try {
    const base = readHostsStripped()

    // Build the block entries: redirect both bare domain and www subdomain
    const entries = sites.flatMap((site) => {
      // Strip any http(s):// prefix and trailing slashes the user may have typed
      const domain = site.replace(/^https?:\/\//i, '').replace(/\/.*$/, '').trim()
      if (!domain) return []
      return [
        `127.0.0.1 ${domain}`,
        `127.0.0.1 www.${domain}`,
        `::1       ${domain}`,
        `::1       www.${domain}`,
      ]
    })

    const block = `\n${MARKER_START}\n${entries.join('\n')}\n${MARKER_END}\n`
    const newContent = base.trimEnd() + block

    return writeHostsElevated(newContent)
  } catch (err) {
    return { success: false, error: err.message }
  }
})

ipcMain.handle('unblock-sites', async () => {
  try {
    const cleaned = readHostsStripped().trimEnd() + '\n'
    return writeHostsElevated(cleaned)
  } catch (err) {
    return { success: false, error: err.message }
  }
})

ipcMain.handle('ping', () => 'pong')

// Convenience: expose whether we're already running as admin (Windows only).
// The renderer can use this to show a helpful message if elevation keeps failing.
ipcMain.handle('is-elevated', async () => {
  if (os.platform() !== 'win32') return true
  try {
    execSync('net session', { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
})