import { Loader, OtpInputDisplay } from "@/components/common";
import { Button } from "@/components/ui";
import { type ApiResponse, type User } from "@/interfaces";
import type { SessionData } from "@/interfaces/ApiResponses";
import { AuthPagesLayout } from "@/layouts";
import { callApi } from "@/lib";
import { useCampaignStore, useSession } from "@/store";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { type Dispatch, type FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
	email?: string;
	loading: boolean;
	otp: string;
	setOtp: Dispatch<React.SetStateAction<string>>;
	handleSubmit: (e: FormEvent<HTMLButtonElement>) => void;
};
const EmailAuth = ({ otp, setOtp, handleSubmit, loading, email }: Props) => {
	const [resend, setResend] = useState(false);

	const resendCode = async () => {
		// e.preventDefault();
		setResend(true);
		const { data, error } = await callApi<ApiResponse>("/auth/2fa/code/email");
		if (error) {
			setResend(false);
			setResend(false);
			toast.error(error.status, {
				description: error.message,
				duration: 2000,
			});
		} else {
			setResend(false);
			toast.success("Success", {
				description: (data as { message: string }).message,
				duration: 2000,
			});
		}
	};
	useEffect(() => {
		void resendCode();
	}, []);
	return (
		<OtpInputDisplay
			otp={otp}
			setOtp={setOtp}
			topSection={
				<p className="">{` Enter the 6 digits code we sent to ${email}`}</p>
			}
			bottomSection={
				<>
					<Button
						type="submit"
						disabled={loading}
						loading={loading}
						onClick={(e) => handleSubmit(e)}
						className="my-8 block w-full rounded-md bg-abeg-primary py-4 font-semibold text-white"
						fullWidth
					>
						Confirm
					</Button>
					<div className="space-y-3">
						<p className="text-center">
							Didn&apos;t get a code? We can&nbsp;
							<Button
								type="submit"
								disabled={resend}
								onClick={() => void resendCode()}
								className="!bg-transparent p-0 font-medium text-abeg-primary disabled:text-abeg-neutral-50"
							>
								resend it
							</Button>
						</p>
						<p className="text-center text-sm">
							If you’re unable to receive a security code, use one of your
							backup codes.
						</p>
					</div>
				</>
			}
		/>
	);
};
const AuthApp = ({ otp, setOtp, handleSubmit, loading }: Props) => {
	return (
		<OtpInputDisplay
			otp={otp}
			setOtp={setOtp}
			topSection={
				<p className="">
					Enter the 6 digits code generated by your authenticator app
				</p>
			}
			bottomSection={
				<Button
					type="submit"
					disabled={loading}
					loading={loading}
					onClick={(e) => handleSubmit(e)}
					className="mt-8 block w-full rounded-md bg-abeg-primary py-4 font-semibold text-white"
					fullWidth
				>
					Confirm
				</Button>
			}
		/>
	);
};

const AuthenticateUser = () => {
	const [otp, setOtp] = useState("");
	const [loading, setLoading] = useState(false);

	const {
		user,
		actions: { updateUser },
	} = useSession((state) => state);
	const {
		actions: { initializeCampaigns },
	} = useCampaignStore((state) => state);

	const router = useRouter();

	const params = useSearchParams();
	const authType = params.get("type");
	const email = params.get("email");

	if (!authType || (authType === "EMAIL" && !email)) {
		setTimeout(() => router.push("/signin"), 1000);
		return <Loader message="Please log in again" />;
	}

	const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (otp === "")
			return toast.error("Error", {
				description: "Please enter a valid code",
				duration: 1500,
			});
		setLoading(true);
		const { data, error } = await callApi<ApiResponse<SessionData>>(
			"/auth/2fa/verify",
			{
				token: String(otp),
			}
		);

		if (error) {
			setLoading(false);
			toast.error(error.status, {
				description: error.message,
				duration: 1500,
			});
		} else {
			if (data?.data) {
				const { user, campaigns } = data.data;
				updateUser(user as User);
				initializeCampaigns(campaigns);
				setLoading(false);
				toast.success("Success", {
					description: (data as { message: string }).message,
					duration: 1500,
				});
				router.push(campaigns.length > 0 ? "/c" : "/c/create");
			}
		}
	};

	return (
		<AuthPagesLayout
			title="Authenticate your Account!"
			content="Enter the 6 digits code sent to your email or generated by your authenticator app."
			withHeader={false}
			hasSuccess={false}
		>
			{authType === "EMAIL" || user?.twoFA?.type === "EMAIL" ? (
				<EmailAuth
					email={email ?? user?.email}
					otp={otp}
					setOtp={setOtp}
					handleSubmit={(e) => void handleSubmit(e)}
					loading={loading}
				/>
			) : (
				<AuthApp
					otp={otp}
					setOtp={setOtp}
					handleSubmit={(e) => void handleSubmit(e)}
					loading={loading}
				/>
			)}
		</AuthPagesLayout>
	);
};

export default AuthenticateUser;
AuthenticateUser.protect = true;
