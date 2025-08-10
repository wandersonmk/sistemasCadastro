import { toast } from 'vue-sonner'

export type ToastAction = {
  label: string
  onClick: () => void
}

export type ToastOptions = {
  description?: string
  duration?: number
  action?: ToastAction
  cancel?: ToastAction
}

export function useToast() {
  function show(message: string, options?: ToastOptions) {
    return toast(message, options as any)
  }

  function success(message: string, options?: ToastOptions) {
    return toast.success(message, options as any)
  }

  function error(message: string, options?: ToastOptions) {
    return toast.error(message, options as any)
  }

  function info(message: string, options?: ToastOptions) {
    return toast.message(message, options as any)
  }

  function warning(message: string, options?: ToastOptions) {
    const warn = (toast as any).warning || toast.message
    return warn(message, options as any)
  }

  function loading(message: string, options?: ToastOptions) {
    return toast.loading(message, options as any)
  }

  function dismiss(id?: string | number) {
    return toast.dismiss(id as any)
  }

  return { show, success, error, info, warning, loading, dismiss }
}


