export let InstallPwaPrompt = null

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  // Stash the event so it can be triggered later
  InstallPwaPrompt = e 
})
