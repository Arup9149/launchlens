/**
 * LaunchLens PDF Service
 *
 * Generates downloadable PDFs directly from structured application data.
 * Does not use window.print(), browser print dialogs, or DOM scraping.
 *
 * Generators:
 *  - FounderPlaybook
 *  - BuilderProgram
 *  - (future: ValidationReport, ArchitectureBlueprint, …)
 */

import { downloadBlob } from "./download"
import {
  generateFounderPlaybookPdf,
  getFounderPlaybookFilename,
} from "./founder-playbook"
import {
  generateBuilderProgramPdf,
  getBuilderProgramFilename,
} from "./builder-program"
import type { FounderPdfContext } from "./types"

export type { FounderPdfContext, PdfDownloadState } from "./types"

export const PDFService = {
  /**
   * Generate and download the Founder Playbook in one call.
   * Returns after the browser download is triggered.
   */
  async downloadFounderPlaybook(ctx: FounderPdfContext = {}): Promise<void> {
    const blob = generateFounderPlaybookPdf(ctx)
    downloadBlob(blob, getFounderPlaybookFilename())
  },

  /**
   * Generate and download the 20-Day Builder Program in one call.
   */
  async downloadBuilderProgram(ctx: FounderPdfContext = {}): Promise<void> {
    const blob = generateBuilderProgramPdf(ctx)
    downloadBlob(blob, getBuilderProgramFilename())
  },

  /** Low-level: blob only (for testing / custom download UX). */
  generateFounderPlaybookBlob(ctx: FounderPdfContext = {}): Blob {
    return generateFounderPlaybookPdf(ctx)
  },

  generateBuilderProgramBlob(ctx: FounderPdfContext = {}): Blob {
    return generateBuilderProgramPdf(ctx)
  },
}

// Back-compat aliases used by existing call sites (dashboard, result page)
export async function downloadFounderPlaybook(
  ctx: FounderPdfContext = {}
): Promise<void> {
  return PDFService.downloadFounderPlaybook(ctx)
}

export async function downloadBuilderProgram(
  ctx: FounderPdfContext = {}
): Promise<void> {
  return PDFService.downloadBuilderProgram(ctx)
}
