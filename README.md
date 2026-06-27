# 3D Device Showcase — Starter Kit

A scroll-driven 3D animation website built with **Next.js + React Three Fiber + GSAP**.
Scroll the page → the device rotates and explodes into parts.

> Right now the "device" is made of placeholder boxes so you can see the
> animation working *before* the client sends the real 3D model.

---

## 1. What's inside

```
device-3d-showcase/
├── app/
│   ├── layout.jsx          ← Root HTML layout
│   ├── page.jsx            ← The home page (loads Scene + Sections)
│   └── globals.css         ← Global styles
├── components/
│   ├── Scene.jsx           ← The 3D <Canvas> + lighting + camera
│   ├── Device.jsx          ← The device parts + scroll-driven animation
│   ├── Loader.jsx          ← "Loading…" indicator while assets load
│   └── Sections.jsx        ← The text chapters on the left side
├── lib/
│   └── useScrollAnimation.js  ← Hook that tracks scroll progress (0 → 1)
├── public/
│   ├── models/             ← Drop the real .glb file here when you get it
│   └── textures/           ← Optional HDR or texture files
├── package.json
├── next.config.mjs
└── jsconfig.json
```

---

## 2. How to run it

You need **Node.js 20+** installed first. Check with:

```bash
node -v
```

If you don't have Node, install it from https://nodejs.org/

Then in this folder run:

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser. Scroll down — the placeholder device
will rotate and split apart.

---

## 3. When the client sends the 3D model

1. Save the file as `public/models/device.glb`
   (If it's `.fbx` or `.blend`, open it in **Blender** and export as `.glb`
   with **Draco compression** ticked.)

2. Open `components/Device.jsx` and follow the comment at the bottom —
   it shows the exact swap from placeholder boxes → real model.

3. Find the part names in your model. Open https://gltf.report/ and
   drag the `.glb` in — you'll see all mesh names. Use them in the
   animation code.

4. Update the chapter text in `components/Sections.jsx` to match the
   real parts of the device.

---

## 4. The animation explained

- The scroll position (0 = top, 1 = bottom of page) is read by
  `lib/useScrollAnimation.js`.
- Inside `components/Device.jsx`, a `useFrame` loop reads that value
  every frame and moves each device part.
- Each part has its own "scroll window" using the `range(start, end)`
  helper. For example:
  - `range(0.05, 0.3)` → back cover animates between 5% and 30% scroll
  - `range(0.55, 0.8)` → screen animates between 55% and 80% scroll
- Tweak these numbers to change *when* and *how far* each part moves.

---

## 5. Deploy

The easiest way is **Vercel**:

```bash
npm install -g vercel
vercel
```

Or push to GitHub and connect the repo on https://vercel.com.

---

## 6. Next steps (optional)

- **Add a CMS** so the client can edit text → [Sanity.io](https://www.sanity.io/)
- **Add post-processing** (bloom, glow) → already installed as
  `@react-three/postprocessing`
- **Add live tweaking** → already installed as `leva` (great for
  adjusting positions, colors, lights while developing)

---

## Common issues

| Problem | Fix |
|---|---|
| `npm install` fails | Make sure Node.js is v20 or higher |
| White / black screen | Check browser console — usually a missing model file |
| Animation feels jumpy | Lower the `dpr` in `Scene.jsx` from `[1, 2]` to `[1, 1.5]` |
| Model is too big / too small | Wrap `<primitive>` in a `<group scale={0.5}>` |
