"use client"

import type React from "react"
import { X, Trash2 } from "lucide-react"
import { CustomIcon } from "@/components/custom-icon"

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = 'danger'
}: ConfirmationModalProps) {
  if (!isOpen) return null

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: <Trash2 className="w-6 h-6 text-red-500" />,
          confirmButton: "bg-red-600 hover:bg-red-700 focus:ring-red-500"
        }
      case 'warning':
        return {
          icon: <Trash2 className="w-6 h-6 text-yellow-500" />,
          confirmButton: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500"
        }
      default:
        return {
          icon: <Trash2 className="w-6 h-6 text-blue-500" />,
          confirmButton: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
        }
    }
  }

  const styles = getVariantStyles()

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 flex items-center justify-center">
                <CustomIcon name="mercedes-star" className="w-5 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold">{title}</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors duration-200 p-1 rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <div className="flex-1">
              <p className="text-gray-700 leading-relaxed">
                {message}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`px-4 py-2 text-white rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles.confirmButton}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 