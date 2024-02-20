import { OtpInputDisplay } from "@/components/common";
import { Button, useToast } from "@/components/ui";
import { type ApiResponse, type User } from "@/interfaces";
import { AuthLayout, AuthPagesLayout } from "@/layouts";
import { callApi } from "@/lib";
import { useSession } from "@/store";
import { useRouter } from "next/router";
import {
	type Dispatch,
	type FormEvent,
	useEffect,
	useRef,
	useState,
} from "react";

type Props = {
	email?: string;
	loading: boolean;
	otp: string;
	setOtp: Dispatch<React.SetStateAction<string>>;
	handleSubmit: (e: FormEvent<HTMLButtonElement>) => void;
};
const EmailAuth = ({ otp, setOtp, handleSubmit, loading, email }: Props) => {
	const { toast } = useToast();
	const resend = useRef(false);

	const resendCode = async () => {
		// e.preventDefault();
		resend.current = true;
		const { data, error } = await callApi<ApiResponse>("/auth/2fa/code/email");
		if (error) {
			resend.current = false;
			return toast({
				title: error.status as string,
				description: error.message,
				duration: 2000,
			});
		} else {
			resend.current = false;
			toast({
				title: "Success",
				description: (data as { message: string }).message,
				duration: 2000,
			});
		}
	};
	useEffect(() => {
		void resendCode();
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
						onClick={(e) => void handleSubmit(e)}
						className="bgabeg-primary my-8 block w-full rounded-md py-4 font-semibold text-white"
						fullWidth
					>
						Confirm
					</Button>
					<div className="space-y-3">
						<p className="text-center">
							Didn&apos;t get a code? We can&nbsp;
							<Button
								type="submit"
								disabled={resend.current}
								onClick={() => void resendCode()}
								className="text-abeg-teal p-0 font-medium disabled:bg-transparent disabled:text-neutral-50"
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
					onClick={(e) => void handleSubmit(e)}
					className="bgabeg-primary mt-8 block w-full rounded-md py-4 font-semibold text-white"
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
	const { toast } = useToast();
	const { user, updateUser } = useSession((state) => state);
	const router = useRouter();
	const castedUser = user as User;

	const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (otp === "")
			return toast({
				title: "Error",
				description: "Please enter a valid code",
				duration: 1500,
			});
		setLoading(true);
		const { data, error } = await callApi<ApiResponse>("/auth/2fa/verify", {
			token: String(otp),
		});
		if (error) {
			setLoading(false);
			return toast({
				title: error.status as string,
				description: error.message,
				duration: 2000,
			});
		} else {
			updateUser(data?.data as User);
			setLoading(false);
			toast({
				title: "Success",
				description: (data as { message: string }).message,
				duration: 2000,
			});
			void router.push("/");
		}
	};
	// if (castedUser === null) {
	// 	setTimeout(() => {
	// 		void router.push("/signin");
	// 	}, 1000);
	// 	return (
	// 		<Loader message={`You are not signed in. Redirecting to sign in page`} />
	// 	);
	// } else if (castedUser?.twoFA.isVerified) {
	// 	setTimeout(() => {
	// 		void router.push("/");
	// 	}, 1000);
	// 	return (
	// 		<Loader message={`You are already signed in. Redirecting to home page`} />
	// 	);
	// }
	return (
		<AuthLayout
			title="Authenticate your Account!"
			content="Enter the 6 digits code sent to your email or generated by your authenticator app."
			withHeader={false}
			hasSuccess={false}
		>
			{castedUser?.twoFA.type === "EMAIL" ? (
				<EmailAuth
					email={castedUser?.email}
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
		</AuthLayout>
	);
};

export default AuthenticateUser;

AuthenticateUser.getLayout = AuthPagesLayout;
AuthenticateUser.protect = true;
