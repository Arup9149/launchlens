export type FounderPdfContext = {
  startupName?: string | null
  idea?: string | null
  founderName?: string | null
}

export type PdfDownloadState = "idle" | "preparing" | "downloading" | "done" | "error"
