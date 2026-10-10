# xs — Betik API Referansı

`xs`, betiklerinizin bota erişmesini sağlayan Python modülüdür. Betikler
oyunun **kendi Python'unda (Python 2.7)** çalışır; bu yüzden aynı betikte oyun
istemcisinin modüllerini (`ui`, `chat`, `player`, ...) de kullanabilirsiniz.

```python
import xs

xs.Teleport(48000, 52000)          # kabul edilirse True, reddedilirse False
print xs.GetLastError()            # neden reddedildiği
```

API sürümü: **1** (`xs.API_VERSION`).

---

## İçindekiler

1. [Başlarken](#1-baslarken)
2. [Bilmeniz gereken kurallar](#2-bilmeniz-gereken-kurallar)
3. [Betik, görevler ve zamanlama](#3-betik-gorevler-ve-zamanlama)
4. [Olaylar](#4-olaylar)
5. [Karakter](#5-karakter)
6. [Varlıklar ve yerdeki eşyalar](#6-varliklar-ve-yerdeki-esyalar)
7. [Envanter ve eşyalar](#7-envanter-ve-esyalar)
8. [Eylemler](#8-eylemler)
9. [Hareket](#9-hareket)
10. [NPC diyalogları](#10-npc-diyaloglari)
11. [Bot ayarları](#11-bot-ayarlari)
12. [Rota ve profil](#12-rota-ve-profil)
13. [Kanal, karakter, çıkış](#13-kanal-karakter-cikis)
14. [Satış ve Helper (harita yolculuğu)](#14-satis-ve-helper-harita-yolculugu)
15. [Bot listeleri](#15-bot-listeleri)
16. [Oyun içi pencereler](#16-oyun-ici-pencereler)
17. [Ayarlar listesi](#17-ayarlar-listesi)
18. [Hata mesajları](#18-hata-mesajlari)

---

## 1. Başlarken

1. Betiğinizi `C:\Xweardes\scripts\` içine koyun (örneğin `betigim.py`).
2. Bot penceresinde **Scripts** sekmesini açın, **Refresh**'e basın, betiğinizi
   seçin ve **Start**'a basın.
3. `print` çıktıları ve hatalar betiğin altındaki konsolda görünür. Listedeki
   nokta durumu gösterir: gri = durdu, yeşil = çalışıyor, mavi = bitti,
   kırmızı = hata.
4. **Auto start** işaretli betik, bu istemci bir sonraki sefer oyuna girdiğinde
   kendiliğinden başlar.

En kısa betik:

```python
import xs

p = xs.GetPlayer()
print "Merhaba", p["name"], "seviye", p["level"]
```

Sürekli çalışan bir betik:

```python
import xs

def main():
    while True:
        p = xs.GetPlayer()
        xs.Status("HP %d / %d" % (p["hp"], p["maxHp"]))
        yield xs.Wait(1000)          # oyunu dondurmadan 1 saniye bekle
```

**Quick command** (Scripts > Quick command) birkaç satırı bir kez çalıştırır.
Tek bir fonksiyonu denemek için kullanışlıdır. Çalışan bir betiğe ait
fonksiyonlar (`xs.Spawn`, `xs.On`, `xs.Every`, `xs.Status`, `xs.Opt`,
`xs.Script`, `xs.Stop`) orada çalışmaz.

---

## 2. Bilmeniz gereken kurallar

**Asla `time.sleep` kullanmayın.** Betiğiniz oyunun kendi thread'inde çalışır.
Kodunuz çalışırken oyun kare çizmez. Bekleme `yield` ile yapılır:

```python
yield xs.Wait(500)       # 500 ms bekle
yield 500                # aynısı
yield                    # bir sonraki tike kadar bekle (yaklaşık 40 ms)
```

- **`yield` yapmadan 250 ms'den uzun** çalışan kod hata ile durdurulur
  (`ran ... ms without yielding`). Yani sonsuz döngü oyunu değil, betiğinizi
  durdurur.
- Bekleten bir çağrı (`time.sleep(2)` gibi) betiği `blocked the game ...`
  hatasıyla durdurur.

***(yield)* işaretli fonksiyonlar `yield` ile kullanılmalıdır.** Sonuç değil
görev döndürürler. `yield` olmadan hiçbir şey olmaz:

```python
ok = yield xs.MoveTo(48000, 52000)    # doğru: bekler, sonra ok True/False olur
xs.MoveTo(48000, 52000)               # YANLIŞ: hiçbir şey yapmaz
```

`yield` yalnızca bir fonksiyonun içinde kullanılabilir ve o fonksiyon kendisi
bir görev olur. Onu `main()`, `xs.Spawn`, `xs.On` ile ya da başka bir görevden
`yield` ile başlatın.

**İstekler `True` ya da `False` döndürür.** `False`, botun isteği reddettiği
anlamına gelir; `xs.GetLastError()` nedenini söyler. Reddedilen istekler
Scripts sekmesinde sayılır (`refused`).

```python
if not xs.Attack(vid):
    print "saldırı reddedildi:", xs.GetLastError()  # örn. "out of range"
xs.Must(xs.Attack(vid))                              # ya da: hata fırlat
```

**Yanlış argümanlar Python hatası verir** (`TypeError`, `ValueError`); örneğin
sayı beklenen yere metin ya da bilinmeyen bir ayar adı.

**Koordinatlar** oyun birimidir ve **Y pozitiftir**. Mini haritanın gösterdiği
sayı oyun biriminin 100'e bölünmüşüdür (`harita 480, 520` = `48000, 52000`).

**Adlar ve Türkçe harfler.** Oyundan gelen metinler (adlar, harita adları,
diyalog seçenekleri) oyunun kod sayfasında ham bayttır. Betiğinizi UTF-8
kaydederseniz içindeki Türkçe harfler (`ş`, `ı`, ...) oyunun metniyle
**eşleşmez**. Metinle ararken Türkçe harf içermeyen bir parça kullanın:
`"Adam"`, `"Yaşlı Adam"`ı bulur. Aramalar büyük/küçük harf ayırmaz.

**Diğer motorlar.** Karakteri başka bir motor sürerken karakteri hareket
ettiren istekler reddedilir: rota botu, Level Bot, satış turu, Helper
yolculuğu, Auto Sword ya da Auto Learn. Önce onları kapatın (`xs.RouteStop()`,
`xs.SetSetting("C_Farmbot", False)`) ya da bekleyin (`xs.GetMotionBlock()`).

**Kanal ya da karakter değişimi sırasında** görevleriniz durur ve değişim
bitince devam eder.

---

## 3. Betik, görevler ve zamanlama

### xs.Script(name="", author="", desc="", api=1, options=[])

Betiği tanımlar. En üstte bir kez çağırın. Scripts sekmesinde adı, yazarı ve
açıklamayı gösterir ve `options`'tan bir ayar formu oluşturur.

| Parametre | Tür | Anlamı |
|---|---|---|
| `name` | str | Scripts sekmesindeki başlık (varsayılan: dosya adı) |
| `author` | str | Başlığın yanında görünür |
| `desc` | str | Tek satırlık açıklama |
| `api` | int | Betiğin ihtiyaç duyduğu en düşük API sürümü. Kurulu olandan yeni bir değer betiği açık bir mesajla durdurur |
| `options` | list | Ayar formu, aşağıda |

Her seçenek `(anahtar, tür, varsayılan)` ya da `(anahtar, tür, varsayılan, ek)`
biçiminde bir tuple'dır:

| `tür` | Form denetimi | `xs.Opt`'un döndürdüğü |
|---|---|---|
| `"int"` | sayı kutusu | int |
| `"float"` | sayı kutusu | float |
| `"bool"` | onay kutusu | True / False |
| `"string"` | metin kutusu | str |
| `"choice"` | açılır liste | seçili metin |

`ek` şu anahtarlardan herhangi birini içeren bir dict'tir: `"label"` (formdaki
metin), `"min"` ve `"max"` (sayılar için izin verilen aralık), `"items"`
(metin listesi, `"choice"` için zorunlu).

```python
xs.Script(name="Boss hunt", author="ben", desc="Yakındaki bossları avlar", options=[
    ("radius", "int",    4000, {"label": "Search radius", "min": 500, "max": 20000}),
    ("loot",   "bool",   True, {"label": "Pick up drops"}),
    ("mode",   "choice", "fast", {"items": ["fast", "safe"]}),
])
```

Form, betik bir kez başlatıldıktan sonra görünür. Değerler istemci başına
kaydedilir.

### xs.Opt(key)

`xs.Script`'teki bir seçeneğin güncel değerini döndürür. Formda yapılan
değişiklik hemen görülür, yeniden başlatmak gerekmez. Bilinmeyen anahtar:
`None`.

```python
r = xs.Opt("radius")
```

### xs.opt

`xs.Opt`'un nitelik olarak yazılışı: `xs.opt.radius`.

### main()

Bir `xs` fonksiyonu değildir: betiğiniz `main` adında bir fonksiyon
tanımlarsa, üst seviye koddan sonra başlatılır. `main` içinde `yield` varsa
görev olarak çalışır.

### xs.Wait(ms=0)

`yield xs.Wait(ms)` okunaklı olsun diye `ms`'yi döndürür. Beklemeyi `yield`
yapar.

### xs.WaitUntil(condition, timeout=None, interval=100) *(yield)*

`condition()` doğru dönene kadar bekler. Her `interval` ms'de bir kontrol eder.

| Parametre | Anlamı |
|---|---|
| `condition` | argümansız fonksiyon |
| `timeout` | ms, `None` = sonsuza kadar bekle |
| `interval` | kontroller arası ms |

`True` döndürür; zaman aşımında `False` (`GetLastError()` = `"timeout"`).

```python
ok = yield xs.WaitUntil(lambda: not xs.IsDead(), 60000, 1000)
```

### xs.Return(value=None)

Geçerli görev fonksiyonunu bitirir ve onu `yield` ile çağıran göreve `value`
değerini verir. Kendi görev fonksiyonlarınızda kullanın:

```python
def bul_ve_oldur():
    m = xs.GetNearest(kind="mob", maxDist=2000)
    if not m:
        yield xs.Return(False)
    ok = yield xs.Kill(m["vid"])
    yield xs.Return(ok)

def main():
    ok = yield bul_ve_oldur()
```

`xs.Return` olmadan biten görev fonksiyonu `None` verir.

### xs.Spawn(task_or_function, *args)

Paralel bir görev başlatır. Generator (`xs.Spawn(gorevim())`) ya da fonksiyon
ve argümanlarını (`xs.Spawn(gorevim, 5)`) verebilirsiniz. `yield` içermeyen
fonksiyon yalnızca bir kez çağrılır.

`True` döndürür; betiğin zaten **64** görevi varsa `False`.

```python
xs.Spawn(xs.MoveTo(48000, 52000))       # beklemeden başlat
```

### xs.Every(ms, function)

`function()`'ı her `ms` milisaniyede bir çağırır (ilk çağrı hemen). Durdurmak
için fonksiyondan `False` döndürün. Fonksiyon `yield` kullanmamalıdır.

```python
def hp_goster():
    p = xs.GetPlayer()
    xs.Status("HP %d" % p["hp"])
xs.Every(1000, hp_goster)
```

### xs.On(event, function)

`event` olduğunda `function`'ı çağırır. Fonksiyon `yield` kullanıyorsa her
çağrı yeni bir görev olur. Bkz. [Olaylar](#4-olaylar). En az bir `On` içeren
betik, siz durdurana kadar çalışmaya devam eder.

### xs.Now()

Belirsiz bir andan beri geçen milisaniye (float). Süre ölçmek için kullanın:
`if xs.Now() - start > 5000: ...`

### xs.Status(text)

`text`'i Scripts sekmesinin durum satırında gösterir.

### xs.Print(*values)

Betik konsoluna bir satır yazar. `print` aynısını yapar: `print "a", 1` ve
`xs.Print("a", 1)` ikisi de `a 1` yazar.

### xs.Stop()

Betiği durdurur (önce `"stop"` olayı çalışır).

### xs.GetLastError()

Bu betiğin son reddedilen isteğinin nedeni (yoksa `""`).

### xs.Must(result, why=None)

`result` `False`/`None` değilse onu döndürür; değilse `why` ya da son red
nedeniyle `RuntimeError` fırlatır. Bir reddin betiği durdurması gerektiğinde
kullanın: `xs.Must(xs.Walk(x, y))`.

### xs.API_VERSION

Kurulu API sürümü (int).

---

## 4. Olaylar

`xs.On(olay, fonksiyon)` ile kaydedin.

| Olay | Argümanlar | Ne zaman |
|---|---|---|
| `"enterGame"` | — | Karakter oyuna girdi |
| `"leaveGame"` | — | Karakter oyundan çıktı (çıkış, kopma, değişim) |
| `"mapChange"` | `new, old` | Harita değişti (ham harita adları) |
| `"levelUp"` | `new, old` | Seviye arttı |
| `"death"` | — | Karakter öldü |
| `"revive"` | — | Karakter yeniden canlandı |
| `"dialog"` | `options` | Seçenekli bir NPC diyaloğu açıldı; `options`, `{"index", "text"}` listesidir |
| `"button"` | `"ui"` | Scripts sekmesindeki **Send 'button'** düğmesine basıldı |
| `"stop"` | — | Betik durduruluyor. Kısa tutun; pencerelerinizi burada kapatın |

Fonksiyon tam olarak listedeki argümanları almalıdır (gerekmiyorsa `*args`
kullanın).

```python
def seviye(new, old):
    print "seviye atladı:", old, "->", new
xs.On("levelUp", seviye)

def oldum():
    yield xs.WaitUntil(lambda: not xs.IsDead(), 60000, 1000)
    print "yeniden canlandım"
xs.On("death", oldum)
```

---

## 5. Karakter

### xs.GetPlayer()

Bir dict döndürür:

| Anahtar | Tür | |
|---|---|---|
| `inGame` | bool | oyunda |
| `name` | str | karakter adı |
| `map` | str | ham harita adı, örn. `metin2_map_a1` |
| `vid` | int | kendi VID'i |
| `level` | int | |
| `hp`, `maxHp`, `sp`, `maxSp` | int | |
| `exp`, `maxExp` | int | |
| `yang` | int | |
| `statPoints`, `skillPoints` | int | harcanmamış puanlar |
| `str`, `dex`, `con`, `iq` | int | statlar |
| `x`, `y` | float | konum (oyun birimi) |
| `rot` | float | bakış yönü (derece) |
| `dead` | bool | |
| `channel` | int | 1..6, 0 = bilinmiyor |

### xs.GetPosition()

Oyun biriminde `(x, y)` döndürür.

### xs.GetMap()

Ham harita adı, örn. `"metin2_map_a1"`.

### xs.IsInGame()

Karakter oyundayken `True`.

### xs.IsDead()

Karakter ölüyken `True`.

### xs.GetSkills()

Karakterin becerilerinin listesi; her biri bir dict:
`{"vnum", "name", "level", "grade", "slot", "active", "cooldown"}`.
Beceriler okunamazsa reddedilir (`False`).

### xs.GetWeapon()

Takılı silahın VNUM'u ya da `None`.

---

## 6. Varlıklar ve yerdeki eşyalar

### xs.GetEntities(kind="", vnum=0, maxDist=0, alive=True, name="", limit=0)

Etrafınızdaki moblar, taşlar, NPC'ler, oyuncular ... listesi; **en yakın
önce**.

| Parametre | Anlamı |
|---|---|
| `kind` | `"mob"`, `"boss"`, `"stone"`, `"npc"`, `"player"`, `"gm"`, `"portal"`; birden çoğu için `\|`: `"mob\|boss"`. Boş = hepsi |
| `vnum` | yalnızca bu VNUM (0 = hepsi) |
| `maxDist` | yalnızca bu mesafe içinde (0 = sınırsız) |
| `alive` | `True` = ölüleri atla |
| `name` | yalnızca bu metni içeren adlar (büyük/küçük harf ayırmaz) |
| `limit` | en fazla bu kadar (0 = sınırsız) |

Her kayıt: `{"vid", "vnum", "name", "kind", "level", "x", "y", "dist", "dead"}`.

```python
for s in xs.GetEntities(kind="stone", maxDist=5000):
    print s["name"], s["level"], int(s["dist"])
```

### xs.GetNearest(kind="", vnum=0, maxDist=0, alive=True, name="")

Aynı filtre; yalnızca en yakın kaydı ya da `None` döndürür.

### xs.GetEntity(vid)

Bu VID'in kaydı; etrafta değilse `None`.

### xs.IsAlive(vid)

VID etraftaysa ve canlıysa `True`.

### xs.GetGroundItems(maxDist=0)

Yerdeki eşyalar, en yakın önce:
`{"vid", "vnum", "x", "y", "dist", "own", "owner"}`. Eşya sizin karakterinize
aitse `own` `True` olur; `owner` sahibinin adıdır (`""` = sahipsiz).

---

## 7. Envanter ve eşyalar

### xs.GetItems(names=False)

Envanterdeki eşyaların listesi: `{"slot", "vnum", "count", "name", "attrs"}`.
`attrs`, `{"type", "value"}` (efsunlar) listesidir. `name`'i doldurmak için
`names=True` verin (daha yavaş). Envanter okunamazsa reddedilir.

### xs.FindItem(vnum)

Bu VNUM'a sahip ilk envanter eşyası ya da `None`.

### xs.CountItem(vnum)

Envanterdeki bu VNUM'un toplam adedi.

### xs.GetInventoryCapacity()

Kullanılabilir envanter slotu sayısı.

### xs.GetInventoryUsed()

Envanterdeki eşya sayısı (eşya başına bir; büyük eşya da bir sayılır).

### xs.UseItem(slot)

`slot` numaralı envanter slotundaki eşyayı kullanır.
Red nedenleri: `invalid slot`, kapı nedenleri.

### xs.UseItemVnum(vnum)

Bu VNUM'a sahip ilk eşyayı kullanır. `item not in inventory` ile reddedilir.

### xs.DropItem(slot, count=0)

`slot`'taki eşyayı yere atar. `count` = 0 tüm yığını atar.
Red nedenleri: `slot is empty`, `alchemy item is protected` (Ejderha Taşı
parçaları, Cor Draconis ailesi ve altın/gümüş külçeler asla atılmaz).

### xs.GetItemProto(vnum)

Eşya tablosu verisi: `{"type", "subType", "size", "antiFlags"}` ya da `None`.

---

## 8. Eylemler

Tüm eylemler paketleri botun kendi göndericisinden yollar: kanal değişimi
sırasında beklerler ve oyunda değilken reddedilirler.

### xs.Attack(vid)

Canlı bir hedefe tek saldırı. Hedef karaktere **280** birim yakın olmalıdır
(uzaktan saldırı yok). Red nedenleri: `no target`, `target is dead`,
`out of range`, `character is dead`.

### xs.Kill(vid, timeout=60000, delay=None, skill=0) *(yield)*

Hedefe yürür ve ölene kadar saldırır.

| Parametre | Anlamı |
|---|---|
| `timeout` | bu kadar ms sonra vazgeç (`"timeout"`) |
| `delay` | saldırılar arası ms, `None` = botun saldırı gecikmesi ayarı |
| `skill` | her vuruşta kullanılacak beceri VNUM'u, 0 = yok |

Hedef öldüğünde ya da kaybolduğunda `True`, aksi halde `False` döndürür.

```python
m = xs.GetNearest(kind="mob", maxDist=2000)
if m:
    ok = yield xs.Kill(m["vid"], timeout=30000)
```

### xs.Pickup(vid)

**300** birim içindeki yerdeki eşyayı toplar. Red nedenleri: `no item`,
`out of range`.

### xs.Click(vid)

**1000** birim içindeki bir NPC ile konuşur (tıklama gibi). Red nedenleri:
`no target`, `out of range`.

### xs.UseSkill(vnum, target=0)

Karakterin öğrendiği bir beceriyi `target` VID'ine kullanır (0 = hedefsiz).
Oyunun kendi bekleme süresi geçerlidir. Red nedenleri: `no such skill`,
`skill not learned`.

### xs.Chat(message, type=0)

Sohbet mesajı gönderir (1..200 karakter). `type` 0 = normal konuşma.
En fazla **2 saniyede bir mesaj** (tüm betikler için ortak); böylece bir betik
hesabı spam yüzünden susturtamaz. Daha hızlı çağrı
`chat rate limit (1 message per 2 s)` ile reddedilir.

### xs.StatUp(stat)

Bir statü puanı harcar. `stat`: `"st"`, `"dx"`, `"ht"` ya da `"iq"`.

### xs.SkillUp(vnum)

`vnum` becerisine bir beceri puanı harcar.

---

## 9. Hareket

Karakteri başka bir motor sürerken hareket istekleri reddedilir
(bkz. [Kurallar](#2-bilmeniz-gereken-kurallar)). Betiği **durdurursanız**
(ya da hata ile durursa) başlattığı yürüyüş ya da ışınlanma da durur.
Kendiliğinden biten betik (örneğin tek satırlık `xs.Teleport(...)`) onu iptal
etmez.

Koordinatlar **oyun birimidir** = harita koordinatı × 100. Karakterin
basamayacağı bir hedef `destination not walkable` ile reddedilir; iki sayı da
küçükse mesaj × 100'ü hatırlatır:

```python
xs.Teleport(44100, 59600)    # doğru: harita 441, 596
xs.Teleport(441, 596)        # reddedilir: destination not walkable - coordinates are game units (map coordinate x 100)
```

### xs.Walk(x, y)

Engellerin etrafından dolaşan bir yolla `(x, y)`'ye yürür (haritada sağ tık
ile aynı). Red nedenleri: `destination not walkable`, `invalid destination`.

### xs.Teleport(x, y)

Geçerli haritada `(x, y)`'ye ışınlanır. Haritanın **Teleport** seçeneği
(`C_RadarTeleport`) açık olmalıdır; değilse `teleport is off` ile reddedilir.
Hedef basılabilir değilse `destination not walkable` ile reddedilir.

### xs.Go(x, y)

Hedef 1200 birimden yakınsa yürür, uzaksa ışınlanır (Teleport kapalıysa hep
yürür).

### xs.MoveTo(x, y, radius=250, timeout=120000, teleport=False) *(yield)*

Hareket eder ve karakter hedefe `radius` kadar yaklaşana kadar bekler.
`teleport=True` `xs.Walk` yerine `xs.Go` kullanır. Varınca `True`,
reddedilir ya da zaman aşımına uğrarsa `False` döndürür (yürüyüş durdurulur).

### xs.StopMoving()

Yürüyüşü durdurur ve süren ışınlanmayı iptal eder.

### xs.IsMoving()

Yürürken ya da ışınlanırken `True`.

### xs.IsWalkable(x, y)

Karakter bu noktada durabiliyorsa `True`.

### xs.Distance(x, y)

Karakterden `(x, y)`'ye mesafe.

### xs.GetMotionBlock()

Betik karakteri hareket ettirebiliyorsa `None`, aksi halde nedeni
(`"route bot is on"`, `"level bot is on"`, `"sell trip in progress"`, ...).

---

## 10. NPC diyalogları

### xs.GetDialogOptions(maxAge=5000)

Açık diyaloğun seçenekleri: `{"index", "text"}` listesi. Son `maxAge` ms
içinde diyalog görülmediyse boş.

### xs.IsDialogOpen()

Seçenekli ya da "sonraki sayfa"lı bir diyalog açıksa `True`.

### xs.DialogHasNext()

Diyalogda "sonraki sayfa" (devam) düğmesi varsa `True`.

### xs.DialogChoose(keyword_or_index)

Bir seçenek seçer. Metin verilirse onu içeren ilk seçenek seçilir (büyük/küçük
harf ayırmaz); sayı verilirse o indeksteki seçenek. `True` / `False` döndürür.
Hiçbir seçenek eşleşmezse **hiçbir şeye tıklanmaz**: `option not found` ile
reddedilir.

```python
if xs.DialogChoose("Shop"):
    print "market açıldı"
```

### xs.DialogNext()

Sonraki sayfaya geçer. Diyaloğun sonunda reddedilir
(`dialog ended (kind=1) - use xs.DialogClose()`): o zaman `xs.DialogClose()`
çağırın.

### xs.DialogClose()

Diyaloğu kapatır.

---

## 11. Bot ayarları

Bot penceresinde değiştirebildiğiniz her ayarın bir adı vardır. Tam liste:
[Ayarlar listesi](#17-ayarlar-listesi).

### xs.GetSetting(name)

Güncel değer: `True`/`False`, int ya da float.

### xs.SetSetting(name, value)

Bir ayarı bot penceresi gibi değiştirir (aynı yan etkiler, profile kaydedilir).
Sayılar izin verilen aralığa kırpılır.

- `C_RangeDamage` ile `C_ExploitDamage` ve `C_AutoReviveHere` ile
  `C_AutoReviveCity` birbirini dışlar.
- Rota yüklü değilken `C_RouteActive = True` reddedilir.
- Betikten bir botu başlatmak ana anahtarı **açmaz**; `C_BotPower`'ı da
  `True` yapın (bot penceresinin Start düğmeleri bunu yapar).

```python
xs.SetSetting("C_BotPower", True)
xs.SetSetting("C_Farmbot", True)
```

### xs.GetSettings(group="")

Tüm ayarların (ya da bir grubun) listesi: `{"name", "group", "type",
"value", "min", "max"}`.

---

## 12. Rota ve profil

### xs.LoadRoute(name, timeout=15000) *(yield)*

`C:\Xweardes\routes\<name>.route` dosyasını yükler (**Load Route** gibi).
`True`/`False` döndürür.

### xs.RouteStart()

Rota botunu başlatır. Rota yüklü değilse reddedilir.

### xs.RouteStop()

Rota botunu durdurur.

### xs.GetRouteName()

Yüklü rotanın adı.

### xs.IsRouteActive()

Rota botu çalışırken `True`.

### xs.IsRouteLoaded()

Bir rota yüklüyse `True`.

### xs.GetRoutes()

`C:\Xweardes\routes` içindeki rotaların adları.

### xs.LoadProfile(name, timeout=15000) *(yield)*

`C:\Xweardes\profiles` içinden bir profil yükler (bot penceresinde seçmek
gibi).

### xs.SaveProfile(name="", timeout=15000) *(yield)*

Güncel ayarları bir profile kaydeder (`""` = geçerli profil).

### xs.GetProfile()

Geçerli profilin adı.

### xs.GetProfiles()

Tüm profillerin adları.

```python
def main():
    ok = yield xs.LoadRoute("devil_tower")
    if ok:
        xs.SetSetting("C_BotPower", True)
        xs.RouteStart()
```

---

## 13. Kanal, karakter, çıkış

### xs.GetChannel()

Geçerli kanal (1..6, 0 = bilinmiyor).

### xs.ChangeChannel(channel)

`channel` (1..6) kanalına geçişi başlatır. Hemen döner; beklemek için
`xs.GoChannel`'a bakın. Red nedenleri: `already on this channel`,
`switch already in progress`, `no connection detected`.

### xs.GoChannel(channel, timeout=60000) *(yield)*

Kanal değiştirir ve karakter yeni kanalda oyuna dönene kadar bekler.

### xs.Relog()

Geçerli kanala yeniden bağlanır.

### xs.RandomChannel()

**Security**'de seçili kanallardan rastgele birine geçer.

### xs.IsChannelBusy()

Kanal ya da karakter değişimi sürerken `True`.

### xs.SwitchCharacter(slot)

Hesabın `slot` (1..5) numaralı karakterine geçer.

### xs.GetCharacterNames()

Hesabın 5 karakter adı (`""` = boş slot).

### xs.Logout()

Hızlı çıkış (Fast Logout).

---

## 14. Satış ve Helper (harita yolculuğu)

### xs.SellNow()

Hemen bir satış turu başlatır (**Sell now** gibi).

### xs.SellStop()

Satış turunu iptal eder.

### xs.GetSellStatus()

Satış turunun durum metni.

### xs.IsSelling()

Satış turu sürerken `True`.

### xs.HelperGo(map_name)

Başka bir haritaya gider (portallar, Yaşlı Adam ve ışınlayıcı NPC; aralarda
yürür). Red nedeni: `helper already running`.

### xs.Travel(map_name, timeout=600000) *(yield)*

`HelperGo` yapar ve yolculuk bitene kadar bekler.

### xs.HelperTeleporter(text)

Geçerli haritanın ışınlayıcı NPC'sini kullanır: menü metni `text`'i içeren ya
da haritası `text` olan hedefi seçer.
Red nedeni: `teleporter destination not found`.

### xs.HelperStop()

Helper yolculuğunu durdurur.

### xs.IsHelperBusy()

Helper yolculuğu sürerken `True`.

### xs.GetHelperStatus()

Helper'ın durum metni.

### xs.GetHelperDestinations()

Geçerli haritadan ulaşılabilen haritalar (`HelperGo`'ya verilebilecek adlar).

---

## 15. Bot listeleri

Bunlar bot penceresindeki listelerin aynısını değiştirir (profille kaydedilir).

### Otomatik beceriler

| Fonksiyon | Anlamı |
|---|---|
| `xs.AutoSkillCast(vnum, on=True)` | beceriyi otomatik kullanmaya ekle/çıkar |
| `xs.AutoSkillUp(vnum, on=True)` | beceriyi otomatik geliştirmeye ekle/çıkar |
| `xs.GetAutoSkills()` | `{"cast": [vnumlar], "up": [vnumlar]}` |

### Toplama listesi

| Fonksiyon | Anlamı |
|---|---|
| `xs.PickupFilterAdd(vnum)` | VNUM ekle |
| `xs.PickupFilterRemove(vnum)` | VNUM çıkar |
| `xs.PickupFilterClear()` | listeyi boşalt |
| `xs.PickupFilterHas(vnum)` | listedeyse `True` |
| `xs.GetPickupFilter()` | VNUM listesi |

Listenin anlamını `C_PickupListMode` belirler (hepsi / yalnızca listedekiler /
listedekiler hariç).

### Market kuralları

| Fonksiyon | Anlamı |
|---|---|
| `xs.MarketRuleSet(vnum, action, name="")` | `action`: `"sell"` (sat), `"drop"` (at), `"dropfull"` (200'lük tam yığınları at), `"dontsell"` (satma) |
| `xs.MarketRuleRemove(vnum)` | kuralı kaldır |
| `xs.MarketRuleClear()` | tüm kuralları kaldır |
| `xs.GetMarketRules()` | `{"vnum", "action", "name"}` listesi |

### Saldırı filtresi

| Fonksiyon | Anlamı |
|---|---|
| `xs.AttackFilterAdd(vnum)` | mob VNUM'u ekle |
| `xs.AttackFilterRemove(vnum)` | çıkar |
| `xs.AttackFilterClear()` | boşalt |
| `xs.GetAttackFilter()` | VNUM listesi |

`C_AttackFilterEnable` açıkken kullanılır.

### Use Item

| Fonksiyon | Anlamı |
|---|---|
| `xs.UseItemAdd(vnum, interval=60, name="")` | bu eşyayı her `interval` saniyede kullan |
| `xs.UseItemRemove(vnum)` | çıkar |
| `xs.UseItemClear()` | boşalt |
| `xs.GetUseItems()` | `{"vnum", "interval", "name"}` listesi |

`C_UseItemBot` açıkken çalışır.

### Efsun filtresi (Items > Attribute)

| Fonksiyon | Anlamı |
|---|---|
| `xs.AttrKeepAdd(type, min=0)` | `type` efsunu ≥ `min` olan eşyaları **tut** (asla satılmaz, atılmaz) |
| `xs.AttrKeepRemove(type)` | satırı kaldır |
| `xs.AttrKeepClear()` | boşalt |
| `xs.GetAttrKeep()` | `{"type", "min"}` listesi |
| `xs.AttrDropAdd(type, min=0)` | `type` efsunu < `min` olan eşyaları **at** |
| `xs.AttrDropRemove(type)` | satırı kaldır |
| `xs.AttrDropClear()` | boşalt |
| `xs.GetAttrDrop()` | `{"type", "min"}` listesi |

`AttrDropAdd`'de `type` olarak `xs.ATTR_NONE` (999) "hiç efsunu olmayan silah
ve zırhlar" demektir. Tut satırları at satırlarından önceliklidir.

### Beyaz liste (Security)

| Fonksiyon | Anlamı |
|---|---|
| `xs.WhitelistAdd(name)` | oyuncu adı ekle (1..32 karakter) |
| `xs.WhitelistRemove(name)` | çıkar |
| `xs.WhitelistClear()` | boşalt |
| `xs.GetWhitelist()` | ad listesi |

---

## 16. Oyun içi pencereler

Oyunun kendi `ui` modülüyle pencere yapabilirsiniz. Düğmelerini oyun çağırır;
içlerinden herhangi bir `xs` fonksiyonunu çağırabilirsiniz.

```python
import xs, ui

class Panel(ui.BoardWithTitleBar):
    def __init__(self):
        ui.BoardWithTitleBar.__init__(self)
        self.AddFlag("movable")
        self.SetSize(180, 80)
        self.SetPosition(20, 200)
        self.SetTitleName("Panelim")
        self.SetCloseEvent(xs.Stop)             # pencereyi kapatmak betiği durdurur
        self.btn = ui.Button()
        self.btn.SetParent(self)
        self.btn.SetPosition(15, 40)
        self.btn.SetUpVisual("d:/ymir work/ui/public/large_button_01.sub")
        self.btn.SetOverVisual("d:/ymir work/ui/public/large_button_02.sub")
        self.btn.SetDownVisual("d:/ymir work/ui/public/large_button_03.sub")
        self.btn.SetText("Git")
        self.btn.SetEvent(lambda: xs.Spawn(xs.MoveTo(48000, 52000)))
        self.btn.Show()
        self.Show()

panel = Panel()
xs.On("stop", panel.Hide)                       # betiği durdurmak pencereyi kapatır
```

- Pencerenize bir referans tutun (`panel = ...`), yoksa oyun onu siler.
- Pencerelerinizi her zaman `"stop"` olayında kapatın.
- Pencere geri çağrılarının içinde `print` konsola değil oyunun çıktısına
  gider ve süre sınırı yoktur: uzun işleri `xs.Spawn` ile başlatın.
- Pencereleri `OnUpdate` yerine `xs.Every` ile güncelleyin.
- Tam bir örnek `xs_gui.py`'dir (hasar, toplama, hız, level bot, rota, kanal ve
  harita yolculuğu için kontrol penceresi).

---

## 17. Ayarlar listesi

`xs.GetSetting` / `xs.SetSetting` için adlar. Mesafeler oyun birimidir (bot
penceresi 100'e bölünmüş gösterir). `xs.GetSettings()` aynı listeyi güncel
değerlerle döndürür. Tırnak içindeki adlar bot penceresindeki etiketlerdir.

### main

| Ad | Tür | Aralık | Anlamı |
|---|---|---|---|
| `C_BotPower` | bool | | Ana anahtar. Kapalı = hiçbir bot motoru çalışmaz (istemci başına kaydedilir, profilde değil) |
| `C_Wallhack` | bool | | Wall Hack |
| `C_GhostMode` | bool | | Ghost Mode (ölüyken yürü) |
| `C_Zoom` | bool | | Kamera yakınlaştırma |
| `C_ZoomValue` | float | 3500..30000 | En büyük kamera mesafesi |
| `g_BoostEnabled` | bool | | Move Speed |
| `g_BoostSpeed` | int | 100..1500 | Move Speed değeri (hız oranı x 100; 100 = normal) |
| `C_AutoReviveHere` | bool | | "Revive Here" (burada diril) |
| `C_AutoReviveCity` | bool | | "Revive in Town" (şehirde diril) |
| `C_AutoReviveDelaySec` | int | 1..170 | "Revive Here": ölümden kaç sn sonra dirilsin (180 sn'de sunucu kendisi şehirde başlatır) |
| `C_ReviveHpWait` | bool | | "Revive HP": dirildikten sonra can `C_ReviveHpPct`'e gelene kadar hasar yok |
| `C_ReviveHpPct` | int | 1..100 | Dirildikten sonra beklenen can % |
| `C_AutoMount` | bool | | "Auto Mount": binekte kal; Auto Skill ile in, beceriyi bas, tekrar bin |
| `C_AutoRelogin` | bool | | Kopmadan sonra Auto Login |
| `C_AutoPotionRed` | bool | | Kırmızı iksir |
| `C_AutoPotionRedPercent` | float | 0..100 | HP bu %'nin altına inince kırmızı iksir |
| `C_AutoPotionBlue` | bool | | Mavi iksir |
| `C_AutoPotionBluePercent` | float | 0..100 | SP bu %'nin altına inince mavi iksir |
| `C_AutoStatus` | bool | | Auto Status (statü puanı harca) |
| `C_AutoSword` | bool | | Auto Sword (acemi silah görevi) |
| `C_AutoSwordType` | int | -1..6 | Silah: -1 = sınıfa göre, 0 Kılıç, 1 Bıçak, 2 Yay, 3 Çift el, 4 Çan, 5 Yelpaze, 6 Pençe |
| `C_AutoLearn` | bool | | Auto Learn (beceri öğretmeni) |
| `C_AutoLearnTree` | int | 0..1 | Sınıfın birinci ya da ikinci beceri grubu |
| `C_BindChannel` | bool | | Bind: başka bir istemcinin kanalını takip et |
| `C_BindSlotId` | int | 0..60 | Takip edilecek istemci slotu |
| `C_RadarTeleport` | bool | | Teleport (harita tıklaması / `xs.Teleport` / `xs.Go`) |
| `C_LevelAutoConfig` | bool | | Level Settings (seviyeye göre profil) |
| `C_QU_DragonAtk` | bool | | Quick Use: Ejderha Tanrısı Saldırısı |
| `C_QU_CritHit` | bool | | Quick Use: Kritik Vuruş |
| `C_QU_PierceHit` | bool | | Quick Use: Delici Vuruş |
| `C_QU_ThiefGlove` | bool | | Quick Use: Hırsız Eldiveni |
| `C_QU_Wisdom3h` | bool | | Quick Use: Bilgelik (3 sa) |
| `C_QU_Wisdom1h` | bool | | Quick Use: Bilgelik (1 sa) |
| `C_QU_NoviceChest` | bool | | Quick Use: Çırak sandıkları |
| `C_QU_PurplePot` | bool | | Quick Use: Mor iksir |
| `C_QU_GreenPot` | bool | | Quick Use: Yeşil iksir |

### damage

| Ad | Tür | Aralık | Anlamı |
|---|---|---|---|
| `C_RangeDamage` | bool | | Hasar kipi **Attack** |
| `C_ExploitDamage` | bool | | Hasar kipi **Exploit** |
| `C_ExploitDamageMode` | int | 0..1 | Exploit rolü: 0 = Main, 1 = Dummy |
| `C_ExploitAutoSleep` | bool | | Exploit Auto Sleep |
| `C_ExploitSleepValue` | int | 0..1000 | Auto Sleep kapalıyken Exploit beklemesi (ms) |
| `C_AttackDelayMs` | int | 50..500 | Saldırı gecikmesi (ms) |
| `C_AttackMaxTargets` | int | 1..30 | "Limit": aynı anda kaç moba vurulur (kare kancası olmayan eski motor en fazla 15) |
| `C_RangeDistance` | float | 0..100000 | Hasar menzili (Fov) |
| `C_DmgMob` | bool | | Mobları hedefle |
| `C_DmgStone` | bool | | Taşları hedefle |
| `C_DmgBoss` | bool | | Bossları hedefle |
| `C_RangeDamagePlayer` | bool | | Oyuncuları hedefle |
| `C_SafeMode` | bool | | Safe |
| `C_AttackFilterEnable` | bool | | Saldırı filtresi listesini kullan |
| `C_StoneLevelFilter` | bool | | Taş seviye aralığı (Level Bot) |
| `C_StoneLevelMin` | int | 1..250 | En düşük taş seviyesi |
| `C_StoneLevelMax` | int | 1..250 | En yüksek taş seviyesi |

### route

| Ad | Tür | Aralık | Anlamı |
|---|---|---|---|
| `C_RouteActive` | bool | | Rota botu çalışıyor (yüklü rota gerekir) |
| `C_RouteStoneBreak` | bool | | Rotada taşlara saldır |
| `C_RouteBossBreak` | bool | | Rotada bosslara saldır |
| `C_RouteTpToStart` | bool | | Rota bitince başa ışınlan |
| `C_RouteChangeChannel` | bool | | Rota bitince kanal değiştir |
| `C_RouteStoneLevelFilter` | bool | | Rotada taş seviye aralığı |
| `C_RouteStoneLevelMin` | int | 1..250 | En düşük taş seviyesi |
| `C_RouteStoneLevelMax` | int | 1..250 | En yüksek taş seviyesi |

### levelbot

| Ad | Tür | Aralık | Anlamı |
|---|---|---|---|
| `C_Farmbot` | bool | | Level Bot çalışıyor |
| `C_FarmMob` | bool | | Level Bot mobları hedefler |
| `C_FarmBoss` | bool | | Level Bot bossları hedefler |
| `C_Stone` | bool | | Level Bot taşları hedefler |
| `C_FarmGoOnly` | bool | | "Just go to target" (yalnızca hedefe git) |
| `C_FarmTargetDistance` | float | 0..100000 | Level Bot menzili (Fov) |
| `C_FarmRangeCircle` | bool | | "Follow circle" (çemberi takip et) |
| `C_FarmCenterOn` | bool | | Center noktasını kullan |
| `C_FarmCenterX` | int | 0..100000 | Center X (harita koordinatı) |
| `C_FarmCenterY` | int | 0..100000 | Center Y (harita koordinatı) |
| `C_StoneDetector` | bool | | Stone Detector |
| `C_BossDetector` | bool | | Boss Detector |
| `C_ExitLevelEnable` | bool | | "Exit client at level" (seviyede istemciden çık) |
| `C_ExitLevelNextChar` | bool | | "Next character first" (önce sonraki karakter) |
| `C_ExitLevel` | int | 1..250 | Hedef seviye |

### pickup

| Ad | Tür | Aralık | Anlamı |
|---|---|---|---|
| `C_AutoPickup` | bool | | Walk Pickup (yürüyerek topla) |
| `C_RangePickup` | bool | | Range Pickup (menzilden topla) |
| `C_PickupRange` | float | 0..100000 | Toplama menzili |
| `C_PickupSpeed` | float | 0..100000 | Toplama gecikmesi (ms) |
| `C_PickupYangOnly` | bool | | Yalnızca Yang |
| `C_PickupListMode` | int | 0..2 | 0 = hepsi, 1 = yalnızca listedekiler, 2 = listedekiler hariç |
| `C_PickupRequireOwner` | bool | | "Skip ownerless items" (sahipsizleri atla) |
| `C_PickupOwnerYangExempt` | bool | | "Take Yang anyway" (Yang'ı yine de al) |
| `C_PickupMinPriceEnable` | bool | | Yalnızca satış fiyatı ≥ en düşük değer olanlar |
| `C_PickupMinPrice` | int | 0..2000000000 | En düşük satış fiyatı |

### market

| Ad | Tür | Aralık | Anlamı |
|---|---|---|---|
| `C_AutoSellFull` | bool | | Boş slot azalınca markete git |
| `C_AutoSellThreshold` | int | 0..180 | Boş slot sınırı |
| `C_SellNpcKind` | int | 0..1 | 0 = Satıcı, 1 = Balıkçı |
| `C_SellTown` | int | 0..1 | Köy 1 / Köy 2 |
| `C_FastSell` | bool | | Anında satış (Insta sell) |
| `C_UseEnasir` | bool | | Satıcıya gitmek yerine Enasir'i (çağrılan gezgin satıcı) çağırıp ona sat |

### items

| Ad | Tür | Aralık | Anlamı |
|---|---|---|---|
| `C_FilterByAttributes` | bool | | Efsun filtresi: Keep (tut) tablosu açık |
| `C_AttrDropEnabled` | bool | | Efsun filtresi: Drop (at) tablosu açık |
| `C_AttrLangTR` | bool | | Efsun adları Türkçe |
| `C_UseItemBot` | bool | | Use Item çalışıyor |

### helper

| Ad | Tür | Aralık | Anlamı |
|---|---|---|---|
| `C_AutoStack` | bool | | Eşyaları otomatik yığ |
| `C_AutoSplit` | bool | | `C_SplitVnum` yığınlarını `C_SplitSize`'lık parçalara ayır (açmak `C_AutoStack`'i kapatır) |
| `C_SplitVnum` | int | 0..999999999 | Ayrılacak eşyanın vnum'u (0 = yok) |
| `C_SplitSize` | int | 1..199 | Her parçanın adedi |
| `C_AutoRelogEnable` | bool | | X dakikada bir relog |
| `C_AutoRelogMinutes` | int | 1..1440 | Dakika |
| `C_AutoRestartEnable` | bool | | X saatte bir istemciyi yeniden başlat |
| `C_AutoRestartHours` | int | 1..240 | Saat |

### event

| Ad | Tür | Aralık | Anlamı |
|---|---|---|---|
| `C_OkeyAuto` | bool | | Okey otomatik oyun |
| `C_OkeyGames` | int | 0..200 | Oynanacak oyun sayısı |
| `C_OkeyGapMs` | int | 50..3000 | Hamleler arası gecikme (ms) |
| `C_YutAuto` | bool | | Yutnori otomatik oyun |
| `C_YutGames` | int | 0..999 | Oynanacak oyun sayısı (0 = tahta bitene kadar) |
| `C_YutGapMs` | int | 10..5000 | Gecikme (ms) |
| `C_AlcEnable` | bool | | Simya: Lv 30'dan sonra Simyacı ile konuş |
| `C_AlcShopMap` | bool | | Simya: market haritasına git |
| `C_AlcAllChars` | bool | | Simya: tüm karakterleri kontrol et |
| `C_AlcStopDone` | bool | | Simya: görev bitince dur |
| `C_AlcExitDone` | bool | | Simya: görev bitince çık |
| `C_AlcStore` | bool | | Simya: corları depoya koy |
| `C_AlcStoreCorCount` | int | 0..1000 | En az bu kadar cor varsa depola |
| `C_AlcBuyBars` | bool | | Simya: altın / gümüş külçe al |
| `C_AlcKeepYang` | int | 0..2000000000 | En az bu kadar Yang bırak |
| `C_GobEnable` | bool | | Goblin hazine avı (Lv 70+) |
| `C_GobAttack` | bool | | Goblin: Attack |
| `C_GobSafe` | bool | | Goblin: Safe |
| `C_GobSpeed` | bool | | Goblin hızı (1.5M Yang) |
| `C_GobDoblonMin` | int | 90..875 | Doblon eşiği |
| `C_GobKeyTarget` | int | 1..1000 | Bu kadar Goblin Anahtarında dur |
| `C_EngEnable` | bool | | Hammer Energy çalışıyor |
| `C_EngSource` | int | 0..1 | 0 = envanterdeki eşyalar, 1 = Silah Satıcısından al |
| `C_EngHammerBuy` | int | 1..10000 | Alınacak çekiç sayısı |
| `C_EngBuyHammers` | bool | | Çekiç bitince Simyacıdan al |
| `C_EngMinYang` | int | 0..2000000000 | En az Yang |
| `C_EngItemVnum` | int | 0..999999 | Alınacak eşya VNUM'u (0 = en ucuz) |
| `C_EngShopTown` | int | 0..1 | Silah Satıcısı Köy 1 / Köy 2'de |
| `C_TrEnable` | bool | | Zaman Çatlağı çalışıyor |
| `C_TrDungeon` | int | 0..3 | Zindan: 0 Sürgün Mağarası, 1 Kırmızı Ejderha Kalesi, 2 Nemere Gözlemevi, 3 Efsunlu Orman |
| `C_TrWatchBuy` | int | 1..1000 | Alınacak Cep Saati |
| `C_TrWalk` | bool | | Zaman Çatlağı: platoda hep yürü (Teleport'a bakma) |

### security

| Ad | Tür | Aralık | Anlamı |
|---|---|---|---|
| `C_SecurityEnable` | bool | | Security açık |
| `C_SecurityAutoWhitelist` | bool | | "Whitelist my clients" (kendi istemcilerimi beyaz listeye al) |
| `C_SecurityGM_StopBot` | bool | | GM yakında: botu durdur |
| `C_SecurityGM_CloseGame` | bool | | GM yakında: oyunu kapat |
| `C_SecurityGM_ChangeChannel` | bool | | GM yakında: kanal değiştir |
| `C_SecurityPlayer_StopBot` | bool | | Oyuncu yakında: botu durdur |
| `C_SecurityPlayer_CloseGame` | bool | | Oyuncu yakında: oyunu kapat |
| `C_SecurityPlayer_ChangeChannel` | bool | | Oyuncu yakında: kanal değiştir |
| `C_SecurityCHMask` | int | 1..63 | Geçilecek kanallar: bit 1 = CH1, 2 = CH2, 4 = CH3, 8 = CH4, 16 = CH5, 32 = CH6 |

---

## 18. Hata mesajları

Mesajlar oyunda olduğu gibi (İngilizce) yazılmıştır.

### Red nedenleri (`xs.GetLastError()`)

| Neden | Anlamı |
|---|---|
| `not in game` | karakter oyunda değil |
| `channel/character switch in progress` | değişim bitene kadar bekleyin |
| `no offsets` | bot hazır değil (panelden başlatılmamış) |
| `route bot is on`, `level bot is on`, `sell trip in progress`, `helper trip in progress`, `quest engine busy (sword/learn)` | karakteri başka bir motor sürüyor |
| `out of range` | hedef çok uzak |
| `no target`, `target is dead`, `no item` | VID etrafta değil / ölü |
| `character is dead` | karakter ölü |
| `invalid destination` | bu noktaya yol yok |
| `destination not walkable` | hedef nokta duvar / harita dışı; koordinatlar oyun birimidir (harita koordinatı × 100) |
| `teleport is off (C_RadarTeleport)` | Teleport'u açın |
| `timeout` | *(yield)* fonksiyonu zamanında bitmedi |
| `send failed` | oyun paketi kabul etmedi |
| `task limit reached` | betiğin 64 görevi var |
| `chat rate limit (1 message per 2 s)` | sohbet mesajları arasında 2 saniye bekleyin |

### Betik hataları (Scripts sekmesinde kırmızı durum)

| Mesaj | Çözüm |
|---|---|
| `ran N ms without yielding (infinite loop?)` | döngülerin içine `yield xs.Wait(ms)` ekleyin |
| `blocked the game for N ms ... (time.sleep?)` | `time.sleep(s)` yerine `yield xs.Wait(s * 1000)` yazın |
| `a task may only yield a number (ms), None, a generator or xs.Return(value)` | `yield` ettiğiniz değeri kontrol edin |
| `this xs function needs a running script` | fonksiyon Quick command'dan ya da betik durduktan sonra çağrıldı |
| `this script needs SDK api=N` | botu güncelleyin |
| `unknown setting '...'` | adı [Ayarlar listesi](#17-ayarlar-listesi)'nde kontrol edin |
