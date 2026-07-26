"use client"

import { useState } from "react"
import Link from "next/link"

const mockRelated = [
  {
    title: "Vertical-specific version",
    description:
      "Take the same core idea and focus it tightly on one industry (e.g. only for indie hackers, only for Indian SMBs, only for AI tool builders).",
    potential: "Higher conversion, easier marketing",
  },
  {
    title: "Upstream problem",
    description:
      "Solve the problem that happens before your current idea. Example: if you validate ideas, help people find ideas first.",
    potential: "Larger top-of-funnel audience",
  },
  {
    title: "Downstream execution",
    description:
      "After validation, help users actually build or launch (templates, AI co-pilot for PRD, landing page generator).",
    potential: "Higher willingness to pay",
  },
  {
    title: "Community + data flywheel",
    description:
      "Turn individual validations into a shared signal database that improves over time and becomes a moat.",
    potential: "Strong long-term defensibility",
  },
  {
    title: "Done-for-you service layer",
    description:
      "Offer a premium human + AI hybrid where you