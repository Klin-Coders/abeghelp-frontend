import { ArrowDown } from "@/components/common";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@/components/ui";
import { useState } from "react";
import DonationChart from "./DonationChart";

const DonationStatsPanel = () => {
	const [item, setItem] = useState("");
	return (
		<div className="flex flex-col gap-4 rounded-xl  border-CampaignCardBorderWidth border-placeholder bg-white px-4 py-8  text-sm text-abeg-text text-opacity-80 md:gap-8 md:p-8 md:text-base">
			<div className="flex items-center  justify-between border-b-CampaignCardBorderWidth border-b-placeholder border-opacity-80 pb-4">
				<p className="text-lg font-semibold">Average Donations</p>
				<DropdownMenu>
					<DropdownMenuTrigger
						asChild
						className="flex gap-2 border-CampaignCardBorderWidth border-abeg-text border-opacity-50 outline-none"
					>
						<div
							className="flex items-center justify-center gap-2 rounded-lg border-CampaignCardBorderWidth border-abeg-text p-2 text-sm text-abeg-text hover:cursor-pointer"
							//   size='sm'
							//   variant='secondary'
						>
							<p className="text-sm font-semibold">Last 9 months</p>
							<ArrowDown />
						</div>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="border-0 bg-white p-0 text-sm  md:text-base ">
						<DropdownMenuRadioGroup
							value={item}
							onValueChange={setItem}
							className="cursor-pointer bg-white text-abeg-text"
						>
							<DropdownMenuRadioItem value="All item">
								All item
							</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="Option 2">
								Option 2
							</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="Option 3">
								Option 3
							</DropdownMenuRadioItem>
						</DropdownMenuRadioGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className="flex gap-8">
				<div className="flex flex-col gap-2 font-bold">
					<p className="font-light text-xs md:text-sm">Gross Avg</p>

					<p className="text-3xl md:text-4xl flex flex-col md:flex-row md:items-end">
						48,580 <span className="text-xs md:text-sm">+4.81 this year</span>
					</p>
				</div>

				<div className="flex flex-col gap-2 font-bold">
					<p className="font-light text-xs md:text-sm">Net Avg</p>

					<p className="text-3xl md:text-4xl flex flex-col md:flex-row md:items-end">
						18,500 <span className="text-xs md:text-sm">+2.31 this year</span>
					</p>
				</div>
			</div>
			<DonationChart />
		</div>
	);
};
export default DonationStatsPanel;