import {
	ArrowUpRight,
	BringPositiveChangeStar,
	Cup,
	Heart,
	Smiley,
	Spark,
	Sun,
} from "@/components/common";
import TestimonialCard from "@/components/common/TestimonialCard";
import { FAQ, UrgentFundraisers } from "@/components/common/landingPage";
import { Button } from "@/components/ui";
import type { ApiResponse } from "@/interfaces";
import type { Campaign } from "@/interfaces/Campaign";
import { BaseLayout } from "@/layouts";
import { callApi, cn } from "@/lib";
import { useDragScroll } from "@/lib/hooks";
import {
	charity,
	createCampaignImage1,
	createCampaignImage2,
	createCampaignImage3,
	support,
} from "@/public/assets/images/landing-page";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { NextSeo } from "next-seo";
import Image from "next/image";
import Link from "next/link";

export const getStaticProps = (async () => {
	const { data, error } =
		await callApi<ApiResponse<Campaign[]>>("/campaign/featured");

	if (error || !data?.data) {
		return { props: { featuredCampaigns: [] } };
	}

	return {
		props: { featuredCampaigns: data.data },
		revalidate: 24 * 60, // 24 hours
	};
}) satisfies GetStaticProps<{ featuredCampaigns: Campaign[] }>;

const campaignCard = [
	{
		index: 1,
		image: createCampaignImage1,
		heading: "Create Your Campaign",
		text: "Share your vision. In just a few clicks, set up your fundraising page and tell us what you're passionate about.",
	},
	{
		index: 2,
		image: createCampaignImage2,
		heading: "Share your story",
		text: "Spread the word with our easy sharing tools. Reach out to friends, family, and beyond.",
	},
	{
		index: 3,
		image: createCampaignImage3,
		heading: "Collect Donations",
		text: "See generosity in action. Our secure platform makes donating simple, so you can focus on your cause.",
	},
	{
		index: 4,
		image: createCampaignImage1,
		heading: "Be Happy",
		text: "Change lives With the funds raised, take the steps to turn your dream project into reality.",
	},
];

const HomePage = ({
	featuredCampaigns,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
	const { dragContainerClasses, dragScrollProps } =
		useDragScroll<HTMLDivElement>("desktopOnly");
	return (
		<>
			<NextSeo
				canonical="https://www.abeghelp.me"
				openGraph={{
					url: "https://www.abeghelp.me",
					title: "Homepage",
					description:
						"Join the effortless way to raise funds and make a difference and empower your cause with Abeghelp.me",
					images: [
						{
							url: "https://static.abeghelp.me/assets/og-index.png",
							width: 800,
							height: 600,
						},
					],
				}}
				twitter={{
					cardType: "summary_large_image",
				}}
			/>
			<BaseLayout>
				<div className="flex flex-col gap-10 md:gap-20 px-5 md:px-20 py-10 md:py-20">
					<div className="  flex flex-col gap-8 text-center max-w-[755px] self-center">
						<div className="relative">
							<p className=" text-4xl  md:text-5xl font-extrabold">
								Start your journey into fundraising with ease
							</p>
							<div className="absolute hidden md:block inset-0 left-[-2rem] md:left-8 lg:left-16 md:top-[-2rem]">
								<Spark />
							</div>
						</div>
						<p className=" text-xl md:text-2xl font-normal">
							Join the effortless way to fund raise and make a difference and
							empower your cause with Abeghelp.me
						</p>
						<div className="flex justify-center gap-2 md:gap-6 self-center">
							<Button
								className="bg-abeg-primary font-semibold text-white md:text-lg"
								asChild
							>
								<Link href="/c/create">Start a fundraiser</Link>
							</Button>
						</div>
					</div>

					<Cards />
					<BringPositiveChange />
				</div>

				<div className="">
					<div className="w-full space-y-5 px-5 md:justify-between md:px-20 lg:flex lg:space-y-0 lg:divide-x-2 lg:divide-slate-300">
						<div className="flex gap-3 items-center md:pr-20">
							<div className="w-2 bg-abeg-primary rounded-md h-20"></div>
							<div className="flex flex-col gap-2">
								<p className="text-xl">How it works</p>
								<h3 className="text-2xl md:text-3xl font-bold">
									A Path to Making <br /> a Difference.
								</h3>
							</div>
						</div>

						<div className="w-full flex-1 items-center justify-between gap-10 lg:flex lg:pl-20 xl:w-1/3">
							<p className="text-lg md:text-xl font-normal text-abeg-text">
								Join the effortless way to raise funds <br /> and make a
								difference and empower <br /> your cause with Abeghelp.me
							</p>

							<Button
								className="mt-5 flex max-w-[210px] justify-center border border-abeg-primary text-abeg-primary text-base outline-none whitespace-nowrap"
								asChild
							>
								<Link href="/explore" className="flex gap-2">
									<span>Explore campaigns</span>
									<div className="inline-block text-abeg-primary">
										<ArrowUpRight fill="#008080" />
									</div>
								</Link>
							</Button>
						</div>
					</div>

					<div
						{...dragScrollProps}
						className={cn(
							"gap-5 space-y-5 px-5 py-10 md:space-y-0 md:p-20",
							dragContainerClasses
						)}
					>
						{campaignCard.map((card, index) => (
							<div
								key={index}
								className="relative shrink-0 grow-0 space-y-3 rounded-xl bg-gray-200 p-5 md:w-[45%] lg:w-[30%]"
							>
								<h1 className="text-xl font-bold">{card.heading}</h1>
								<p className="text-sm font-medium">{card.text}</p>
								<div className="flex">
									<Image
										src={card.image}
										alt="Create campaign card image"
										width={200}
										height={200}
									/>
									<p className="absolute bottom-0 left-0 right-[-1.5rem] top-[8rem] flex justify-end text-end text-[13rem] font-bold text-white">
										{card.index}
									</p>
								</div>
							</div>
						))}
					</div>

					{featuredCampaigns.length > 0 && (
						<UrgentFundraisers
							featuredCampaigns={featuredCampaigns}
							className="pt-5 pb-20"
						/>
					)}
					<div className="w-full bg-why-choose-us px-5 md:px-20 py-10 md:py-20">
						<WhyUs />
					</div>
					<div className=" pt-10">
						<TestimonialCard />
					</div>
				</div>
				<FAQ />
			</BaseLayout>
		</>
	);
};

export default HomePage;

const Cards = () => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-8 md:gap-6  items-center">
			<div className="flex flex-col gap-4 text-white overflow-hidden">
				<div className="relative flex flex-col gap-20 p-4 md:p-6 h-full">
					<Image
						src={charity}
						className="absolute inset-0 z-[-1] size-full object-cover rounded-lg "
						fetchPriority="high"
						priority={true}
						loading="eager"
						alt=""
						width={200}
						height={200}
					/>
					<p className="font-bold text-lg m:text-xl">Charity</p>
					<p className="font-medium text-base md:text-lg">
						Respond to the humanitarian crisis in the North East, where
						insurgency has caused massive loss of lives and homelessness.
					</p>
				</div>
				<Link
					href="/explore/66029c5d59ccbd1162a2e252?name=Emergency"
					className="rounded-full bg-[#F7F7F7] w-full flex justify-between px-4 py-3 font-bold text-base text-abeg-text"
				>
					<span className="flex items-center">Donate</span>
					<div className="p-2 rounded-full bg-white">
						<ArrowUpRight />
					</div>
				</Link>
			</div>
			<div className="flex flex-col-reverse md:flex-col gap-4 text-white overflow-hidden">
				<BringPositiveChangeStar />
				<div className="rounded-full w-full  bg-[#F7F7F7] flex justify-between px-4 py-3 font-bold text-base text-abeg-text">
					<div className="p-2 rounded-full bg-white">
						<Heart />
					</div>
					<span className="flex items-center">Inspire change</span>
				</div>
				<div className="relative flex flex-col gap-8 p-4 md:p-6 bg-abeg-primary rounded-lg overflow-hidden ">
					<p className="font-bold text-lg m:text-xl">Change lives</p>
					<p className="font-medium text-base md:text-lg">
						30% of the African population lacks access to safe drinking water,
						and about 70% does not have access to basic sanitation facilities.
					</p>
				</div>
			</div>
			<div className="flex flex-col gap-4 text-white ">
				<div className=" flex flex-col gap-20 p-4 md:p-6 bg-abeg-primary overflow-hidden rounded-lg">
					<div className="flex gap-4 justify-between">
						<p className="font-bold text-lg m:text-xl">Humanitarian aid</p>
						<Smiley />
					</div>
					<p className="font-medium text-base md:text-lg">
						Empower others to thrive, fostering a better world for all. Let's
						create a community where everyone flourishes and contributes
						positively to society.
					</p>
				</div>
				<div className="rounded-full w-full  bg-[#F7F7F7] flex justify-between px-4 py-3 font-bold text-base text-abeg-text">
					<div className="p-2 rounded-full bg-white">
						<Cup />
					</div>
					<span className="flex items-center">Make a difference</span>
				</div>
			</div>
			<div className="flex flex-col-reverse md:flex-col gap-4 text-white overflow-hidden">
				<Link
					href="/explore"
					className="rounded-full bg-[#F7F7F7] w-full flex justify-between px-4 py-3 font-bold text-base text-abeg-text"
				>
					<span className="flex items-center">Explore campaigns</span>
					<div className="p-2 rounded-full bg-white">
						<ArrowUpRight />
					</div>
				</Link>
				<div className="relative flex flex-col gap-20 p-4 md:p-6 h-full">
					<Image
						src={support}
						className="absolute inset-0 z-[-1] size-full object-cover rounded-lg "
						fetchPriority="high"
						priority={true}
						loading="eager"
						alt=""
						width={200}
						height={200}
					/>
					<Sun />
					<div className="flex flex-col gap-4">
						<p className="font-bold text-lg m:text-xl">Charity</p>
						<p className="font-medium text-base md:text-lg">
							Respond to the humanitarian crisis in the North East, where
							insurgency has caused massive loss of lives and homelessness.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

const BringPositiveChange = () => {
	return (
		<div className="flex flex-col gap-16 lg:px-10">
			<div className="flex flex-col gap-4">
				<p className="text-center text-xl font-normal">
					Your passion, our platform.
					<span className="ml-4 inline-block ">
						<BringPositiveChangeStar />
					</span>
				</p>
				<p className="text-center text-2xl md:text-3xl font-bold">
					<span className="mr-4 inline-block">
						<BringPositiveChangeStar />
					</span>
					Together, let's bring positive change to the world.
				</p>
			</div>
		</div>
	);
};

const WhyUs = () => {
	const whyUsComponentTexts = [
		{
			title: `Empathy at Every Step`,
			text: `From personal causes to global initiatives, we understand the importance of every fundraiser and provide personalized support to help you reach your goals`,
		},
		{
			title: `Transparent and Low Fees`,
			text: `We ensure every cent that is being donated goes further with our low fees and transparent policy, so that more funds directly support your cause.`,
		},
		{
			title: `User-Friendly Technology`,
			text: `Our platform was designed with you in mind. From intuitive campaign setups to easy sharing and tracking tools, we make fundraising simple and stress-free.`,
		},
		{
			title: `Global Community of Supporters`,
			text: `Start a fundraiser with us and become part of a global community eager to support your cause, providing it with visibility and momentum.`,
		},
		{
			title: `Safety and Trust`,
			text: `We ensure user security through advanced encryption and strict data protection, meeting all standards to keep your campaign and personal information safe.`,
		},
		{
			title: `Start Making a Difference Today`,
			text: `Whether you're looking to support a friend in need, contribute to a community project, or fund a personal dream, we're here to help you make it happen.`,
		},
	];
	return (
		<div className="flex flex-col gap-8 md:gap-12">
			<div className="flex gap-3 items-center">
				<div className="w-2 bg-abeg-primary rounded-md h-20"></div>
				<div className="flex flex-col gap-2">
					<p className="text-xl">Why us?</p>
					<h3 className="text-2xl md:text-3xl font-bold">Why Choose Us?</h3>
				</div>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-y-12">
				{whyUsComponentTexts.map((singleComponent, id) => {
					return (
						<div key={id} className="flex flex-col gap-2 text-justify">
							<p className="text-lg md:text-xl font-bold">
								{singleComponent.title}
							</p>
							<p className="text-base md:text-lg font-normal">
								{singleComponent.text}
							</p>
						</div>
					);
				})}
			</div>
			<Button
				className="bg-abeg-primary font-semibold text-white md:text-lg w-fit mx-auto"
				asChild
			>
				<Link href="/c/create">Start a fundraiser</Link>
			</Button>
		</div>
	);
};
