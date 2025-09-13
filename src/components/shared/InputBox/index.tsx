import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Send, Mic, Plus, Smile } from "lucide-react";

interface InputBoxProps {
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  variant?: "message" | "call" | "minimal";
}

export function InputBox({
  onSend,
  placeholder = "Type a message...",
  disabled = false,
  className,
  variant = "message",
}: InputBoxProps) {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex items-end space-x-2 p-3 bg-background/95 backdrop-blur-sm",
        "border-t border-border",
        variant === "minimal" && "border-0 bg-transparent",
        className,
      )}
    >
      {/* Add attachment button */}
      {variant === "message" && (
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          disabled={disabled}
        >
          <Plus className="w-4 h-4" />
        </Button>
      )}

      <form onSubmit={handleSubmit} className="flex-1 flex items-end space-x-2">
        {/* Message input */}
        <div className="flex-1 relative">
          <motion.textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className={cn(
              "w-full min-h-[40px] max-h-[120px] px-4 py-2 pr-12",
              "bg-muted/50 border border-border rounded-2xl",
              "text-sm placeholder:text-muted-foreground",
              "resize-none overflow-hidden",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-all duration-200",
              isFocused && "bg-background border-primary/50",
            )}
            style={{
              height: "auto",
              minHeight: "40px",
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
            }}
          />

          {/* Character count for long messages */}
          {message.length > 100 && (
            <div className="absolute -bottom-5 right-0 text-xs text-muted-foreground">
              {message.length}/500
            </div>
          )}
        </div>

        {/* Emoji button */}
        {variant === "message" && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            disabled={disabled}
          >
            <Smile className="w-4 h-4" />
          </Button>
        )}

        {/* Send/Mic button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            type="submit"
            size="sm"
            disabled={!message.trim() || disabled}
            className={cn(
              "h-8 w-8 p-0 rounded-full",
              message.trim()
                ? "bg-primary hover:bg-primary/90"
                : "bg-muted hover:bg-muted/80",
              "transition-all duration-200",
            )}
          >
            {message.trim() ? (
              <Send className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </Button>
        </motion.div>
      </form>

      {/* Voice message indicator */}
      {!message.trim() && variant === "message" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute right-16 bottom-4 text-xs text-muted-foreground"
        >
          Hold to record
        </motion.div>
      )}

      {/* Typing indicator placeholder */}
      {variant === "message" && (
        <div className="absolute -top-8 left-4 text-xs text-muted-foreground opacity-0">
          Typing...
        </div>
      )}
    </motion.div>
  );
}
