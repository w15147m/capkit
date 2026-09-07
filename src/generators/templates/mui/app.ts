import type { ProjectOptions } from '../../../types/index.js'

export function getMUIAppTemplate(options: ProjectOptions, isTs: boolean): string {
  return `import { useState } from 'react'
import {
  ThemeProvider, createTheme, CssBaseline,
  Box, AppBar, Toolbar, Typography, BottomNavigation,
  BottomNavigationAction, Card, CardContent, CardActions,
  Button, Chip, LinearProgress, Switch, FormControlLabel,
  Snackbar, Alert, Dialog, DialogTitle, DialogContent,
  DialogActions, Paper,
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import GridViewIcon from '@mui/icons-material/GridView'
${options.android ? `import { Capacitor } from '@capacitor/core'` : ''}

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#7c3aed' },
    secondary: { main: '#06b6d4' },
    background: { default: '#0f0f0f', paper: '#1a1a2e' },
  },
  shape: { borderRadius: 16 },
})

function App() {
  const [activeTab, setActiveTab] = useState${isTs ? '<number>' : ''}(0)
  const [count, setCount] = useState${isTs ? '<number>' : ''}(0)
  const [checked, setChecked] = useState${isTs ? '<boolean>' : ''}(true)
  const [snackOpen, setSnackOpen] = useState${isTs ? '<boolean>' : ''}(false)
  const [dialogOpen, setDialogOpen] = useState${isTs ? '<boolean>' : ''}(false)
  ${options.android
    ? `const platform = Capacitor.getPlatform()
  const isNative = Capacitor.isNativePlatform()`
    : `const platform = 'web'
  const isNative = false`}

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100svh', display: 'flex', flexDirection: 'column' }}>
        {/* AppBar */}
        <AppBar position="sticky" elevation={0} sx={{ backdropFilter: 'blur(12px)', bgcolor: 'rgba(26,26,46,0.85)' }}>
          <Toolbar>
            <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1 }}>${options.projectName}</Typography>
            <Chip label={platform.toUpperCase()} size="small" color="secondary" variant="outlined" />
          </Toolbar>
        </AppBar>

        {/* Content */}
        <Box sx={{ flex: 1, maxWidth: 480, mx: 'auto', width: '100%', px: 2, pt: 2, pb: 12 }}>
          {activeTab === 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Card elevation={0} sx={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)', color: 'white' }}>
                <CardContent>
                  <Typography variant="caption" sx={{ opacity: 0.7, textTransform: 'uppercase', letterSpacing: 1 }}>Tap Count</Typography>
                  <Typography variant="h2" fontWeight={800}>{count}</Typography>
                  <LinearProgress variant="determinate" value={Math.min(count * 10, 100)} sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.2)', '& .MuiLinearProgress-bar': { bgcolor: 'white' } }} />
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2, gap: 1 }}>
                  <Button variant="contained" sx={{ bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
                    onClick={() => { setCount(c => c + 1); if ((count + 1) % 5 === 0) setSnackOpen(true) }}>
                    Tap me!
                  </Button>
                  <Button variant="outlined" sx={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white' }}
                    onClick={() => setDialogOpen(true)}>
                    Reset
                  </Button>
                </CardActions>
              </Card>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label="Material UI" color="primary" size="small" />
                <Chip label="React 19" color="secondary" size="small" />
                <Chip label={isNative ? 'Native' : 'Web'} size="small" variant="outlined" />
              </Box>
            </Box>
          )}

          {activeTab === 1 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Card elevation={0}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600}>Buttons</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button size="small" variant="contained" color="primary">Primary</Button>
                    <Button size="small" variant="contained" color="secondary">Secondary</Button>
                    <Button size="small" variant="outlined">Outlined</Button>
                    <Button size="small" variant="text">Text</Button>
                  </Box>
                  <FormControlLabel
                    control={<Switch checked={checked} onChange={e => setChecked(e.target.checked)} color="secondary" />}
                    label={<Typography variant="body2">Dark Mode</Typography>}
                  />
                  <Paper variant="outlined" sx={{ p: 1.5 }}>
                    <Alert severity="success" sx={{ mb: 1 }}>Operation successful</Alert>
                    <Alert severity="warning">Check your settings</Alert>
                  </Paper>
                </CardContent>
              </Card>
            </Box>
          )}
        </Box>

        {/* Snackbar */}
        <Snackbar open={snackOpen} autoHideDuration={3000} onClose={() => setSnackOpen(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert severity="success" onClose={() => setSnackOpen(false)} sx={{ width: '100%' }}>
            Reached {count} taps! 🎉
          </Alert>
        </Snackbar>

        {/* Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} PaperProps={{ sx: { borderRadius: 3 } }}>
          <DialogTitle>Reset counter?</DialogTitle>
          <DialogContent><Typography variant="body2">This will reset your tap count back to 0.</Typography></DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button color="error" onClick={() => { setCount(0); setDialogOpen(false) }}>Reset</Button>
          </DialogActions>
        </Dialog>

        {/* Bottom navigation */}
        <BottomNavigation value={activeTab} onChange={(_, v) => setActiveTab(v)}
          sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 30, bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
          <BottomNavigationAction label="Home" icon={<HomeIcon />} />
          <BottomNavigationAction label="UI Kit" icon={<GridViewIcon />} />
        </BottomNavigation>
      </Box>
    </ThemeProvider>
  )
}

export default App
`
}
