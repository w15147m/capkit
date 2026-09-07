export function getMUIToggleSwitchTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { checked: boolean; onChange: (val: boolean) => void; label?: string }' : ''
  return `import React from 'react'
import { FormControlLabel, Switch, Box } from '@mui/material'

export default function ToggleSwitch({ checked, onChange, label }${tsType}) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
      <FormControlLabel
        control={<Switch checked={checked} onChange={(e) => onChange(e.target.checked)} />}
        label={label || ''}
        sx={{ width: '100%', justifyContent: 'space-between', m: 0 }}
      />
    </Box>
  )
}
`
}
