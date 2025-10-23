import type { Side, SideString } from "@/types/pve"
import { Button } from "@/components/ui/button"

export function SideSelector({
  selected,
  onSelect,
}: {
  selected: Side
  onSelect: (side: Side) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        variant={selected === "OVER" ? "default" : "outline"}
        className={
          selected === "OVER"
            ? "bg-aqua/10 hover:bg-aqua/20 text-aqua border-2 border-aqua"
            : "border-2 border-aqua/30 text-aqua/70 hover:bg-aqua/5 hover:text-aqua hover:border-aqua/50"
        }
        onClick={() => onSelect("OVER")}
      >
        Over
      </Button>
      <Button
        variant={selected === "UNDER" ? "default" : "outline"}
        className={
          selected === "UNDER"
            ? "bg-neon-purple/10 hover:bg-neon-purple/20 text-neon-purple border-2 border-neon-purple"
            : "border-2 border-neon-purple/30 text-neon-purple/70 hover:bg-neon-purple/5 hover:text-neon-purple hover:border-neon-purple/50"
        }
        onClick={() => onSelect("UNDER")}
      >
        Under
      </Button>
    </div>
  )
}
