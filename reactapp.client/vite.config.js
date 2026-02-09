import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'
import child_process from 'child_process'
import { env } from 'process'

export default defineConfig(({ mode }) => {
    const isDev = mode === 'development'

    let httpsConfig = false

    if (isDev) {
        const baseFolder =
            env.APPDATA && env.APPDATA !== ''
                ? `${env.APPDATA}/ASP.NET/https`
                : `${env.HOME}/.aspnet/https`

        const certificateName = 'reactapp.client'
        const certFilePath = path.join(baseFolder, `${certificateName}.pem`)
        const keyFilePath = path.join(baseFolder, `${certificateName}.key`)

        if (!fs.existsSync(baseFolder)) {
            fs.mkdirSync(baseFolder, { recursive: true })
        }

        if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
            const result = child_process.spawnSync(
                'dotnet',
                [
                    'dev-certs',
                    'https',
                    '--export-path',
                    certFilePath,
                    '--format',
                    'Pem',
                    '--no-password'
                ],
                { stdio: 'inherit' }
            )

            if (result.status !== 0) {
                throw new Error('Could not create certificate.')
            }
        }

        httpsConfig = {
            key: fs.readFileSync(keyFilePath),
            cert: fs.readFileSync(certFilePath)
        }
    }

    return {
        plugins: [react(), tailwindcss()],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        },
        server: isDev
            ? {
                port: parseInt(env.DEV_SERVER_PORT || '62062'),
                https: httpsConfig
            }
            : undefined
    }
})
