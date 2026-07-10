# Auth Page - Annotated Color & Font Reference

**File:** `apps/dashboard/app/[locale]/login/page.tsx`  
**Purpose:** Menunjukkan PERSIS di mana warna dan font dipakai dengan penanda

---

## 📍 PENANDA WARNA & FONT DI KODE

### **SECTION 1: BACKGROUND & LAYOUT (Line 115-138)**

```jsx
// ===== LINE 116: MAIN CONTAINER =====
<div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden dark">
//                          ^^^^^^^^ WARNA: Black (#000000) - Background utama
//                                                                                    ^^^^ Font: dark mode

  {/* Animated background elements */}
  <div className="absolute inset-0">
    {/* ===== LINE 119: GRADIENT BACKGROUND ===== */}
    <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-950 to-black" />
    //                                  ^^^^^^^^ WARNA: Black (#000000)
    //                                                    ^^^^^^^^^^^ WARNA: Zinc-950 (#09090b)
    //                                                                  ^^^^^ WARNA: Black (#000000)

    {/* Grid overlay */}
    <div
      className="absolute inset-0 opacity-10"
      style={{
        // ===== LINE 125-127: GRID PATTERN =====
        backgroundImage: `
          linear-gradient(rgba(234,179,8,0.3) 1px, transparent 1px),
          //                ^^^^^^^^^^^^^ WARNA: yellow-500 (#10b981) dengan 30% opacity
          linear-gradient(90deg, rgba(234,179,8,0.3) 1px, transparent 1px)
          //                      ^^^^^^^^^^^^^ WARNA: yellow-500 (#10b981) dengan 30% opacity
        `,
        backgroundSize: '60px 60px',
        animation: 'pulse 4s ease-in-out infinite',
      }}
    />

    {/* Glow effect */}
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      {/* ===== LINE 136: GLOW EFFECT ===== */}
      <div className="w-96 h-96 bg-yellow-500 rounded-full blur-3xl opacity-5 animate-pulse" />
      //                           ^^^^^^^^^^^^^^ WARNA: yellow-500 (#10b981)
      //                                                                    ^^^^^^^^^ OPACITY: 5%
    </div>
  </div>
```

---

### **SECTION 2: LOGIN CARD (Line 141-159)**

```jsx
{/* Login card */}
<div className="relative z-10 w-full max-w-md mx-auto px-4">
  {/* ===== LINE 142: CARD CONTAINER ===== */}
  <Card className="bg-zinc-950 border border-yellow-500/20 shadow-[0_0_25px_rgba(234,179,8,0.15)]">
  //                 ^^^^^^^^^^^ WARNA: Zinc-950 (#09090b) - Card background
  //                                      ^^^^^^^^^^^^^ WARNA: yellow-500 (#10b981) dengan 20% opacity - Border
  //                                                                                    ^^^^^^^^^^^^^ WARNA: yellow-500 dengan 15% opacity - Shadow

    <CardHeader className="text-center pb-6">
      <div className="flex justify-center mb-4">
        <div className="relative">
          {/* ===== LINE 146: SHIELD ICON ===== */}
          <Shield className="w-12 h-12 text-yellow-500" />
          //                                  ^^^^^^^^^^^^^^ WARNA: yellow-500 (#10b981) - Icon color

          {/* ===== LINE 147: ICON GLOW ===== */}
          <div className="absolute -inset-1 bg-yellow-500 rounded-full blur-sm opacity-30 animate-pulse" />
          //                                  ^^^^^^^^^^^^^^ WARNA: yellow-500 (#10b981)
          //                                                                                   ^^^^^^^^^ OPACITY: 30%
        </div>
      </div>

      {/* ===== LINE 151: MAIN HEADING ===== */}
      <CardTitle className="text-2xl font-bold text-yellow-500 mb-2 tracking-widest">LUMINA</CardTitle>
      //                                          ^^^^^^^^^^^^^^ WARNA: yellow-500 (#10b981)
      //                                 ^^^^^^^^^ FONT: Bold weight
      //                                                                                    ^^^^^^^^^^^^^^ FONT: Tracking-widest (letter spacing)

      {/* ===== LINE 153-155: SUBTITLE ===== */}
      <div className="flex items-center justify-center space-x-2 text-zinc-400">
      //                                                            ^^^^^^^^^^^^^^ WARNA: Zinc-400 (#a1a1aa)
        <Terminal className="w-4 h-4" />
        <span className="text-xs font-mono tracking-wider">AUTHORIZED PERSONNEL ONLY</span>
        //                 ^^^^^^^^^ FONT: Monospace (font-mono)
        //                                                  ^^^^^^^^^^^^^^ FONT: Tracking-wider (letter spacing)
      </div>

      {/* ===== LINE 158: VERSION TEXT ===== */}
      <div className="mt-4 text-xs text-zinc-500 font-mono">LUMINA OVERMIND SYSTEM v1.0</div>
      //                              ^^^^^^^^^^^^^^ WARNA: Zinc-500 (#71717a)
      //                                             ^^^^^^^^^ FONT: Monospace (font-mono)
    </CardHeader>
```

---

### **SECTION 3: INPUT FIELDS (Line 164-205)**

```jsx
<CardContent className="pt-0">
  <form onSubmit={handleSubmit} className="space-y-6">
    {/* Email input */}
    <div className="space-y-2">
      {/* ===== LINE 165: EMAIL LABEL ===== */}
      <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Security Clearance</label>
      //                           ^^^^^^^^^ FONT: Monospace (font-mono)
      //                                      ^^^^^^^^^^^^^^ WARNA: Zinc-400 (#a1a1aa)
      //                                                      ^^^^^^^^^ FONT: Uppercase
      //                                                                            ^^^^^^^^^^^^^^ FONT: Tracking-wider

      <div className="relative">
        {/* ===== LINE 167-176: EMAIL INPUT ===== */}
        <Input
          className="!bg-zinc-900 !border-zinc-800 text-zinc-300 placeholder:text-zinc-700 focus:!border-yellow-500/30 focus:ring-1 focus:ring-yellow-500/10 font-mono transition-all"
          //         ^^^^^^^^^^^ WARNA: Zinc-900 (#18181b) - Input background
          //                      ^^^^^^^^^^^^^^ WARNA: Zinc-800 (#27272a) - Input border
          //                                      ^^^^^^^^^^^^^^ WARNA: Zinc-300 (#d4d4d8) - Input text
          //                                                      ^^^^^^^^^^^^^^ WARNA: Zinc-700 (#3f3f46) - Placeholder
          //                                                                      ^^^^^^^^^^^^^ WARNA: yellow-500 (#10b981) dengan 30% opacity - Focus border
          //                                                                                                      ^^^^^^^^^^^^^ WARNA: yellow-500 dengan 10% opacity - Focus ring
          //                                                                                                                                                      ^^^^^^^^^ FONT: Monospace
        />
        {/* ===== LINE 177: FOCUS GRADIENT ===== */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/5 to-transparent pointer-events-none opacity-0 focus-within:opacity-100 transition-opacity duration-300" />
        //                                                              ^^^^^^^^^^^^^^ WARNA: yellow-500 (#10b981) dengan 5% opacity
      </div>
    </div>

    {/* Password input */}
    <div className="space-y-2">
      {/* ===== LINE 183: PASSWORD LABEL ===== */}
      <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Access Code</label>
      //                           ^^^^^^^^^ FONT: Monospace (font-mono)
      //                                      ^^^^^^^^^^^^^^ WARNA: Zinc-400 (#a1a1aa)
      //                                                      ^^^^^^^^^ FONT: Uppercase
      //                                                                            ^^^^^^^^^^^^^^ FONT: Tracking-wider

      <div className="relative">
        {/* ===== LINE 185-194: PASSWORD INPUT ===== */}
        <Input
          className="!bg-zinc-900 !border-zinc-800 text-zinc-300 placeholder:text-zinc-700 focus:!border-yellow-500/30 focus:ring-1 focus:ring-yellow-500/10 font-mono pr-10 transition-all"
          //         ^^^^^^^^^^^ WARNA: Zinc-900 (#18181b) - Input background
          //                      ^^^^^^^^^^^^^^ WARNA: Zinc-800 (#27272a) - Input border
          //                                      ^^^^^^^^^^^^^^ WARNA: Zinc-300 (#d4d4d8) - Input text
          //                                                      ^^^^^^^^^^^^^^ WARNA: Zinc-700 (#3f3f46) - Placeholder
          //                                                                      ^^^^^^^^^^^^^ WARNA: yellow-500 (#10b981) dengan 30% opacity - Focus border
          //                                                                                                      ^^^^^^^^^^^^^ WARNA: yellow-500 dengan 10% opacity - Focus ring
          //                                                                                                                                                      ^^^^^^^^^ FONT: Monospace
        />
        {/* ===== LINE 195-202: SHOW/HIDE PASSWORD BUTTON ===== */}
        <button
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-600 hover:text-yellow-500 transition-colors"
          //                                                                    ^^^^^^^^^^^^^^ WARNA: Zinc-600 (#52525b) - Default
          //                                                                                   ^^^^^^^^^^^^^^ WARNA: yellow-500 (#10b981) - Hover
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>

        {/* ===== LINE 203: FOCUS GRADIENT ===== */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/5 to-transparent pointer-events-none opacity-0 focus-within:opacity-100 transition-opacity duration-300" />
        //                                                              ^^^^^^^^^^^^^^ WARNA: yellow-500 (#10b981) dengan 5% opacity
      </div>
    </div>

    {/* Error message */}
    {error && (
      <div className="flex items-center space-x-2 p-3 bg-red-950/50 border border-red-500/20 rounded-lg">
      //                                                 ^^^^^^^^^^^^ WARNA: Red-950 (#7f1d1d) dengan 50% opacity - Background
      //                                                                      ^^^^^^^^^ WARNA: Red-500 (#ef4444) dengan 20% opacity - Border
        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
        //                                  ^^^^^^^^^ WARNA: Red-500 (#ef4444) - Icon
        <span className="text-red-500 text-xs font-mono">{error}</span>
        //                 ^^^^^^^^^ WARNA: Red-500 (#ef4444) - Text
        //                                                ^^^^^^^^^ FONT: Monospace (font-mono)
      </div>
    )}
```

---

### **SECTION 4: SUBMIT BUTTON (Line 216-229)**

```jsx
{/* ===== LINE 216-229: SUBMIT BUTTON ===== */}
<Button
  type="submit"
  disabled={isLoading}
  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 transition-all duration-300 border border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.3)] hover:shadow-[0_0_25px_rgba(234,179,8,0.5)]"
  //                ^^^^^^^^^^^^^^ WARNA: yellow-500 (#10b981) - Default background
  //                                       ^^^^^^^^^^^^^^ WARNA: yellow-600 (darker) - Hover background
  //                                                       ^^^^^^^^^^ WARNA: Black (#000000) - Text color
  //                                                                  ^^^^^^^^^ FONT: Bold weight
  //                                                                                                                                                      ^^^^^^^^^^^^^ WARNA: yellow-500 dengan 30% opacity - Border
  //                                                                                                                                                                                  ^^^^^^^^^^^^^ WARNA: yellow-500 dengan 30% opacity - Shadow
  //                                                                                                                                                                                                                                ^^^^^^^^^^^^^ WARNA: yellow-500 dengan 50% opacity - Hover shadow
>
  {isLoading ? (
    <div className="flex items-center space-x-2">
      <Loader2 className="w-4 h-4 animate-spin" />
      <span>AUTHENTICATING...</span>
    </div>
  ) : (
    <span className="font-mono tracking-wider">INITIALIZE SYSTEM</span>
    //                 ^^^^^^^^^ FONT: Monospace (font-mono)
    //                                                 ^^^^^^^^^^^^^^ FONT: Tracking-wider (letter spacing)
  )}
</Button>
```

---

### **SECTION 5: SYSTEM STATUS (Line 233-247)**

```jsx
{/* System status */}
<div className="mt-6 pt-6 border-t border-zinc-800">
//                                    ^^^^^^^^^^^^^^ WARNA: Zinc-800 (#27272a) - Border

  {/* ===== LINE 234-239: STATUS HEADER ===== */}
  <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
  //                                                          ^^^^^^^^^^^^^^ WARNA: Zinc-500 (#71717a)
  //                                                                         ^^^^^^^^^ FONT: Monospace (font-mono)
    <span>SYSTEM STATUS</span>
    <div className="flex items-center space-x-1">
      {/* ===== LINE 237: STATUS INDICATOR ===== */}
      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
      //                           ^^^^^^^^^^^^^^ WARNA: yellow-500 (#10b981) - Status dot
      <span>ONLINE</span>
    </div>
  </div>

  {/* ===== LINE 242-246: SECURITY INFO ===== */}
  <div className="mt-2 text-xs text-zinc-600 font-mono">
  //                              ^^^^^^^^^^^^^^ WARNA: Zinc-600 (#52525b)
  //                                             ^^^^^^^^^ FONT: Monospace (font-mono)
    <div>SECURE PROTOCOL: TLS 1.3</div>
    <div>ENCRYPTION: AES-256</div>
    <div>AUTHENTICATION: JWT</div>
  </div>
</div>
```

---

### **SECTION 6: FOOTER (Line 250-254)**

```jsx
{/* Footer */}
<div className="mt-6 text-center">
  {/* ===== LINE 251: COPYRIGHT ===== */}
  <p className="text-xs text-zinc-600 font-mono">&copy; 2026 Lumina Central Intelligence</p>
  //                              ^^^^^^^^^^^^^^ WARNA: Zinc-600 (#52525b)
  //                                             ^^^^^^^^^ FONT: Monospace (font-mono)

  {/* ===== LINE 252: CLASSIFIED NOTICE ===== */}
  <p className="text-xs text-zinc-700 font-mono mt-1">CLASSIFIED // TOP SECRET</p>
  //                              ^^^^^^^^^^^^^^ WARNA: Zinc-700 (#3f3f46)
  //                                             ^^^^^^^^^ FONT: Monospace (font-mono)

  {/* ===== LINE 253: TRADEMARK ===== */}
  <p className="text-xs text-zinc-500 font-mono mt-1">By BramsRV&trade;</p>
  //                              ^^^^^^^^^^^^^^ WARNA: Zinc-500 (#71717a)
  //                                             ^^^^^^^^^ FONT: Monospace (font-mono)
</div>
```

---

### **SECTION 7: FLOATING PARTICLES (Line 260-271)**

```jsx
{/* Floating particles effect */}
<div className="absolute inset-0 pointer-events-none">
  {[...Array(20)].map((_, i) => (
    <div
      key={i}
      {/* ===== LINE 263: PARTICLE DOT ===== */}
      className="absolute w-1 h-1 bg-yellow-500 rounded-full opacity-30 animate-pulse"
      //                           ^^^^^^^^^^^^^^ WARNA: yellow-500 (#10b981)
      //                                                                    ^^^^^^^^^ OPACITY: 30%
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`,
        animationDuration: `${2 + Math.random() * 3}s`,
      }}
    />
  ))}
</div>
```

---

### **SECTION 8: CUSTOM CSS (Line 276-310)**

```jsx
<style jsx global>{`
  :root {
    color-scheme: dark;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 0.1;
    }
    50% {
      opacity: 0.2;
    }
  }

  /* ===== LINE 292-300: AUTOFILL STYLING ===== */
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    transition: background-color 600000s ease-in-out 0s !important;
    -webkit-text-fill-color: #10b981 !important;
    //                        ^^^^^^^ WARNA: yellow-500 (#10b981) - Autofill text
    box-shadow: 0 0 0px 1000px #18181b inset !important;
    //                                  ^^^^^^^ WARNA: Zinc-900 (#18181b) - Autofill background
    caret-color: #10b981 !important;
    //           ^^^^^^^ WARNA: yellow-500 (#10b981) - Cursor color
    color-scheme: dark !important;
  }

  input {
    color-scheme: dark !important;
  }
`}</style>
```

---

## 📊 RINGKASAN PENANDA

### **WARNA YANG DIGUNAKAN:**

| Warna | Hex | Tailwind | Jumlah Penggunaan |
|-------|-----|----------|-------------------|
| **yellow-500** | #10b981 | `yellow-500` | 15+ (heading, button, icons, glow, border) |
| **Black** | #000000 | `bg-black` | 3 (main background) |
| **Zinc-950** | #09090b | `bg-zinc-950` | 2 (card background) |
| **Zinc-900** | #18181b | `bg-zinc-900` | 2 (input background) |
| **Zinc-800** | #27272a | `border-zinc-800` | 3 (input border, divider) |
| **Zinc-700** | #3f3f46 | `placeholder:text-zinc-700` | 1 (placeholder) |
| **Zinc-600** | #52525b | `text-zinc-600` | 2 (footer, icon hover) |
| **Zinc-500** | #71717a | `text-zinc-500` | 3 (muted text) |
| **Zinc-400** | #a1a1aa | `text-zinc-400` | 3 (labels) |
| **Zinc-300** | #d4d4d8 | `text-zinc-300` | 2 (input text) |
| **Red-500** | #ef4444 | `text-red-500` | 3 (error) |
| **Red-950** | #7f1d1d | `bg-red-950/50` | 1 (error background) |

### **FONT YANG DIGUNAKAN:**

| Font | Tailwind | Jumlah Penggunaan |
|------|----------|-------------------|
| **Monospace** | `font-mono` | 20+ (semua text) |
| **Bold** | `font-bold` | 2 (heading, button) |
| **Uppercase** | `uppercase` | 5 (labels, text) |
| **Tracking-widest** | `tracking-widest` | 1 (main heading) |
| **Tracking-wider** | `tracking-wider` | 5 (labels, button) |

---

## ✅ KESIMPULAN

**Login page menggunakan:**
- ✅ **1 Font Family:** Monospace (`font-mono`)
- ✅ **12 Warna:** 1 Emerald + 10 Zinc + 1 Red
- ✅ **Styling:** Uppercase + Tracking (letter spacing)
- ✅ **Aesthetic:** Cyber Terminal / Military Intelligence

**Semua sudah diterapkan di dashboard dengan:**
- ✅ JetBrains Mono (monospace equivalent)
- ✅ yellow-500 sebagai primary accent
- ✅ Zinc colors untuk backgrounds & text
- ✅ Uppercase labels dengan tracking-wider

---

**Status:** ✅ Dokumentasi Lengkap dengan Penanda  
**Last Updated:** June 22, 2026 - 20:47 UTC+07:00
