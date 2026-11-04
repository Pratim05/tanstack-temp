import html2canvas from 'html2canvas-pro'
import jsPDF from 'jspdf'

export type ReportExportType = 'png' | 'pdf'

interface ExportReportOptions {
  type?: ReportExportType
  filename?: string
  scale?: number
  backgroundColor?: string
}

export async function exportReport(
  element: HTMLElement,
  {
    type = 'png',
    filename = 'report',
    scale = 2,
    backgroundColor = '#ffffff',
  }: ExportReportOptions = {},
) {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!element) {
    throw new Error('Report element not found')
  }

  const canvas = await html2canvas(element, {
    useCORS: true,
    scale,
    backgroundColor,
  })

  if (!canvas.width || !canvas.height) {
    throw new Error(
      `Failed to generate report image. Canvas size: ${canvas.width}x${canvas.height}`,
    )
  }

  // --------------------------------
  // PNG EXPORT
  // --------------------------------

  if (type === 'png') {
    const image = canvas.toDataURL('image/png')

    const link = document.createElement('a')

    link.href = image
    link.download = `${filename}.png`

    document.body.appendChild(link)
    link.click()
    link.remove()

    return
  }

  // --------------------------------
  // PDF EXPORT
  // --------------------------------

  // Use JPEG for jsPDF instead of PNG.
  // This avoids jsPDF PNG parsing issues.
  const imgData = canvas.toDataURL('image/jpeg', 0.95)

  const pdf = new jsPDF('p', 'mm', 'a4')

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  const margin = 5

  const imgWidth = pageWidth - margin * 2
  const imgHeight = (canvas.height * imgWidth) / canvas.width

  const printableHeight = pageHeight - margin * 2

  let heightLeft = imgHeight
  let position = margin

  // First page
  pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight)

  heightLeft -= printableHeight

  // Additional pages
  while (heightLeft > 0) {
    position = margin - (imgHeight - heightLeft)

    pdf.addPage()

    pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight)

    heightLeft -= printableHeight
  }

  pdf.save(`${filename}.pdf`)
}
