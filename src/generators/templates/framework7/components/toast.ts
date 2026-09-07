export function getFramework7ToastTemplate(isTs: boolean): string {
  return `import React from 'react'
import { f7 } from 'framework7-react'

export function showFramework7Toast(text: string) {
  if (f7) {
    f7.toast.create({
      text,
      position: 'top',
      closeTimeout: 3000,
    }).open()
  }
}

export default function Toast() {
  return null
}
`
}
