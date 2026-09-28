---
title: Power limiter for Meross plugs
summary: Monitors the consumption of Meross smart plugs in real time and, before the breaker trips, switches off the least important ones.
---

A **Python** program that acts as a "smart circuit breaker" for **Meross** smart plugs. It reads in real time how much each plug is drawing and, if the total exceeds the configured limit, switches plugs off one at a time, starting from the least important, until consumption is back under the threshold. That way the meter doesn't cut power to the whole house.

## What it does

- **Real-time consumption**: connects to the Meross account and reads the power drawn by every plug with energy monitoring
- **Configurable limit**: a threshold in watts for total consumption, to match the power of your contract
- **Priority order**: every plug has a priority. When the limit is exceeded the least important one is switched off first, continuing only if that isn't enough
- **Only what's necessary**: after each switch-off it rechecks the total and stops as soon as consumption is back within the limit, without switching off more than needed

## How it works

The heart of the program is a loop that adds up consumption and, if needed, walks down the priority list:

```python
async def controlla(prese, limite_w):
    consumi = {presa: await presa.consumo() for presa in prese}
    totale = sum(consumi.values())

    # priorità 1 = la più importante: si stacca dal numero più alto
    for presa in sorted(prese, key=lambda p: p.priorita, reverse=True):
        if totale <= limite_w:
            break
        if consumi[presa] > 0:
            await presa.spegni()
            totale -= consumi[presa]
```

## How it's built

- **[meross_iot](https://github.com/albertogeniola/MerossIot)** to access the Meross account, find the plugs and read their consumption and state
- **asyncio**, because the library is asynchronous: plug readings run concurrently and the check repeats at short intervals
- Configuration with account credentials, the limit in watts and each plug's priority

> The original code has been lost: the snippet above is a simplified reconstruction of the logic, not the actual source.
