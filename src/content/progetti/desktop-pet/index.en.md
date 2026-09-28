---
title: Sentinella, the anti-doomscrolling mascot
summary: A pixel art mascot that lives on your Windows and macOS desktop and, when you open a social network, runs over to close the tab.
---

**Sentinella** is a Windows and macOS desktop app that puts a mascot on top of every window. It keeps you company: it strolls along the taskbar, plays ball, falls asleep and lets you pet it with the mouse. Meanwhile it keeps an eye on the screen: if YouTube, Instagram, TikTok or another doomscrolling site opens, it sounds the alarm, shakes for a few seconds and then, if the window is still there, runs to the **X** and closes **only that tab**.

It doesn't block anything on the network and doesn't read what you type: it only looks at the titles of open windows.

## What it does

- **Anti-doomscrolling**: recognises sites from the tab title (with blocked words and exceptions, e.g. `youtube` yes but `youtube music` no) and programs from the process name, then chases the window even if you move it
- **A life of its own**: resting, walks across multiple monitors, flights, falls with gravity and bounces, naps, a greeting when you come back to the PC and cuddles when you hover the mouse
- **Games**: throwing the ball, hide and seek, the trampoline (keep it in the air for two minutes while collecting dots, with a high score in the notebook) and a pencil to draw a fence for it on the screen
- **Allowed time**: a few minutes of social media per day before it steps in, timed breaks and "do not disturb" in full screen
- **Notebook** with the week's statistics: time on social media, chases, closed tabs, most visited sites
- **Events and reminders**, with a speech bubble and a dedicated sound

## Fully customisable

Everything is set from a single settings window, with a search that takes you straight to the right option and highlights it.

![The Surveillance page: blocked words, exceptions and programs to watch](./impostazioni-sorveglianza.png)

Every mascot state has its own "face": a still image, a GIF or a frame sequence, with an animated preview. The three sounds (alarm, attack, reminder) can be changed too, and can be extracted straight from a video's audio.

![The Images page, with the animated faces for each state](./impostazioni-immagini.png)

With **New mascot** you can create one from scratch: name, whether it can fly, faces and sounds. Before replacing the current one the app makes an automatic backup.

![The wizard for creating a new mascot](./impostazioni-nuova.png)

## Ready-made profiles

A whole mascot (settings, phrases, images and sounds) fits in a single `.sentinella` file to export, share with someone or import again. Besides the default **black cat** there are already a **sloth** and a **red dragon**, each with its own sprites and sounds.

![The three available mascots: black cat, sloth and red dragon](./mascotte.png)

![The Profiles page with the ready-made profiles](./impostazioni-profili.png)

The import treats the file as untrusted content: an allowlist of permitted paths, no `..` traversal or executables, explicit confirmation and a backup before overwriting.

## Windows and macOS, same code

Born on Windows, Sentinella now runs on **macOS 13+** too. Everything that isn't Qt (windows, mouse, keys, permissions, sounds, auto-start) sits behind a single contract, with one backend per operating system; the rest of the app is identical on both platforms.

On a Mac a few details change: the icon lives in the menu bar, the tab is closed with `Cmd+W`, the mascot stays above full-screen apps on every Space, and `.sentinella` profiles move from Windows to Mac and back. macOS does require two permissions granted by hand (**Screen Recording** to read window titles, **Accessibility** to close the tab), so the first-run walkthrough has a dedicated step with a button for each one and a check mark that appears as soon as it's granted. The only limited game is hide and seek: macOS doesn't let a window go behind another app's windows, so the mascot only hides past the screen edge.

> The macOS port is recent and hasn't been tried on a real Mac yet: for now it's verified by CI.

## How it's built

- **PySide6 (Qt)** for the transparent borderless windows, the animations and the whole interface, drawn with a consistent dark theme and vector icons
- A **`piattaforma/`** package with the shared contract and one backend per OS, so the logic can be imported and tested anywhere
- **Win32 API via `ctypes`** on Windows to enumerate windows, read titles and processes, find the close button and simulate clicks and `Ctrl+W`, handling DPI and multiple monitors
- **Quartz, AppKit, Accessibility and AVFoundation via PyObjC** on macOS, with no private APIs that would break at every system update
- **Pixel art** sprites generated in code with `QPainter`, one script per mascot
- An interface that follows Windows scaling (100%–200%) with an extra preference for text and mascots
- Packaged with PyInstaller as **`Sentinella.exe`** on Windows and **`Sentinella.app` / `.dmg`** on Mac, or installed with a per-OS script that sets up Python, the virtual environment and auto-start
- **GitHub Actions** runs the tests on Windows and macOS on every push, builds the `.dmg` and, for each version, publishes the `.exe` and `.dmg` in a release

> The video at the top is an animation rebuilt with the app's real sprites. The settings screens are captured from the application (in Italian).
