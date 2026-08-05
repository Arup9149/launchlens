/**
 * Trigger a one-click browser download from a Blob.
 * No popups, no print dialog.
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.style.display = "none"
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  // Revoke after a tick so the download can start
  setTimeout(() => URL.revokeObjectURL(url), 1500)
}
