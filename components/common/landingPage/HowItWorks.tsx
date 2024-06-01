import { Moneys, VerifiedIcon, WalletAdd } from "@/components/common";
import { Button } from "@/components/ui";
import { cn } from "@/lib";
import Link from "next/link";

const howItWorksCards = [
	{
		title: "Select a Fundraiser",
		icon: <VerifiedIcon />,
		text: "Take your time exploring our wide array of fundraisers and select one that truly resonates with your heart. Every contribution, no matter how big or small, has the power to make a meaningful impact on someone's life.",
	},
	{
		title: "Choose you Donation Method",
		icon: <WalletAdd />,
		text: "When you're ready to support a cause, choose your preferred donation method. Whether you opt for credit/debit card, bank transfer, or any other means, rest assured that your support is deeply appreciated.",
	},
	{
		title: "Submit your donation method",
		icon: <Moneys />,
		text: "Once you've selected your donation method, it's time to finalize your contribution by submitting your payment details. With your generosity, we can continue to uplift communities, provide assistance to individuals facing hardships.",
	},
];
const HowItWorks = ({ className }: { className?: string }) => {
	return (
		<div id="start" className={cn("flex scroll-mt-16 flex-col justify-center gap-8", className)}>
			<div className="w-full space-y-5 md:justify-between lg:flex lg:space-y-0 lg:divide-x-2 lg:divide-slate-300">
				<div className="flex flex-1 flex-col items-start gap-3 space-y-2 md:pr-20">
					<h4 className="text-base font-normal text-placeholder md:text-lg">Want to know more?</h4>
					<h1 className="text-2xl font-bold md:text-3xl">Here’s how it works</h1>
					<Button variant="primary" className="px-8" asChild>
						<Link href="/c/create"> Donate now</Link>
					</Button>
				</div>
				<div className="flex-1 items-center lg:flex lg:justify-center lg:pl-20">
					<p className="text-base font-medium text-placeholder md:text-lg">
						Join the effortless way to raise funds <br /> and make a difference and empower <br />{" "}
						your cause with Abeghelp.me
					</p>
				</div>
			</div>
			<div className="grid grid-cols-1 gap-x-4 gap-y-10 pt-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-y-4">
				{howItWorksCards.map((card, id) => {
					return (
						<div key={id} className="relative bg-gray-50 px-4 py-12">
							<div className="absolute left-2 top-[-24px] rounded-full border-4 border-gray-100 bg-white p-4">
								{card.icon}
							</div>
							<p className="mt-12 text-xl font-semibold md:text-2xl">{card.title}</p>
							<p className="text-base font-light md:text-lg">{card.text}</p>
						</div>
					);
				})}
			</div>
		</div>
	);
};
export default HowItWorks;
