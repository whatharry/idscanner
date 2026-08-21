# ID Scanner

Capture an ID card with your phone camera and get back a clean PDF — entirely in the browser.
No upload, no server, no third-party API. The image never leaves the device.

**[Live demo](https://idscanner.vercel.app)**

## Why

Scanning an ID usually means either a flatbed scanner or an app that uploads your document to
someone else's server. For a document as sensitive as an ID card, neither is appealing. This does
the whole pipeline client-side: capture, clean up, export.

## How it works

1. **Capture** — `react-webcam` opens the rear-facing camera (`facingMode: "environment"`) with a
   3:2 framing guide matching standard ID card proportions.
2. **Clean** — the frame is drawn to an offscreen `<canvas>` and processed pixel by pixel via
   `getImageData`. Pixels above a brightness threshold on all three channels have their alpha set
   to zero, dropping the white background so the card sits on transparency.
3. **Export** — `jsPDF` places the cleaned PNG into an A4 document and triggers a download.

State is a simple two-step machine: capture → review, with retake returning to step one.

## Stack

React 19 · Tailwind CSS · react-webcam · jsPDF · Create React App

## Running locally

```bash
npm install
npm start      # http://localhost:3000
npm run build  # production build
```

Camera access requires HTTPS (or localhost). On a desktop without a rear camera, the browser falls
back to the default device.

## Known limitations

- Background removal is a fixed brightness threshold, so it works well on white or light
  backgrounds and poorly on dark or textured ones. An adaptive threshold or edge-detection pass
  would generalize it.
- No automatic edge detection or perspective correction — the framing guide relies on the user to
  line the card up.
- Single-side capture only; a front/back flow would need a second capture step and a two-page PDF.

## License

MIT
