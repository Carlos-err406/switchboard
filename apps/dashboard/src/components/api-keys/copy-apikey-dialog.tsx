import { cn } from '@switchboard/ui'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@switchboard/ui/components/alert-dialog'
import { Button } from '@switchboard/ui/components/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@switchboard/ui/components/tooltip'
import { Check, Clipboard, Info } from 'lucide-react'
import type { FC } from 'react'
import { useEffect, useRef, useState } from 'react'

type Props = {
  title: string
  value: { apiKey: string; preview: string } | null
  onClose: () => void
}

export const CopyApiKeyDialog: FC<Props> = ({ title, value, onClose }) => {
  const copiedOnce = useRef(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!value) {
      copiedOnce.current = false
      setCopied(false)
    }
  }, [value])

  useEffect(() => {
    if (!value) return
    const preventEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
      }
    }
    window.addEventListener('keydown', preventEscape, { capture: true })
    return () => {
      window.removeEventListener('keydown', preventEscape, { capture: true })
    }
  }, [value])

  return (
    <AlertDialog open={!!value}>
      <AlertDialogContent className="min-w-118.75">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            Please copy this into a safe place. You will not see it again.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="bg-muted p-2 flex items-center justify-between">
          <p className="text-xs text-center flex-1">{value?.preview}</p>
          <Button
            onClick={async () => {
              if (!value) return
              await navigator.clipboard.writeText(value.apiKey)
              copiedOnce.current = true
              setCopied(true)
              setTimeout(() => setCopied(false), 2_000)
            }}
          >
            {copied ? <Check /> : <Clipboard />}
          </Button>
        </div>
        <div className="flex items-start text-center text-xs">
          <Info className="size-4 flex-none mt-px" /> Api Keys are read-only and
          scoped to specific environments, they are safe to use client side!
        </div>
        <AlertDialogFooter className="justify-end">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                className={cn(!copiedOnce.current && 'opacity-50')}
                onClick={(e) => {
                  if (!copiedOnce.current) {
                    e.stopPropagation()
                    e.preventDefault()
                  } else {
                    onClose()
                  }
                }}
              >
                Done
              </Button>
            </TooltipTrigger>
            {!copiedOnce.current && (
              <TooltipContent side="bottom">
                Please copy the api key first
              </TooltipContent>
            )}
          </Tooltip>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
