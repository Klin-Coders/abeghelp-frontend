import { cn } from "@/lib";
import type { ForwardedRefType, InferProps } from "@/lib/type-helpers";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { forwardRef } from "react";

function PopoverContent(
	props: InferProps<typeof PopoverPrimitive.Content>,
	ref: ForwardedRefType<typeof PopoverPrimitive.Content>
) {
	const { className, align = "center", sideOffset = 4, ...restOfProps } = props;

	return (
		<PopoverPrimitive.Portal>
			<PopoverPrimitive.Content
				ref={ref}
				align={align}
				sideOffset={sideOffset}
				className={cn(
					"z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
					className
				)}
				{...restOfProps}
			/>
		</PopoverPrimitive.Portal>
	);
}

const Popover = {
	Root: PopoverPrimitive.Root,
	Content: forwardRef(PopoverContent),
	Trigger: PopoverPrimitive.Trigger,
};

export { Popover };
