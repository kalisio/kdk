# Command-line tools

## [Screen](https://doc.ubuntu-fr.org/screen)

We use it to launch processes in the background on servers, which won't be killed when closing the ssh session.

## [Tail](https://www.linode.com/docs/tools-reference/tools/view-and-follow-the-end-of-text-files-with-tail)

To track logs currently written, Docker has an [equivalent command](https://docs.docker.com/engine/reference/commandline/logs/).

## [ConEmu](https://github.com/Maximus5/ConEmu)

Customizable Windows terminal.

To add new tasks *right click on settings > Startup/Tasks*, and add commands like this to open a new PowerShell at a given location:
`powershell.exe -new_console:t:"TaskName":d:D:\path-to-directory`.

If you'd like the PowerShell to execute a script at launch time (e.g. to setup your environment variables): `powershell.exe -noexit path-to-script new_console:t:"TaskName":d:D:\path-to-directory`

To make a command executed by default *right click on settings > Startup > Select it as named task*.

> It might be required to modify the [execution policy](https://technet.microsoft.com/fr-FR/library/hh847748.aspx), e.g. `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned`.
