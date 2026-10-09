# xs — Scripting API Reference

`xs` is the Python module that gives your scripts access to the bot. Scripts run
inside the game's own Python (**Python 2.7**), so you can also use the game
client's modules (`ui`, `chat`, `player`, ...) in the same script.

```python
import xs

xs.Teleport(48000, 52000)          # True if accepted, False if refused
print xs.GetLastError()            # why it was refused
```

API version: **1** (`xs.API_VERSION`).

---

## Contents

1. [Getting started](#1-getting-started)
2. [Rules you must know](#2-rules-you-must-know)
3. [Script, tasks and timing](#3-script-tasks-and-timing)
4. [Events](#4-events)
5. [Player](#5-player)
6. [Entities and ground items](#6-entities-and-ground-items)
7. [Inventory and items](#7-inventory-and-items)
8. [Actions](#8-actions)
9. [Movement](#9-movement)
10. [NPC dialogs](#10-npc-dialogs)
11. [Bot settings](#11-bot-settings)
12. [Route and profile](#12-route-and-profile)
13. [Channel, character, logout](#13-channel-character-logout)
14. [Selling and Helper (map travel)](#14-selling-and-helper-map-travel)
15. [Bot lists](#15-bot-lists)
16. [In-game windows](#16-in-game-windows)
17. [Settings reference](#17-settings-reference)
18. [Error messages](#18-error-messages)

---

## 1. Getting started

1. Put your script in `C:\Xweardes\scripts\` (for example `my_script.py`).
2. In the bot window open **Scripts**, press **Refresh**, select your script and
   press **Start**.
3. Output of `print` and errors appear in the console under the script.
   The dot in the list shows the state: grey = stopped, green = running,
   blue = finished, red = error.
4. **Auto start** starts the script by itself the next time this client enters
   the game.

Minimal script:

```python
import xs

p = xs.GetPlayer()
print "Hello", p["name"], "level", p["level"]
```

A script that keeps running:

```python
import xs

def main():
    while True:
        p = xs.GetPlayer()
        xs.Status("HP %d / %d" % (p["hp"], p["maxHp"]))
        yield xs.Wait(1000)          # wait 1 second without freezing the game
```

**Quick command** (Scripts > Quick command) runs a few lines once. It is handy
for trying a single function. Functions that belong to a running script
(`xs.Spawn`, `xs.On`, `xs.Every`, `xs.Status`, `xs.Opt`, `xs.Script`, `xs.Stop`)
do not work there.

---

## 2. Rules you must know

**Never use `time.sleep`.** Your script runs on the game's own thread. While
your code runs, the game does not draw a frame. Waiting is done with `yield`:

```python
yield xs.Wait(500)       # wait 500 ms
yield 500                # same thing
yield                    # wait until the next tick (about 40 ms)
```

- Code that runs for more than **250 ms without `yield`** is stopped with an
  error (`ran ... ms without yielding`). An endless loop therefore stops your
  script, not the game.
- A call that blocks (like `time.sleep(2)`) stops the script with
  `blocked the game ...`.

**Functions marked *(yield)* must be used with `yield`.** They return a task,
not a result. Without `yield` nothing happens:

```python
ok = yield xs.MoveTo(48000, 52000)    # correct: waits, then ok is True/False
xs.MoveTo(48000, 52000)               # WRONG: does nothing
```

`yield` can only be used inside a function, and that function itself becomes a
task. Start it with `main()`, `xs.Spawn`, `xs.On` or from another task with
`yield`.

**Requests return `True` or `False`.** `False` means the bot refused the
request; `xs.GetLastError()` tells you why. Refused requests are counted in the
Scripts tab (`refused`).

```python
if not xs.Attack(vid):
    print "attack refused:", xs.GetLastError()     # e.g. "out of range"
xs.Must(xs.Attack(vid))                             # or: raise an error instead
```

**Wrong arguments raise Python errors** (`TypeError`, `ValueError`), for
example a text where a number is expected, or an unknown setting name.

**Coordinates** are game units with a **positive Y**. The number the minimap
shows is the game unit divided by 100 (`map 480, 520` = `48000, 52000`).

**Names and Turkish letters.** Text from the game (names, map names, dialog
options) is raw bytes in the game's code page. If you save your script as
UTF-8, Turkish letters in it (`ş`, `ı`, ...) do **not** match the game's text.
When you search by text, use a part without Turkish letters: `"Adam"` finds
`"Yaşlı Adam"`. Searches ignore upper/lower case.

**Other engines.** Requests that move the character are refused while another
engine drives it: route bot, Level Bot, sell trip, Helper trip, Auto Sword or
Auto Learn. Turn them off first (`xs.RouteStop()`,
`xs.SetSetting("C_Farmbot", False)`) or wait (`xs.GetMotionBlock()`).

**During a channel or character switch** your tasks pause and continue after
the switch.

---

## 3. Script, tasks and timing

### xs.Script(name="", author="", desc="", api=1, options=[])

Describes the script. Call it once at the top. Shows the name, author and
description in the Scripts tab and builds a settings form from `options`.

| Parameter | Type | Meaning |
|---|---|---|
| `name` | str | Title shown in the Scripts tab (default: file name) |
| `author` | str | Shown next to the title |
| `desc` | str | One line description |
| `api` | int | Minimum API version the script needs. A newer value than installed stops the script with a clear message |
| `options` | list | Settings form, see below |

Each option is a tuple `(key, type, default)` or `(key, type, default, extra)`:

| `type` | Form control | Value returned by `xs.Opt` |
|---|---|---|
| `"int"` | number box | int |
| `"float"` | number box | float |
| `"bool"` | checkbox | True / False |
| `"string"` | text box | str |
| `"choice"` | drop-down list | the selected text |

`extra` is a dict with any of: `"label"` (text in the form), `"min"` and
`"max"` (allowed range for numbers), `"items"` (list of texts, required for
`"choice"`).

```python
xs.Script(name="Boss hunt", author="me", desc="Hunts bosses nearby", options=[
    ("radius", "int",    4000, {"label": "Search radius", "min": 500, "max": 20000}),
    ("loot",   "bool",   True, {"label": "Pick up drops"}),
    ("mode",   "choice", "fast", {"items": ["fast", "safe"]}),
])
```

The form appears after the script has been started once. Values are saved per
client.

### xs.Opt(key)

Returns the current value of an option from `xs.Script`. Changes made in the
form are seen immediately, no restart needed. Unknown key: `None`.

```python
r = xs.Opt("radius")
```

### xs.opt

Same as `xs.Opt`, written as an attribute: `xs.opt.radius`.

### main()

Not an `xs` function: if your script defines a function named `main`, it is
started after the top-level code. If `main` uses `yield`, it runs as a task.

### xs.Wait(ms=0)

Returns `ms` so that `yield xs.Wait(ms)` reads well. The `yield` does the
waiting.

### xs.WaitUntil(condition, timeout=None, interval=100) *(yield)*

Waits until `condition()` returns true. Checks every `interval` ms.

| Parameter | Meaning |
|---|---|
| `condition` | function without arguments |
| `timeout` | ms, `None` = wait forever |
| `interval` | ms between checks |

Returns `True`, or `False` on timeout (`GetLastError()` = `"timeout"`).

```python
ok = yield xs.WaitUntil(lambda: not xs.IsDead(), 60000, 1000)
```

### xs.Return(value=None)

Ends the current task function and gives `value` to the task that called it
with `yield`. Use it in your own task functions:

```python
def find_and_kill():
    m = xs.GetNearest(kind="mob", maxDist=2000)
    if not m:
        yield xs.Return(False)
    ok = yield xs.Kill(m["vid"])
    yield xs.Return(ok)

def main():
    ok = yield find_and_kill()
```

A task function that ends without `xs.Return` gives `None`.

### xs.Spawn(task_or_function, *args)

Starts a parallel task. You can pass a generator (`xs.Spawn(my_task())`) or a
function and its arguments (`xs.Spawn(my_task, 5)`). A function that does not
use `yield` is simply called once.

Returns `True`, or `False` if the script already has **64** tasks.

```python
xs.Spawn(xs.MoveTo(48000, 52000))       # start without waiting for it
```

### xs.Every(ms, function)

Calls `function()` every `ms` milliseconds (the first call is immediate).
Return `False` from the function to stop. The function must not use `yield`.

```python
def show_hp():
    p = xs.GetPlayer()
    xs.Status("HP %d" % p["hp"])
xs.Every(1000, show_hp)
```

### xs.On(event, function)

Calls `function` when `event` happens. If the function uses `yield`, every call
becomes a new task. See [Events](#4-events). A script with at least one `On`
keeps running until you stop it.

### xs.Now()

Milliseconds since an arbitrary point (float). Use it to measure time:
`if xs.Now() - start > 5000: ...`

### xs.Status(text)

Shows `text` in the status line of the Scripts tab.

### xs.Print(*values)

Writes a line to the script console. `print` does the same:
`print "a", 1` and `xs.Print("a", 1)` both write `a 1`.

### xs.Stop()

Stops the script (the `"stop"` event runs first).

### xs.GetLastError()

The reason of the last refused request of this script (`""` if none).

### xs.Must(result, why=None)

Returns `result` if it is not `False`/`None`; otherwise raises `RuntimeError`
with `why` or the last refusal reason. Use it when a refusal should stop the
script: `xs.Must(xs.Walk(x, y))`.

### xs.API_VERSION

The installed API version (int).

---

## 4. Events

Register with `xs.On(event, function)`.

| Event | Arguments | When |
|---|---|---|
| `"enterGame"` | — | The character entered the game |
| `"leaveGame"` | — | The character left the game (logout, disconnect, switch) |
| `"mapChange"` | `new, old` | Map changed (raw map names) |
| `"levelUp"` | `new, old` | Level increased |
| `"death"` | — | The character died |
| `"revive"` | — | The character is alive again |
| `"dialog"` | `options` | An NPC dialog with options opened; `options` is a list of `{"index", "text"}` |
| `"button"` | `"ui"` | The **Send 'button'** button in the Scripts tab was pressed |
| `"stop"` | — | The script is being stopped. Keep it short; close your windows here |

The function must accept exactly the arguments listed (use `*args` if you do
not need them).

```python
def on_level(new, old):
    print "level up:", old, "->", new
xs.On("levelUp", on_level)

def on_death():
    yield xs.WaitUntil(lambda: not xs.IsDead(), 60000, 1000)
    print "alive again"
xs.On("death", on_death)
```

---

## 5. Player

### xs.GetPlayer()

Returns a dict:

| Key | Type | |
|---|---|---|
| `inGame` | bool | in game |
| `name` | str | character name |
| `map` | str | raw map name, e.g. `metin2_map_a1` |
| `vid` | int | own VID |
| `level` | int | |
| `hp`, `maxHp`, `sp`, `maxSp` | int | |
| `exp`, `maxExp` | int | |
| `yang` | int | |
| `statPoints`, `skillPoints` | int | unspent points |
| `str`, `dex`, `con`, `iq` | int | stats |
| `x`, `y` | float | position (game units) |
| `rot` | float | facing direction (degrees) |
| `dead` | bool | |
| `channel` | int | 1..6, 0 = unknown |

### xs.GetPosition()

Returns `(x, y)` in game units.

### xs.GetMap()

Raw map name, e.g. `"metin2_map_a1"`.

### xs.IsInGame()

`True` while the character is in the game.

### xs.IsDead()

`True` while the character is dead.

### xs.GetSkills()

List of the character's skills, each a dict:
`{"vnum", "name", "level", "grade", "slot", "active", "cooldown"}`.
Refused (`False`) if the skills cannot be read.

### xs.GetWeapon()

VNUM of the equipped weapon, or `None`.

---

## 6. Entities and ground items

### xs.GetEntities(kind="", vnum=0, maxDist=0, alive=True, name="", limit=0)

List of mobs, stones, NPCs, players ... around you, **nearest first**.

| Parameter | Meaning |
|---|---|
| `kind` | `"mob"`, `"boss"`, `"stone"`, `"npc"`, `"player"`, `"gm"`, `"portal"`; several with `\|`: `"mob\|boss"`. Empty = all |
| `vnum` | only this VNUM (0 = any) |
| `maxDist` | only within this distance (0 = any) |
| `alive` | `True` = skip dead ones |
| `name` | only names that contain this text (case-insensitive) |
| `limit` | at most this many (0 = no limit) |

Each entry: `{"vid", "vnum", "name", "kind", "level", "x", "y", "dist", "dead"}`.

```python
for s in xs.GetEntities(kind="stone", maxDist=5000):
    print s["name"], s["level"], int(s["dist"])
```

### xs.GetNearest(kind="", vnum=0, maxDist=0, alive=True, name="")

Same filter, returns only the nearest entry or `None`.

### xs.GetEntity(vid)

The entry for this VID, or `None` if it is not around.

### xs.IsAlive(vid)

`True` if the VID is around and alive.

### xs.GetGroundItems(maxDist=0)

Items on the ground, nearest first:
`{"vid", "vnum", "x", "y", "dist", "own", "owner"}`. `own` is `True` when the
item belongs to your character; `owner` is the owner's name (`""` = no owner).

---

## 7. Inventory and items

### xs.GetItems(names=False)

List of inventory items: `{"slot", "vnum", "count", "name", "attrs"}`.
`attrs` is a list of `{"type", "value"}` (bonuses). Pass `names=True` to fill
`name` (slower). Refused if the inventory cannot be read.

### xs.FindItem(vnum)

The first inventory item with this VNUM, or `None`.

### xs.CountItem(vnum)

Total count of this VNUM in the inventory.

### xs.GetInventoryCapacity()

Number of usable inventory slots.

### xs.GetInventoryUsed()

Number of items in the inventory (one per item; a large item still counts as
one).

### xs.UseItem(slot)

Uses the item in inventory slot `slot`.
Refusals: `invalid slot`, gate reasons.

### xs.UseItemVnum(vnum)

Uses the first item with this VNUM. Refused with `item not in inventory`.

### xs.DropItem(slot, count=0)

Drops the item in `slot` on the ground. `count` = 0 drops the whole stack.
Refusals: `slot is empty`, `alchemy item is protected` (Dragon Stone shards,
Cor Draconis family and gold/silver bars are never dropped).

### xs.GetItemProto(vnum)

Item table data: `{"type", "subType", "size", "antiFlags"}`, or `None`.

---

## 8. Actions

All actions send packets through the bot's own sender: they pause during a
channel switch and are refused while not in game.

### xs.Attack(vid)

One attack on a living target. The target must be within **280** units of the
character (no ranged attack). Refusals: `no target`, `target is dead`,
`out of range`, `character is dead`.

### xs.Kill(vid, timeout=60000, delay=None, skill=0) *(yield)*

Walks to the target and attacks it until it dies.

| Parameter | Meaning |
|---|---|
| `timeout` | give up after this many ms (`"timeout"`) |
| `delay` | ms between attacks, `None` = the bot's attack delay setting |
| `skill` | skill VNUM to use on each hit, 0 = none |

Returns `True` when the target is dead or gone, `False` otherwise.

```python
m = xs.GetNearest(kind="mob", maxDist=2000)
if m:
    ok = yield xs.Kill(m["vid"], timeout=30000)
```

### xs.Pickup(vid)

Picks up a ground item within **300** units. Refusals: `no item`,
`out of range`.

### xs.Click(vid)

Talks to an NPC (like a click) within **1000** units. Refusals: `no target`,
`out of range`.

### xs.UseSkill(vnum, target=0)

Uses a skill the character has learned, on `target` VID (0 = no target). The
game's own cooldown applies. Refusals: `no such skill`, `skill not learned`.

### xs.Chat(message, type=0)

Sends a chat message (1..200 characters). `type` 0 = normal talk.
At most **one message every 2 seconds** (for all scripts together), so a
script cannot get the account muted for spam. A faster call is refused with
`chat rate limit (1 message per 2 s)`.

### xs.StatUp(stat)

Spends one status point. `stat`: `"st"`, `"dx"`, `"ht"` or `"iq"`.

### xs.SkillUp(vnum)

Spends one skill point on skill `vnum`.

---

## 9. Movement

Movement requests are refused while another engine drives the character
(see [Rules](#2-rules-you-must-know)). If you **stop** the script (or it
stops with an error), a walk or teleport it started stops too. A script that
simply ends (for example a one-line `xs.Teleport(...)`) does not cancel it.

Coordinates are **game units** = the map coordinate × 100. A destination the
character cannot stand on is refused with `destination not walkable`; if both
numbers are small, the message reminds you of the × 100:

```python
xs.Teleport(44100, 59600)    # correct: map 441, 596
xs.Teleport(441, 596)        # refused: destination not walkable - coordinates are game units (map coordinate x 100)
```

### xs.Walk(x, y)

Walks to `(x, y)` along a path around obstacles (same as a right click on the
map). Refusals: `destination not walkable`, `invalid destination`.

### xs.Teleport(x, y)

Teleports to `(x, y)` on the current map. Requires the **Teleport** option of
the map (`C_RadarTeleport`); refused with `teleport is off` otherwise.
Refused with `destination not walkable` when the target is not walkable.

### xs.Go(x, y)

Walks if the target is closer than 1200 units, teleports if farther (walks
always if Teleport is off).

### xs.MoveTo(x, y, radius=250, timeout=120000, teleport=False) *(yield)*

Moves and waits until the character is within `radius` of the target.
`teleport=True` uses `xs.Go` instead of `xs.Walk`. Returns `True` on arrival,
`False` if refused or timed out (the walk is stopped).

### xs.StopMoving()

Stops walking and cancels a teleport in progress.

### xs.IsMoving()

`True` while walking or teleporting.

### xs.IsWalkable(x, y)

`True` if the character can stand on this point.

### xs.Distance(x, y)

Distance from the character to `(x, y)`.

### xs.GetMotionBlock()

`None` if the script may move the character, otherwise the reason
(`"route bot is on"`, `"level bot is on"`, `"sell trip in progress"`, ...).

---

## 10. NPC dialogs

### xs.GetDialogOptions(maxAge=5000)

Options of the open dialog: list of `{"index", "text"}`. Empty if no dialog
was seen in the last `maxAge` ms.

### xs.IsDialogOpen()

`True` if a dialog with options or a "next page" is open.

### xs.DialogHasNext()

`True` if the dialog has a "next page" (continue) button.

### xs.DialogChoose(keyword_or_index)

Chooses an option. With a text, the first option containing it is chosen
(case-insensitive); with a number, that option index. Returns `True` / `False`.
If no option matches, **nothing is clicked**: refused with `option not found`.

```python
if xs.DialogChoose("Shop"):
    print "shop opened"
```

### xs.DialogNext()

Goes to the next page. Refused at the end of the dialog
(`dialog ended (kind=1) - use xs.DialogClose()`): call `xs.DialogClose()` then.

### xs.DialogClose()

Closes the dialog.

---

## 11. Bot settings

Every setting you can change in the bot window has a name. Full list:
[Settings reference](#17-settings-reference).

### xs.GetSetting(name)

Current value: `True`/`False`, int or float.

### xs.SetSetting(name, value)

Changes a setting exactly like the bot window does (the same side effects,
saved to the profile). Numbers are clamped to the allowed range.

- `C_RangeDamage` and `C_ExploitDamage` exclude each other, as do
  `C_AutoReviveHere` and `C_AutoReviveCity`.
- `C_RouteActive = True` is refused when no route is loaded.
- Starting a bot from a script does **not** turn on the main switch; set
  `C_BotPower` to `True` as well (the bot window's Start buttons do this).

```python
xs.SetSetting("C_BotPower", True)
xs.SetSetting("C_Farmbot", True)
```

### xs.GetSettings(group="")

List of all settings (or one group): `{"name", "group", "type", "value",
"min", "max"}`.

---

## 12. Route and profile

### xs.LoadRoute(name, timeout=15000) *(yield)*

Loads `C:\Xweardes\routes\<name>.route` (like **Load Route**). Returns
`True`/`False`.

### xs.RouteStart()

Starts the route bot. Refused when no route is loaded.

### xs.RouteStop()

Stops the route bot.

### xs.GetRouteName()

Name of the loaded route.

### xs.IsRouteActive()

`True` while the route bot runs.

### xs.IsRouteLoaded()

`True` if a route is loaded.

### xs.GetRoutes()

Names of the routes in `C:\Xweardes\routes`.

### xs.LoadProfile(name, timeout=15000) *(yield)*

Loads a profile from `C:\Xweardes\profiles` (like selecting it in the bot
window).

### xs.SaveProfile(name="", timeout=15000) *(yield)*

Saves the current settings to a profile (`""` = the current profile).

### xs.GetProfile()

Name of the current profile.

### xs.GetProfiles()

Names of all profiles.

```python
def main():
    ok = yield xs.LoadRoute("devil_tower")
    if ok:
        xs.SetSetting("C_BotPower", True)
        xs.RouteStart()
```

---

## 13. Channel, character, logout

### xs.GetChannel()

Current channel (1..6, 0 = unknown).

### xs.ChangeChannel(channel)

Starts a switch to `channel` (1..6). Returns at once; see `xs.GoChannel` to
wait. Refusals: `already on this channel`, `switch already in progress`,
`no connection detected`.

### xs.GoChannel(channel, timeout=60000) *(yield)*

Switches channel and waits until the character is back in game on the new
channel.

### xs.Relog()

Reconnects to the current channel.

### xs.RandomChannel()

Switches to a random channel from the ones selected in **Security**.

### xs.IsChannelBusy()

`True` while a channel or character switch is in progress.

### xs.SwitchCharacter(slot)

Switches to the character in `slot` (1..5) of the account.

### xs.GetCharacterNames()

The 5 character names of the account (`""` = empty slot).

### xs.Logout()

Fast logout.

---

## 14. Selling and Helper (map travel)

### xs.SellNow()

Starts a sell trip now (like **Sell now**).

### xs.SellStop()

Cancels the sell trip.

### xs.GetSellStatus()

Status text of the sell trip.

### xs.IsSelling()

`True` while a sell trip is running.

### xs.HelperGo(map_name)

Travels to another map (portals, Old Man and teleporter NPC; walks between
them). Refusal: `helper already running`.

### xs.Travel(map_name, timeout=600000) *(yield)*

`HelperGo` and wait until the trip ends.

### xs.HelperTeleporter(text)

Uses the teleporter NPC of the current map: chooses the destination whose menu
text contains `text`, or whose map is `text`.
Refusal: `teleporter destination not found`.

### xs.HelperStop()

Stops the Helper trip.

### xs.IsHelperBusy()

`True` while a Helper trip runs.

### xs.GetHelperStatus()

Status text of the Helper.

### xs.GetHelperDestinations()

Maps reachable from the current map (names you can pass to `HelperGo`).

---

## 15. Bot lists

These change the same lists as the bot window (saved with the profile).

### Auto skills

| Function | Meaning |
|---|---|
| `xs.AutoSkillCast(vnum, on=True)` | add/remove a skill from auto cast |
| `xs.AutoSkillUp(vnum, on=True)` | add/remove a skill from auto skill-up |
| `xs.GetAutoSkills()` | `{"cast": [vnums], "up": [vnums]}` |

### Pickup list

| Function | Meaning |
|---|---|
| `xs.PickupFilterAdd(vnum)` | add a VNUM |
| `xs.PickupFilterRemove(vnum)` | remove a VNUM |
| `xs.PickupFilterClear()` | empty the list |
| `xs.PickupFilterHas(vnum)` | `True` if in the list |
| `xs.GetPickupFilter()` | list of VNUMs |

What the list means is set by `C_PickupListMode` (all / only listed / all
except listed).

### Market rules

| Function | Meaning |
|---|---|
| `xs.MarketRuleSet(vnum, action, name="")` | `action`: `"sell"`, `"drop"`, `"dropfull"` (drop full stacks of 200), `"dontsell"` |
| `xs.MarketRuleRemove(vnum)` | remove the rule |
| `xs.MarketRuleClear()` | remove all rules |
| `xs.GetMarketRules()` | list of `{"vnum", "action", "name"}` |

### Attack filter

| Function | Meaning |
|---|---|
| `xs.AttackFilterAdd(vnum)` | add a mob VNUM |
| `xs.AttackFilterRemove(vnum)` | remove |
| `xs.AttackFilterClear()` | empty |
| `xs.GetAttackFilter()` | list of VNUMs |

Used when `C_AttackFilterEnable` is on.

### Use Item

| Function | Meaning |
|---|---|
| `xs.UseItemAdd(vnum, interval=60, name="")` | use this item every `interval` seconds |
| `xs.UseItemRemove(vnum)` | remove |
| `xs.UseItemClear()` | empty |
| `xs.GetUseItems()` | list of `{"vnum", "interval", "name"}` |

Runs while `C_UseItemBot` is on.

### Bonus filter (Items > Attribute)

| Function | Meaning |
|---|---|
| `xs.AttrKeepAdd(type, min=0)` | **keep** items whose bonus `type` is ≥ `min` (never sold or dropped) |
| `xs.AttrKeepRemove(type)` | remove the row |
| `xs.AttrKeepClear()` | empty |
| `xs.GetAttrKeep()` | list of `{"type", "min"}` |
| `xs.AttrDropAdd(type, min=0)` | **drop** items whose bonus `type` is < `min` |
| `xs.AttrDropRemove(type)` | remove the row |
| `xs.AttrDropClear()` | empty |
| `xs.GetAttrDrop()` | list of `{"type", "min"}` |

`xs.ATTR_NONE` (999) as `type` in `AttrDropAdd` means "weapons and armour
without any bonus". Keep rows win over drop rows.

### Whitelist (Security)

| Function | Meaning |
|---|---|
| `xs.WhitelistAdd(name)` | add a player name (1..32 characters) |
| `xs.WhitelistRemove(name)` | remove |
| `xs.WhitelistClear()` | empty |
| `xs.GetWhitelist()` | list of names |

---

## 16. In-game windows

You can build windows with the game's own `ui` module. Their buttons are
called by the game; inside them you can call any `xs` function.

```python
import xs, ui

class Panel(ui.BoardWithTitleBar):
    def __init__(self):
        ui.BoardWithTitleBar.__init__(self)
        self.AddFlag("movable")
        self.SetSize(180, 80)
        self.SetPosition(20, 200)
        self.SetTitleName("My panel")
        self.SetCloseEvent(xs.Stop)             # closing the window stops the script
        self.btn = ui.Button()
        self.btn.SetParent(self)
        self.btn.SetPosition(15, 40)
        self.btn.SetUpVisual("d:/ymir work/ui/public/large_button_01.sub")
        self.btn.SetOverVisual("d:/ymir work/ui/public/large_button_02.sub")
        self.btn.SetDownVisual("d:/ymir work/ui/public/large_button_03.sub")
        self.btn.SetText("Go")
        self.btn.SetEvent(lambda: xs.Spawn(xs.MoveTo(48000, 52000)))
        self.btn.Show()
        self.Show()

panel = Panel()
xs.On("stop", panel.Hide)                       # stopping the script closes the window
```

- Keep a reference to your window (`panel = ...`), otherwise the game deletes
  it.
- Always close your windows in the `"stop"` event.
- Inside window callbacks `print` goes to the game's output, not to the
  console, and there is no time limit: start longer work with `xs.Spawn`.
- Update windows from `xs.Every` rather than from `OnUpdate`.
- A complete example is `xs_gui.py` (control window for damage, pickup, move
  speed, level bot, route, channel and map travel).

---

## 17. Settings reference

Names for `xs.GetSetting` / `xs.SetSetting`. Distances are game units (the
bot window shows them divided by 100). `xs.GetSettings()` returns the same list
with the current values.

### main

| Name | Type | Range | Meaning |
|---|---|---|---|
| `C_BotPower` | bool | | Main switch. Off = no bot engine runs (saved per client, not in profiles) |
| `C_Wallhack` | bool | | Wall Hack |
| `C_GhostMode` | bool | | Ghost Mode (walk while dead) |
| `C_Zoom` | bool | | Camera zoom |
| `C_ZoomValue` | float | 3500..30000 | Maximum camera distance |
| `g_BoostEnabled` | bool | | Move Speed |
| `g_BoostSpeed` | int | 100..1500 | Move Speed value (speed ratio x 100; 100 = normal) |
| `C_AutoReviveHere` | bool | | Revive Here |
| `C_AutoReviveCity` | bool | | Revive in Town |
| `C_ReviveHpWait` | bool | | Revive HP: after reviving, no damage until HP reaches `C_ReviveHpPct` |
| `C_ReviveHpPct` | int | 1..100 | HP % required after reviving |
| `C_AutoMount` | bool | | Auto Mount: stay mounted; with Auto Skill, dismount, cast, remount |
| `C_AutoRelogin` | bool | | Auto Login after a disconnect |
| `C_AutoPotionRed` | bool | | Red potion |
| `C_AutoPotionRedPercent` | float | 0..100 | Use red potion below this HP % |
| `C_AutoPotionBlue` | bool | | Blue potion |
| `C_AutoPotionBluePercent` | float | 0..100 | Use blue potion below this SP % |
| `C_AutoStatus` | bool | | Auto Status (spend status points) |
| `C_AutoSword` | bool | | Auto Sword (beginner weapon quest) |
| `C_AutoSwordType` | int | -1..6 | Weapon: -1 = by class, 0 Sword, 1 Dagger, 2 Bow, 3 Two-handed, 4 Bell, 5 Fan, 6 Claw |
| `C_AutoLearn` | bool | | Auto Learn (skill teacher) |
| `C_AutoLearnTree` | int | 0..1 | First or second skill group of the class |
| `C_BindChannel` | bool | | Bind: follow another client's channel |
| `C_BindSlotId` | int | 0..60 | Client slot to follow |
| `C_RadarTeleport` | bool | | Teleport (map click / `xs.Teleport` / `xs.Go`) |
| `C_LevelAutoConfig` | bool | | Level Settings (profile by level) |
| `C_QU_DragonAtk` | bool | | Quick Use: Dragon God Attack |
| `C_QU_CritHit` | bool | | Quick Use: Critical Hit |
| `C_QU_PierceHit` | bool | | Quick Use: Piercing Hit |
| `C_QU_ThiefGlove` | bool | | Quick Use: Thief Gloves |
| `C_QU_Wisdom3h` | bool | | Quick Use: Wisdom (3 h) |
| `C_QU_Wisdom1h` | bool | | Quick Use: Wisdom (1 h) |
| `C_QU_NoviceChest` | bool | | Quick Use: Novice chests |
| `C_QU_PurplePot` | bool | | Quick Use: Purple potion |
| `C_QU_GreenPot` | bool | | Quick Use: Green potion |

### damage

| Name | Type | Range | Meaning |
|---|---|---|---|
| `C_RangeDamage` | bool | | Damage mode **Attack** |
| `C_ExploitDamage` | bool | | Damage mode **Exploit** |
| `C_ExploitDamageMode` | int | 0..1 | Exploit role: 0 = Main, 1 = Dummy |
| `C_ExploitAutoSleep` | bool | | Exploit Auto Sleep |
| `C_ExploitSleepValue` | int | 0..1000 | Exploit sleep (ms) when Auto Sleep is off |
| `C_AttackDelayMs` | int | 50..500 | Attack delay (ms) |
| `C_RangeDistance` | float | 0..100000 | Damage range (Fov) |
| `C_DmgMob` | bool | | Target mobs |
| `C_DmgStone` | bool | | Target stones |
| `C_DmgBoss` | bool | | Target bosses |
| `C_RangeDamagePlayer` | bool | | Target players |
| `C_SafeMode` | bool | | Safe |
| `C_AttackFilterEnable` | bool | | Use the attack filter list |
| `C_StoneLevelFilter` | bool | | Stone level range (Level Bot) |
| `C_StoneLevelMin` | int | 1..250 | Minimum stone level |
| `C_StoneLevelMax` | int | 1..250 | Maximum stone level |

### route

| Name | Type | Range | Meaning |
|---|---|---|---|
| `C_RouteActive` | bool | | Route bot running (needs a loaded route) |
| `C_RouteStoneBreak` | bool | | Attack stones on the route |
| `C_RouteBossBreak` | bool | | Attack bosses on the route |
| `C_RouteTpToStart` | bool | | Teleport to start when the route ends |
| `C_RouteChangeChannel` | bool | | Change channel when the route ends |
| `C_RouteStoneLevelFilter` | bool | | Stone level range on the route |
| `C_RouteStoneLevelMin` | int | 1..250 | Minimum stone level |
| `C_RouteStoneLevelMax` | int | 1..250 | Maximum stone level |

### levelbot

| Name | Type | Range | Meaning |
|---|---|---|---|
| `C_Farmbot` | bool | | Level Bot running |
| `C_FarmMob` | bool | | Level Bot targets mobs |
| `C_FarmBoss` | bool | | Level Bot targets bosses |
| `C_Stone` | bool | | Level Bot targets stones |
| `C_FarmGoOnly` | bool | | Just go to target |
| `C_FarmTargetDistance` | float | 0..100000 | Level Bot range (Fov) |
| `C_FarmRangeCircle` | bool | | Follow circle |
| `C_FarmCenterOn` | bool | | Use the Center point |
| `C_FarmCenterX` | int | 0..100000 | Center X (map coordinate) |
| `C_FarmCenterY` | int | 0..100000 | Center Y (map coordinate) |
| `C_StoneDetector` | bool | | Stone Detector |
| `C_BossDetector` | bool | | Boss Detector |
| `C_ExitLevelEnable` | bool | | Exit client at level |
| `C_ExitLevelNextChar` | bool | | Next character first |
| `C_ExitLevel` | int | 1..250 | Target level |

### pickup

| Name | Type | Range | Meaning |
|---|---|---|---|
| `C_AutoPickup` | bool | | Walk Pickup |
| `C_RangePickup` | bool | | Range Pickup |
| `C_PickupRange` | float | 0..100000 | Pickup range |
| `C_PickupSpeed` | float | 0..100000 | Pickup delay (ms) |
| `C_PickupYangOnly` | bool | | Yang only |
| `C_PickupListMode` | int | 0..2 | 0 = all, 1 = only listed, 2 = all except listed |
| `C_PickupRequireOwner` | bool | | Skip ownerless items |
| `C_PickupOwnerYangExempt` | bool | | Take Yang anyway |
| `C_PickupMinPriceEnable` | bool | | Only items with sell price ≥ minimum |
| `C_PickupMinPrice` | int | 0..2000000000 | Minimum sell price |

### market

| Name | Type | Range | Meaning |
|---|---|---|---|
| `C_AutoSellFull` | bool | | Go to market when free slots are low |
| `C_AutoSellThreshold` | int | 0..180 | Free slots limit |
| `C_SellNpcKind` | int | 0..1 | 0 = Vendor, 1 = Fisherman |
| `C_SellTown` | int | 0..1 | Village 1 / Village 2 |
| `C_FastSell` | bool | | Fast sell |
| `C_UseEnasir` | bool | | Sell to Enasir (summoned traveling merchant) instead of walking to the vendor |

### items

| Name | Type | Range | Meaning |
|---|---|---|---|
| `C_FilterByAttributes` | bool | | Bonus filter: Keep table on |
| `C_AttrDropEnabled` | bool | | Bonus filter: Drop table on |
| `C_AttrLangTR` | bool | | Bonus names in Turkish |
| `C_UseItemBot` | bool | | Use Item running |

### helper

| Name | Type | Range | Meaning |
|---|---|---|---|
| `C_AutoStack` | bool | | Auto stack items |
| `C_AutoSplit` | bool | | Split stacks of `C_SplitVnum` into `C_SplitSize` pieces (turning it on turns `C_AutoStack` off) |
| `C_SplitVnum` | int | 0..999999999 | Item vnum to split (0 = none) |
| `C_SplitSize` | int | 1..199 | Size of each split stack |
| `C_AutoRelogEnable` | bool | | Relog every X minutes |
| `C_AutoRelogMinutes` | int | 1..1440 | Minutes |
| `C_AutoRestartEnable` | bool | | Restart client every X hours |
| `C_AutoRestartHours` | int | 1..240 | Hours |

### event

| Name | Type | Range | Meaning |
|---|---|---|---|
| `C_OkeyAuto` | bool | | Okey auto play |
| `C_OkeyGames` | int | 0..200 | Games to play |
| `C_OkeyGapMs` | int | 50..3000 | Delay between moves (ms) |
| `C_YutAuto` | bool | | Yutnori auto play |
| `C_YutGames` | int | 0..999 | Games to play |
| `C_YutGapMs` | int | 200..5000 | Delay (ms) |
| `C_AlcEnable` | bool | | Alchemy: talk to Alchemist after Lv 30 |
| `C_AlcShopMap` | bool | | Alchemy: go to shop map |
| `C_AlcAllChars` | bool | | Alchemy: check all characters |
| `C_AlcStopDone` | bool | | Alchemy: stop when quest is done |
| `C_AlcExitDone` | bool | | Alchemy: exit when quest is done |
| `C_AlcStore` | bool | | Alchemy: put the cors in storage |
| `C_AlcStoreCorCount` | int | 0..1000 | Store when at least this many cors |
| `C_AlcBuyBars` | bool | | Alchemy: buy gold / silver bars |
| `C_AlcKeepYang` | int | 0..2000000000 | Keep at least this much Yang |
| `C_GobEnable` | bool | | Goblin treasure hunt (Lv 70+) |
| `C_GobAttack` | bool | | Goblin: Attack |
| `C_GobSafe` | bool | | Goblin: Safe |
| `C_GobSpeed` | bool | | Goblin speed (1.5M Yang) |
| `C_GobDoblonMin` | int | 90..875 | Doblon threshold |
| `C_GobKeyTarget` | int | 1..1000 | Stop at this many Goblin Keys |
| `C_EngEnable` | bool | | Hammer Energy running |
| `C_EngSource` | int | 0..1 | 0 = items from inventory, 1 = buy from Weapon Shop |
| `C_EngHammerBuy` | int | 1..10000 | Hammers to buy |
| `C_EngBuyHammers` | bool | | Buy hammers from Alchemist when out |
| `C_EngMinYang` | int | 0..2000000000 | Minimum Yang |
| `C_EngItemVnum` | int | 0..999999 | Item VNUM to buy (0 = cheapest) |
| `C_EngShopTown` | int | 0..1 | Weapon Shop in Village 1 / Village 2 |
| `C_TrEnable` | bool | | Time Rift running |
| `C_TrDungeon` | int | 0..3 | Dungeon: 0 Grotto of Exile, 1 Red Dragon Fortress, 2 Nemere's Watchtower, 3 Enchanted Forest |
| `C_TrWatchBuy` | int | 1..1000 | Pocket Watches to buy |
| `C_TrWalk` | bool | | Time Rift: always walk on the Plateau (ignore Teleport) |

### security

| Name | Type | Range | Meaning |
|---|---|---|---|
| `C_SecurityEnable` | bool | | Security on |
| `C_SecurityAutoWhitelist` | bool | | Whitelist my clients |
| `C_SecurityGM_StopBot` | bool | | GM nearby: stop bot |
| `C_SecurityGM_CloseGame` | bool | | GM nearby: close game |
| `C_SecurityGM_ChangeChannel` | bool | | GM nearby: change channel |
| `C_SecurityPlayer_StopBot` | bool | | Player nearby: stop bot |
| `C_SecurityPlayer_CloseGame` | bool | | Player nearby: close game |
| `C_SecurityPlayer_ChangeChannel` | bool | | Player nearby: change channel |
| `C_SecurityCHMask` | int | 1..63 | Channels to switch to: bit 1 = CH1, 2 = CH2, 4 = CH3, 8 = CH4, 16 = CH5, 32 = CH6 |

---

## 18. Error messages

### Refusal reasons (`xs.GetLastError()`)

| Reason | Meaning |
|---|---|
| `not in game` | the character is not in the game |
| `channel/character switch in progress` | wait until the switch ends |
| `no offsets` | the bot is not ready (not started from the panel) |
| `route bot is on`, `level bot is on`, `sell trip in progress`, `helper trip in progress`, `quest engine busy (sword/learn)` | another engine drives the character |
| `out of range` | the target is too far |
| `no target`, `target is dead`, `no item` | the VID is not around / dead |
| `character is dead` | |
| `invalid destination` | no path to this point |
| `destination not walkable` | the target point is a wall / outside the map; coordinates are game units (map coordinate × 100) |
| `teleport is off (C_RadarTeleport)` | turn on Teleport |
| `timeout` | a *(yield)* function did not finish in time |
| `send failed` | the game did not accept the packet |
| `task limit reached` | the script has 64 tasks |
| `chat rate limit (1 message per 2 s)` | wait 2 seconds between chat messages |

### Script errors (red state in the Scripts tab)

| Message | Fix |
|---|---|
| `ran N ms without yielding (infinite loop?)` | add `yield xs.Wait(ms)` inside loops |
| `blocked the game for N ms ... (time.sleep?)` | replace `time.sleep(s)` with `yield xs.Wait(s * 1000)` |
| `a task may only yield a number (ms), None, a generator or xs.Return(value)` | check what you `yield` |
| `this xs function needs a running script` | the function was called from Quick command or after the script stopped |
| `this script needs SDK api=N` | update the bot |
| `unknown setting '...'` | check the name in [Settings reference](#17-settings-reference) |
