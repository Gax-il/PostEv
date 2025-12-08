import { cn } from "@/lib/utils";
import { useState, forwardRef } from "react";
import ToolbarButton from "@/toolbar/toolbar_button";
import { Tool } from "@/data/tools";
import { useAppStore } from "@/store";
import { ColorPicker } from "./ui/color_picker";

interface ToolbarProps {
  className?: string;
  setTool: (tool: string) => void;
  tool: string;
  tools: Tool[];
}

const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(
  ({ className, setTool, tools }, ref) => {
    const [isOpen, setIsOpen] = useState<string | null>("file"); // Set to "file" instead of null
    const { lineColor, setLineColor } = useAppStore();

    return (
      <div ref={ref} className={cn("flex justify-center", className)}>
        <div className="w-screen-dvw overflow-hidden bg-card p-2 shadow-xl transition-all duration-200 ease-in-out">
          <div className="flex min-w-max items-center justify-center gap-4">
            {tools.map((mainTool) => (
              <ToolbarButton
                key={mainTool.codeName}
                tool={mainTool}
                onClickOpen={(codeName) => {
                  setIsOpen(isOpen === codeName ? null : codeName);
                }}
                onClickSet={setTool}
                isOpen={isOpen === mainTool.codeName}
              />
            ))}
            <div className="ml-4 flex items-center">
              <ColorPicker
                value={lineColor}
                onChange={setLineColor}
                className="h-8 w-8"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default Toolbar;
