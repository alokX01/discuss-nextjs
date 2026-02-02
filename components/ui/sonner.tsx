"use client"

import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      position="bottom-right"
      expand={false}
      richColors
      toastOptions={{
        style: {
          background: 'white',
          border: '1px solid #e5e7eb',
          color: '#1f2937',
        },
        className: 'shadow-lg',
      }}
      {...props}
    />
  )
}

export { Toaster }