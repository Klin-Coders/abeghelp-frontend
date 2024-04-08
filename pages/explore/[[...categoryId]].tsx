import TestimonialCard from "@/components/common/TestimonialCard";
import { CampaignCategories } from "@/components/common/landingPage";
import HowItWorks from "@/components/common/landingPage/HowItWorks";
import { CampaignCategoryCard } from "@/components/explore-campaign";
import { Button, Input } from "@/components/ui";
import type { ApiResponse } from "@/interfaces";
import type { AllCampaignCategories, Campaign } from "@/interfaces/Campaign";
import { BaseLayout } from "@/layouts";
import { callApi } from "@/lib";
import { usePaginate } from "@/lib/hooks";
import {
	heroCircle,
	heroHalfMoon,
	searchIcon,
} from "@/public/assets/images/campaign-category";
import type {
	GetStaticPaths,
	GetStaticProps,
	InferGetStaticPropsType,
} from "next";
import { NextSeo } from "next-seo";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export const getStaticPaths = (async () => {
	const { data, error } = await callApi<ApiResponse<Campaign[]>>(
		"/campaign/categories"
	);

	if (error || !data?.data || data.data.length === 0) {
		return {
			paths: [],
			fallback: false,
		};
	}

	return {
		paths: [{ _id: "" }, { _id: "all-categories" }, ...data.data].map(
			(category) => ({
				params: { categoryId: [category?._id] },
			})
		),

		fallback: false,
	};
}) satisfies GetStaticPaths;

export const getStaticProps = (async (context) => {
	const { categoryId } = context.params as { categoryId: string };

	const [allCampaigns, allCampaignCategories] = await Promise.all([
		callApi<ApiResponse<Campaign[]>>(
			`/campaign/all?limit=12${
				categoryId && categoryId[0] !== "all-categories"
					? `&category=${categoryId[0]}`
					: ""
			}`
		),
		callApi<ApiResponse<AllCampaignCategories[]>>("/campaign/categories"),
	]);

	if (
		allCampaigns.error ||
		!allCampaigns?.data?.data ||
		allCampaignCategories.error ||
		!allCampaignCategories?.data?.data
	) {
		return { props: { allCampaigns: [], allCampaignCategories: [] } };
	}
	return {
		props: {
			allCampaigns: allCampaigns.data.data,
			allCampaignCategories: allCampaignCategories.data.data,
		},
		revalidate: 30 * 60,
	};
}) satisfies GetStaticProps<{
	allCampaigns: Campaign[];
	allCampaignCategories: AllCampaignCategories[];
}>;

const ExploreCampaignPage = ({
	allCampaigns: campaigns,
	allCampaignCategories,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
	const params = useSearchParams();
	const categoryName = params.get("name");

	const [allCampaigns, setAllCampaigns] = useState(campaigns);

	const { currentPage, data, hasMore, hasPrevious } = usePaginate(
		"/campaign/all",
		{
			startPage: 2,
		}
	);

	return (
		<>
			<NextSeo
				title="Explore Campaigns"
				description="Explore campaigns on Abeghelp.me. Find the best campaigns on Abeghelp.me. Get started with Abeghelp.me."
				canonical="https://www.abeghelp.me/expore/all-categories"
				openGraph={{
					url: "https://www.abeghelp.me/explore/all-categories",
					title: "Explore Campaigns",
					description:
						"Explore campaigns on Abeghelp.me. Find the best campaigns on Abeghelp.me. Get started with Abeghelp.me.",
					images: [
						{
							url: "https://www.abeghelp.me/exlore/all-categories",
							width: 800,
							height: 600,
							alt: "Explore campaign image",
						},
					],
				}}
				twitter={{
					cardType: "summary_large_image",
				}}
			/>
			<BaseLayout>
				<div className="relative flex flex-col items-center space-y-4 overflow-hidden bg-cover bg-center px-5 py-28 text-gray-50 md:px-20 md:py-32">
					<Image
						src="/assets/images/landing-page/background.png"
						className="z-[-1] object-cover object-center"
						fetchPriority="high"
						priority={true}
						alt=""
						fill
					/>
					<Image
						src={heroHalfMoon}
						alt="hero svg icon"
						fetchPriority="high"
						priority={true}
						width={90}
						height={90}
						className="absolute right-[-2rem] top-[27rem] md:left-16 md:top-16 md:-translate-y-0 md:translate-x-0 lg:left-40 lg:top-32"
					/>
					<h1 className="pr-5 text-5xl font-bold leading-tight md:flex md:justify-center md:pr-0 md:text-6xl md:leading-snug">
						{categoryName ?? "All Categories"}
					</h1>
					<p className="max-w-[500px] pr-8 text-xl text-gray-50 md:pr-0 md:text-center">
						Join the effortless way to fundraise and make a difference and
						empower your cause with Abeghelp.me
					</p>
					<div className="relative flex w-full flex-row justify-center gap-2 pt-5 md:w-[40rem] md:gap-5 md:pt-8">
						<div className="flex flex-1 items-center">
							<Input
								placeholder="Type your enquiry here"
								searchInputClassName="w-full"
								className="relative w-full bg-transparent px-4 pl-12 text-white ring-1 ring-white placeholder:text-gray-200 md:max-w-[30rem] md:py-5"
							/>
							<Image
								src={searchIcon}
								alt="search icon"
								priority
								width={25}
								height={25}
								className="absolute bottom-0 left-3 -translate-y-1/2 md:bottom-2"
							/>
						</div>
						<Button className=" bg-white text-base font-bold text-abeg-primary md:px-9">
							Search
						</Button>
					</div>
					<Image
						src={heroCircle}
						alt="hero svg icon"
						fetchPriority="high"
						priority={true}
						width={150}
						height={150}
						className="md: absolute right-[-3rem] top-20 -translate-x-1/2 -translate-y-1/2 md:right-0 md:top-[25rem] md:-translate-y-0 md:translate-x-0 lg:bottom-40 lg:right-40"
					/>
				</div>

				<div className="pt-10 md:py-20">
					<CampaignCategoryCard
						allCampaigns={allCampaigns}
						categoryName={categoryName}
					/>
					<CampaignCategories
						className="px-5 pt-10 md:px-20 md:pt-20"
						allCampaignCategories={allCampaignCategories}
					/>
					<HowItWorks className="px-5 py-10 md:p-20" />
					<TestimonialCard />
				</div>
			</BaseLayout>
		</>
	);
};
export default ExploreCampaignPage;
