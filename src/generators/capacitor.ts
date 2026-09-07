import path from 'pathe'
import type { ProjectOptions } from '../types/index.js'
import { writeJson, writeFile } from '../utils/filesystem.js'

export async function generateCapacitorConfig(targetDir: string, options: ProjectOptions): Promise<void> {
  const config = {
    appId: `com.example.${options.projectName.replace(/[^a-zA-Z0-9]/g, '')}`,
    appName: options.projectName,
    webDir: 'dist',
    server: {
      url: 'http://localhost:5173',
      cleartext: true,
    },
  }

  await writeJson(path.join(targetDir, 'capacitor.config.json'), config)
}

export async function generateAndroidGradleConfig(targetDir: string): Promise<void> {
  const gradlePropertiesContent = `# Project-wide Gradle settings
org.gradle.jvmargs=-Xmx1536m
android.useAndroidX=true

# Project-specific JDK: Use Java 21 for Capacitor Android build
org.gradle.java.home=/usr/lib/jvm/java-21-openjdk-amd64
`
  await writeFile(path.join(targetDir, 'android', 'gradle.properties'), gradlePropertiesContent)
}
