import { Button } from "@/components/ui";
import { cn } from "@/lib";
import { useCampaignStore } from "@/store";
import Link from "next/link";
import { CampaignCardList } from "../CampaignCard";
import Heading from "../Heading";

function UrgentFundraisers({ className }: { className?: string }) {
	const campaignsFromDb = useCampaignStore((state) =>
		state.campaigns.filter((campaign) => campaign.status !== "Draft")
	);

	return (
		<section className={cn("w-full", className)}>
			<div className="px-6 lg:flex lg:flex-row lg:items-center lg:justify-between lg:px-[100px]">
				<div className="space-y-2.5">
					<Heading as="h3" className="text-xl font-normal">
						Donate Today
					</Heading>

					<Heading as="h3" className="text-[40px] lg:text-5xl">
						Urgent Fundraiser
					</Heading>

					<p className="text-pretty text-xl lg:text-2xl">
						Join our community of change makers and make an impact today
					</p>
				</div>
				<Button
					className="mt-4 shrink-0 border border-placeholder text-base font-extrabold text-placeholder"
					asChild
				>
					<Link href="/explore">Explore campaigns</Link>
				</Button>
			</div>

			<CampaignCardList
				listType="horizontal"
				cardDetailsArray={campaignsFromDb}
				classNames={{
					base: "mt-10 lg:mt-14 pl-6 lg:pl-[100px]",
					card: {
						image: "aspect-[383/263] md:aspect-[396/263] max-h-[263px]",
					},
				}}
			/>
		</section>
	);
}

export default UrgentFundraisers;
