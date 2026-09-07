export function getHeroUIAlertDialogTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { isOpen: boolean; title: string; description: string; onConfirm: () => void; onCancel: () => void }' : ''
  return `import React from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react'

export default function AlertDialog({ isOpen, title, description, onConfirm, onCancel }${tsType}) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onCancel} placement="center">
      <ModalContent>
        {() => (
          <>
            <ModalHeader>{title}</ModalHeader>
            <ModalBody>
              <p className="text-sm text-default-600">{description}</p>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onCancel}>Cancel</Button>
              <Button color="primary" onPress={onConfirm}>Confirm</Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
`
}
