import { Heading, Loader } from "@/components/common";
import { CampaignOutlook } from "@/components/create-campaign";
import type { ApiResponse } from "@/interfaces";
import type { Campaign } from "@/interfaces/Campaign";
import { BaseLayout } from "@/layouts";
import { callApi } from "@/lib";
import { generateExcerpt } from "@/lib/helpers/campaign/generateExcerpt";
import type {
	GetStaticPaths,
	GetStaticProps,
	InferGetStaticPropsType,
} from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";

export const getStaticPaths = (async () => {
	const { data, error } = await callApi<ApiResponse<Campaign[]>>(
		"/campaign/all?limit=100&isPublished=true&status=Approved"
	);

	if (error || !data?.data || data.data.length === 0) {
		return {
			paths: [],
			fallback: "blocking",
		};
	}

	return {
		paths: data.data.map((campaign) => ({
			params: { shortId: campaign.url.split("/c/")[1] },
		})),

		fallback: true,
	};
}) satisfies GetStaticPaths;

export const getStaticProps = (async (context) => {
	const { shortId } = context.params as { shortId: string };

	const [singleCampaign, featuredCampaigns] = await Promise.all([
		callApi<ApiResponse<Campaign>>(`/campaign/one/${shortId}`),
		callApi<ApiResponse<Campaign[]>>("/campaign/featured"),
	]);

	console.log(singleCampaign.error, singleCampaign.data?.data);
	if (singleCampaign.error || !singleCampaign.data?.data) {
		return {
			notFound: true,
		};
	}

	return {
		props: {
			campaign: singleCampaign.data.data,
			featuredCampaigns: featuredCampaigns.data?.data ?? [],
		},
		revalidate: 15 * 60, // 15 mins
	};
}) satisfies GetStaticProps<{ campaign: Campaign }>;

function CampaignView(props: InferGetStaticPropsType<typeof getStaticProps>) {
	const { campaign, featuredCampaigns } = props;

	const router = useRouter();

	if (router.isFallback) {
		return <Loader message="Generating page please wait..." />;
	}

	const excerpt = generateExcerpt(campaign.story);
	return (
		<>
			<NextSeo
				canonical={campaign.url}
				openGraph={{
					url: campaign.url,
					title: campaign.title,
					description: excerpt,
					...(campaign.images.length > 0 && {
						images: campaign.images.map((image) => {
							return {
								url: image.secureUrl,
								width: 800,
								height: 600,
								alt: campaign.title,
							};
						}),
					}),
				}}
				twitter={{
					cardType: "summary_large_image",
				}}
			/>

			<CampaignOutlook
				featuredCampaigns={featuredCampaigns}
				excerpt={excerpt}
				campaign={campaign}
				campaignId={campaign._id}
			>
				<CampaignOutlook.Header>
					<Heading as="h1" className="text-2xl md:text-3xl">
						{`${campaign.title[0].toUpperCase()}${campaign.title.slice(1)}`}
					</Heading>
				</CampaignOutlook.Header>
			</CampaignOutlook>
		</>
	);
}

export default CampaignView;

CampaignView.getLayout = (page: React.ReactElement) => (
	<BaseLayout>{page}</BaseLayout>
);
