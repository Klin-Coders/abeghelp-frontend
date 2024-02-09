import { useToast } from "@/components/ui/use-toast";
import { AuthLayout } from "@/layouts";
import { callApi } from "@/lib";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const VerificationPage = () => {
	const router = useRouter();
	const { toast } = useToast();
	const [queryParam, setQueryParam] = useState("");
	useEffect(() => {
		setQueryParam(router.query.email as string);
		console.log(queryParam, router);
	}, [router]);

	const handleResendEmail = async () => {
		if (!queryParam)
			return toast({
				title: "Request Failed",
				description: "No email provided",
			});
		const { data, error } = await callApi("/auth/resend-verification", {
			email: queryParam,
		});

		if (error) {
			return toast({
				title: error.status as string,
				description: error.message,
				duration: 3000,
			});
		} else {
			toast({
				title: "Success",
				description: (data as { message: string }).message,
				duration: 3000,
			});
		}
	};

	return (
		<AuthLayout
			contentClass="md:w-[55%] lg:w-[50%] xl:w-[35%] 2xl:w-[30%]"
			formType="signup"
			withHeader={false}
			hasSuccess={false}
		>
			<div className="space-y-2 text-center">
				<h1 className="text-xl font-semibold text-abeg-neutral-10 md:text-2xl">
					Email Verification
				</h1>
				<p className="">
					Please check your email for the verification link sent to you. Click
					the link to verify your email
				</p>
				<div className="!mt-6 flex flex-col gap-2">
					<p className="text-center text-sm">
						Didn&apos;t get the email?{" "}
						<span
							onClick={() => void handleResendEmail()}
							className="text-abeg-teal cursor-pointer"
						>
							Resend
						</span>
					</p>
					<Link
						href="/signin"
						className="bg-abeg-teal py-4 text-white rounded-md mt-2"
					>
						Back to Sign in{" "}
					</Link>
				</div>
			</div>
		</AuthLayout>
	);
};

export default VerificationPage;

VerificationPage.protect = true;
