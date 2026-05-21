// src/lib/server/escrow.ts
import { createServerFn } from "@tanstack/start"
import * as Sentry from "@sentry/react"

export const releaseEscrow = createServerFn()
  .validator((data: { contract_id: string; escrow_id: string }) => data)
  .handler(async ({ data }) => {
    try {
      // your escrow release logic here
      return { success: true }
    } catch (error) {
      Sentry.captureException(error, {
        extra: {
          contract_id: data.contract_id,
          escrow_id: data.escrow_id,
        },
        tags: {
          feature: "payments",
          severity: "critical",
        },
      })
      throw error
    }
  })
