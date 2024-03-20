import { DonorIcon2 } from "@/components/common/campaign-icons";
import type { Campaign } from "@/interfaces/Campaign";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import { ClockIcon, LocationIcon } from "../common";
import { Carousel } from "../ui/carousel";

type CampaignCarouselProps = {
	images: Campaign["images"];
	classNames?: {
		base?: string;
	};
};

const CampaignCarousel = (props: CampaignCarouselProps) => {
	const { images, classNames } = props;

	return (
		<Carousel.Root images={images}>
			<Carousel.Content
				classNames={{
					base: classNames?.base,
					scrollContainer: "rounded-[5px] lg:rounded-[15px]",
				}}
			>
				<Carousel.Controls
					classNames={{
						base: "px-[18px] py-[25px] lg:px-12 lg:py-10",
						iconsContainer:
							"p-[6px] lg:p-3 bg-abeg-text/40 flex justify-center items-center border border-white backdrop-blur-md rounded-full",
					}}
					icons={{
						prev: <ArrowLeftIcon className="size-3 lg:size-6" />,
						next: <ArrowRightIcon className="size-3 lg:size-6" />,
					}}
				/>

				<Carousel.Caption className="inset-0 flex flex-col items-start justify-between px-[18px] py-[25px] text-xs lg:rounded-[15px] lg:px-12 lg:py-10 lg:text-base">
					<figure className="flex items-center gap-1 rounded-md bg-abeg-text/30 p-[6px] backdrop-blur-md lg:gap-2 lg:rounded-[15px] lg:p-[14px]">
						<LocationIcon className="lg:size-6" />
						<figcaption>Lagos, Nigeria</figcaption>
					</figure>

					<div className="flex w-full justify-between">
						<figure className="flex items-center gap-1 rounded-md bg-abeg-text/30 p-[6px] backdrop-blur-md lg:gap-2 lg:rounded-[15px] lg:p-[14px]">
							<DonorIcon2 className="size-4 lg:size-6" />
							<figcaption> 235,567 total donors</figcaption>
						</figure>

						<figure className="flex items-center gap-1 rounded-md bg-abeg-text/30 p-[6px] backdrop-blur-md lg:gap-2 lg:rounded-[15px] lg:p-[14px]">
							<ClockIcon className="lg:size-6" />
							<figcaption>20 days left</figcaption>
						</figure>
					</div>
				</Carousel.Caption>

				<Carousel.ItemWrapper<typeof images>
					render={(image) => (
						<Carousel.Item key={image.secureUrl}>
							<Image
								src={image.secureUrl}
								blurDataURL={image.blurHash}
								alt="campaign image"
								className="aspect-[381/250] min-h-[250px] w-full object-cover"
								width={381}
								height={250}
								priority={true}
								draggable={false}
								fetchPriority="high"
							/>
						</Carousel.Item>
					)}
				/>
			</Carousel.Content>
		</Carousel.Root>
	);
};

export default CampaignCarousel;
