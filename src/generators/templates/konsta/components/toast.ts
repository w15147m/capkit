export function getKonstaToastTemplate(isTs: boolean): string {
  return `import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Toast as KonstaToast, Button } from 'konsta/react'

${isTs ? `export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastProps {
  opened: boolean
  text: string
  type?: ToastType
  onClose: () => void
  duration?: number
}` : ''}

export default function Toast({
  opened,
  text,
  onClose,
  duration = 3000,
}${isTs ? ': ToastProps' : ''}) {
  useEffect(() => {
    if (opened && duration > 0) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [opened, duration, onClose])

  if (!opened) return null

  return createPortal(
    <KonstaToast
      position="top"
      opened={opened}
      button={<Button rounded clear inline onClick={onClose}>✕</Button>}
      className="z-[9999]"
    >
      <div className="shrink">{text}</div>
    </KonstaToast>,
    document.body,
  )
}
`
}
