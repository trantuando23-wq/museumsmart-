import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bảo tàng Thông minh • Smart Museum | 3D Artifacts & AI Docent',
  description:
    'Hệ thống bảo tàng thông minh thế hệ mới với bản đồ điều hướng trong nhà, mô hình 3D cổ vật tương tác 360 độ và Thuyết minh viên AI Tiến sĩ Di sản.',
  keywords: [
    'Smart Museum',
    'Bảo tàng thông minh',
    'Trống đồng Đông Sơn',
    'Ấn vàng Sắc mệnh chi bảo',
    'AI Docent',
    'Bản đồ bảo tàng',
    'Cổ vật 3D',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🏛️</text></svg>" />
      </head>
      <body className="bg-[#0B0F19] text-slate-100 min-h-screen antialiased overflow-hidden">
        {children}
      </body>
    </html>
  )
}
