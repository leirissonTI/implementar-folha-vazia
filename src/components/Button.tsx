import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  disabled?: boolean
}

const Button: React.FC<ButtonProps> = ({ children, disabled, ...props }) => {
  return (
    <button
      className={`w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button 