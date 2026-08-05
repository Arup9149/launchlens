/**
 * @deprecated Use `@/lib/pdf` (PDFService) instead.
 * Kept as thin re-export so any residual imports resolve during transition.
 * Browser print / window.open / alert workflow has been removed.
 */

export type { FounderPdfContext as FounderPrintContext } from "./pdf/types"
export {
  downloadFounderPlaybook as printFounderPlaybook,
  downloadBuilderProgram as printBuilderProgram,
} from "./pdf"
