import { CloudFlareTurnStile, CustomDialog } from "@/components/common";
import { Button, Input } from "@/components/ui";
import type { ApiResponse, User } from "@/interfaces";
import { AuthLayout, AuthPagesLayout } from "@/layouts";
import { type LoginType, callApi, zodValidator } from "@/lib";
import { useCloudflareTurnstile } from "@/lib/hooks";
import { useSession } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

const Login = () => {
	const { cfTurnStile, checkBotStatus, handleBotStatus } =
		useCloudflareTurnstile();
	const showModal = useRef(false);
	const router = useRouter();
	const [openModal, setOpenModal] = useState(false);
	const [success] = useState(false);
	const [skip2FA, setSkip2FA] = useState("false");
	const { user, updateUser } = useSession((state) => state);

	useEffect(() => {
		const skipModal = localStorage.getItem("skip-2FA");
		if (skipModal !== null) {
			setSkip2FA("true");
		}
	}, []);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<LoginType>({
		resolver: zodResolver(zodValidator("login")!),
		mode: "onChange",
		reValidateMode: "onChange",
	});

	const handleOption = async () => {
		await localStorage.setItem("skip-2FA", JSON.stringify(skip2FA));
		await void router.push("/dashboard");
		setOpenModal(false);
	};

	const onSubmit: SubmitHandler<LoginType> = async (data: LoginType) => {
		const { data: responseData, error } = await callApi<ApiResponse<User>>(
			"/auth/signin",
			{
				email: data.email,
				password: data.password,
			}
		);

		if (error) {
			const email = (error?.error as string)?.split(":")?.[1];

			if (email) {
				void router.push({
					pathname: "/signup/verification",
					query: { signup: true, email: data.email.toLowerCase() },
				});
			}
			return toast(error.status, {
				description: error.message,
				duration: 3000,
			});
		} else {
			toast("Success", {
				description: (responseData as { message: string }).message,
				duration: 3000,
			});

			reset();
			if (responseData?.data?.twoFA?.active === false) {
				if (skip2FA === "true") {
					router.push("/dashboard");
				} else {
					setOpenModal(true);
					await router.push("/signin?redirect=false", undefined, {
						shallow: true,
					});
				}
				updateUser(responseData?.data as User);
			} else {
				router.push("/2fa/authenticate");
			}
		}
	};

	// if (user !== null) {
	// 	void router.push("/");
	// 	return <Loader message={`You are already signed in. Redirecting to home`} />;
	// }
	return (
		<AuthLayout
			title="Sign in to your account"
			content="Sign in to your account to continue using Abeg Help!"
			heading="Welcome back!"
			greeting="Sign in to continue"
			withHeader
			hasSuccess={false}
		>
			<form
				className=""
				onSubmit={(event) => {
					event.preventDefault();

					const response = checkBotStatus();

					response && void handleSubmit(onSubmit)(event);
				}}
			>
				<div className="space-y-1">
					<label htmlFor="email" className="text-sm font-medium">
						Email Address
					</label>
					<Input
						{...register("email")}
						autoFocus
						type="email"
						id="email"
						placeholder="Enter your email address"
						className={`min-h-[45px] ${
							errors.email &&
							"ring-2 ring-abeg-error-20 placeholder:text-abeg-error-20"
						}`}
					/>
					{errors.email && (
						<p className="text-sm text-abeg-primary">{errors.email.message}</p>
					)}
				</div>
				<div className="mt-4 space-y-1">
					<label htmlFor="password" className="text-sm font-medium">
						Password
					</label>
					<Input
						{...register("password")}
						type="password"
						id="password"
						placeholder="Enter password"
						className={`min-h-[45px] ${
							errors.password &&
							"ring-2 ring-abeg-error-20 placeholder:text-abeg-error-20"
						}`}
					/>
					{errors.password && (
						<p className="text-sm text-abeg-primary">
							{errors.password.message}
						</p>
					)}
				</div>
				<Link
					href="/forgot-password"
					className="textabeg-primary mt-2 inline-flex w-full justify-end text-sm font-semibold hover:underline"
				>
					Forgot Password?
				</Link>

				<CloudFlareTurnStile
					ref={cfTurnStile}
					onStatusChange={handleBotStatus}
				/>
				<div className="flex flex-col gap-6">
					<CustomDialog
						openDialog={openModal}
						setOpen={() => setOpenModal(openModal)}
						trigger={
							<Button
								type="submit"
								disabled={isSubmitting || success}
								loading={isSubmitting}
								variant="primary"
								className="mt-6 disabled:bg-gray-500 "
								fullWidth
							>
								Sign in
							</Button>
						}
					>
						<div className="text-center">
							<h2 className="text-2xl font-semibold">
								Keep your account safe!
							</h2>
							<div className="mt-3 space-y-2">
								<p className="">Your safety is our number one priority</p>
								<p className="">
									Activate two-factor authentication and add an extra layer of
									security to your account
								</p>
							</div>
							<div className="mt-6 flex flex-col">
								<Link
									className="bg-abeg-primary w-full rounded-md py-4 text-sm font-semibold text-white"
									href="/2fa"
								>
									Activate
								</Link>

								<Button
									type="submit"
									disabled={isSubmitting}
									onClick={handleOption}
									className="border-abeg-primary text-abeg-primary mt-4 border py-4 disabled:bg-gray-500 disabled:text-white"
									fullWidth
								>
									Skip
								</Button>
							</div>
						</div>
					</CustomDialog>
					<Button
						type="submit"
						disabled={isSubmitting || success}
						loading={isSubmitting}
						className="mt-6"
						variant="primary"
						fullWidth
					>
						Sign in
					</Button>
					<p className="text-center text-sm">
						Don&apos;t have an account?&nbsp;
						<Link
							href="/signup"
							className="font-medium text-abeg-primary underline"
						>
							Register
						</Link>
					</p>
				</div>
			</form>
		</AuthLayout>
	);
};

export default Login;

Login.getLayout = AuthPagesLayout;
Login.protect = true;
