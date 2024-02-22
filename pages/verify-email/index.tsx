import { Button, useToast } from "@/components/ui";
import { AuthPagesLayout } from "@/layouts";
import { callApi } from "@/lib";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const VerificationPage = () => {
	const router = useRouter();
	const { toast } = useToast();
	const [token, setToken] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setToken(router.query.token as string);
	}, [router]);

	const verifyEmail = async () => {
		setLoading(true);
		if (!token) {
			setLoading(false);
			return toast({
				title: "Request Failed",
				description: "No data provided",
				duration: 3000,
			});
		}
		const { data, error } = await callApi("/auth/verify-email", {
			token,
		});

		if (error) {
			setLoading(false);
			return toast({
				title: error.status as string,
				description: error.message,
				duration: 3000,
			});
		} else {
			setLoading(false);
			toast({
				title: "Success",
				description: (data as { message: string }).message,
				duration: 3000,
			});
			setTimeout(() => {
				void router.push("/verify-email/success");
			}, 1000);
		}
	};

	return (
		<AuthPagesLayout
			title="Verify your email"
			content="Verify your account to complete your registration process, check your email to complete this process!"
			withHeader={false}
			hasSuccess={false}
			contentClass="md:max-w-wAuthFlow"
		>
			{" "}
			<div className="space-y-2 text-center">
				<h1 className="text-xl font-medium">Verify your email</h1>
				<div className="">
					<p className="">
						Please click on the button below to verify your email.
					</p>
					<Button
						className="!mt-6"
						onClick={() => void verifyEmail()}
						fullWidth
						loading={loading}
					>
						Verify
					</Button>
				</div>
			</div>
		</AuthPagesLayout>
	);
};
export default VerificationPage;

VerificationPage.protect = true;
