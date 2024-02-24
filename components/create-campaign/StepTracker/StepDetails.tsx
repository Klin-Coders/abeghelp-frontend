import { cn } from "@/lib";
import { TickIcon } from "@/public/assets/icons/campaign";
import type { FormStore } from "@/store/formStore";

type StepIndicatorProps = {
	step: FormStore["currentStep"];
	disabled?: boolean;
	isCompleted?: boolean;
};

type StepInfoProps = Pick<StepIndicatorProps, "disabled"> & {
	title: string;
	description: string;
};

function StepIndicator(props: StepIndicatorProps) {
	const { step, isCompleted = false, disabled = false } = props;

	const Separator = (
		<hr
			className={cn(
				"my-@0.4 borderabeg-primary basis-full border border-dashed",
				disabled && "border-unfocused"
			)}
		/>
	);

	return (
		<div className={cn(step > 1 && "flex basis-full flex-col items-center")}>
			{step > 1 && Separator}

			<span
				className={cn(
					"w-@2 bg-abeg-primary grid aspect-square shrink-0 place-content-center rounded-full font-bold text-white",
					disabled && "bg-unfocused"
				)}
			>
				{isCompleted ? <TickIcon /> : step}
			</span>
		</div>
	);
}

function StepInformation({
	title,
	description,
	disabled = false,
}: StepInfoProps) {
	return (
		<article className={cn("w-full", disabled && "text-unfocused")}>
			<h4 className="text-xs font-medium lg:text-xl">{title}</h4>

			<p>{description}</p>
		</article>
	);
}

export { StepIndicator, StepInformation };