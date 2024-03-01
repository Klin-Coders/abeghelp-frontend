import { cn } from "@/lib";
import type { ForwardedRefType, InferProps } from "@/lib/type-helpers";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { forwardRef } from "react";

function SelectTrigger(
	props: InferProps<typeof SelectPrimitive.Trigger> & {
		icon?: React.JSX.Element;
	},
	ref: ForwardedRefType<typeof SelectPrimitive.Trigger>
) {
	const { children, icon, className, ...restOfProps } = props;

	return (
		<SelectPrimitive.Trigger
			ref={ref}
			className={cn(
				"flex h-10 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-placeholder focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
				className
			)}
			{...restOfProps}
		>
			{children}

			<SelectPrimitive.Icon asChild>
				{icon ?? <CaretSortIcon className="size-4 opacity-50" />}
			</SelectPrimitive.Icon>
		</SelectPrimitive.Trigger>
	);
}

function SelectScrollUpButton(
	props: InferProps<typeof SelectPrimitive.ScrollUpButton>,
	ref: ForwardedRefType<typeof SelectPrimitive.ScrollUpButton>
) {
	const { className, ...restOfProps } = props;

	return (
		<SelectPrimitive.ScrollUpButton
			ref={ref}
			className={cn(
				"flex cursor-default items-center justify-center py-1",
				className
			)}
			{...restOfProps}
		>
			<ChevronUpIcon />
		</SelectPrimitive.ScrollUpButton>
	);
}

function SelectScrollDownButton(
	props: InferProps<typeof SelectPrimitive.ScrollDownButton>,
	ref: ForwardedRefType<typeof SelectPrimitive.ScrollDownButton>
) {
	const { className, ...restOfProps } = props;

	return (
		<SelectPrimitive.ScrollDownButton
			ref={ref}
			className={cn(
				"flex cursor-default items-center justify-center py-1",
				className
			)}
			{...restOfProps}
		>
			<ChevronDownIcon />
		</SelectPrimitive.ScrollDownButton>
	);
}

function SelectContent(
	props: InferProps<typeof SelectPrimitive.Content>,
	ref: ForwardedRefType<typeof SelectPrimitive.Content>
) {
	const { className, children, position = "popper", ...restOfProps } = props;

	const ScrollDownButton = forwardRef(SelectScrollDownButton);
	const ScrollUpButton = forwardRef(SelectScrollUpButton);

	return (
		<SelectPrimitive.Portal>
			<SelectPrimitive.Content
				ref={ref}
				className={cn(
					"relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
					position === "popper" &&
						"data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
					className
				)}
				position={position}
				{...restOfProps}
			>
				<ScrollUpButton />

				<SelectPrimitive.Viewport
					className={cn(
						"p-1",
						position === "popper" &&
							"h-[--radix-select-trigger-height] w-full min-w-[--radix-select-trigger-width]"
					)}
				>
					{children}
				</SelectPrimitive.Viewport>

				<ScrollDownButton />
			</SelectPrimitive.Content>
		</SelectPrimitive.Portal>
	);
}

function SelectLabel(
	props: InferProps<typeof SelectPrimitive.Label>,
	ref: ForwardedRefType<typeof SelectPrimitive.Label>
) {
	const { className, ...restOfProps } = props;

	return (
		<SelectPrimitive.Label
			ref={ref}
			className={cn("px-2 py-2.5 text-sm font-semibold", className)}
			{...restOfProps}
		/>
	);
}

function SelectItem(
	props: InferProps<typeof SelectPrimitive.Item>,
	ref: ForwardedRefType<typeof SelectPrimitive.Item>
) {
	const { className, children, ...restOfProps } = props;

	return (
		<SelectPrimitive.Item
			ref={ref}
			className={cn(
				"relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-[25px] pr-2 text-xs outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
				className
			)}
			{...restOfProps}
		>
			<span className="absolute left-2 flex size-3.5 items-center justify-center">
				<SelectPrimitive.ItemIndicator>
					<CheckIcon className="size-3" />
				</SelectPrimitive.ItemIndicator>
			</span>

			<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
		</SelectPrimitive.Item>
	);
}

function SelectSeparator(
	props: InferProps<typeof SelectPrimitive.Separator>,
	ref: ForwardedRefType<typeof SelectPrimitive.Separator>
) {
	const { className, ...restOfProps } = props;

	return (
		<SelectPrimitive.Separator
			ref={ref}
			className={cn("-mx-1 my-1 h-px bg-muted", className)}
			{...restOfProps}
		/>
	);
}

const Select = {
	Root: SelectPrimitive.Root,
	Content: forwardRef(SelectContent),
	Group: SelectPrimitive.Group,
	Item: forwardRef(SelectItem),
	Label: forwardRef(SelectLabel),
	ScrollDownButton: forwardRef(SelectScrollDownButton),
	ScrollUpButton: forwardRef(SelectScrollUpButton),
	Separator: forwardRef(SelectSeparator),
	Trigger: forwardRef(SelectTrigger),
	Value: SelectPrimitive.Value,
};

export { Select, SelectPrimitive };
