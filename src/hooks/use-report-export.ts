// hooks/use-report-export.ts

import { useCallback, useRef, useState } from 'react'
import { exportReport } from '@/lib/export-report'
import type { ReportExportType } from '@/lib/export-report'

interface UseReportExportOptions {
  filename: string
  type?: ReportExportType
  scale?: number
  backgroundColor?: string
}

export function useReportExport({
  filename,
  type = 'png',
  scale = 2,
  backgroundColor = '#ffffff',
}: UseReportExportOptions) {
  const reportRef = useRef<HTMLDivElement>(null)

  const [isExporting, setIsExporting] = useState(false)

  const exportCurrentReport = useCallback(async () => {
    if (!reportRef.current) return

    try {
      setIsExporting(true)

      await exportReport(reportRef.current, {
        filename,
        type,
        scale,
        backgroundColor,
      })
    } finally {
      setIsExporting(false)
    }
  }, [filename, type, scale, backgroundColor])

  return {
    reportRef,
    exportReport: exportCurrentReport,
    isExporting,
  }
}
