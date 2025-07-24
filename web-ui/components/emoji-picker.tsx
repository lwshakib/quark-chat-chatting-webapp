"use client"

import { useState } from 'react'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { Smile } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
}

export function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleEmojiSelect = (emoji: any) => {
    onEmojiSelect(emoji.native)
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm">
          <Smile className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" side="top" align="start">
        <Picker
          data={data}
          onEmojiSelect={handleEmojiSelect}
          theme="auto"
          previewPosition="none"
          skinTonePosition="none"
        />
      </PopoverContent>
    </Popover>
  )
}