import type { User } from "@/interfaces";
import { useSession } from "@/store";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { Loader } from "./common";

const Auth = ({ children }: { children: ReactNode }) => {
	const { user, loading } = useSession((state) => state);

	const router = useRouter();

	if (loading || !router.pathname)
		return <Loader message="Validating auth status..." />;

	//  inaccessible routes when user is authenticated
	const noAuthRoutes = [
		"/signin",
		"/signup",
		"/signup/verification",
		"/verify-email",
		"/verify-email/success",
		"/reset-password",
		"/forgot-password",
		"/2fa/authenticate",
	];

	const isInaccessible = noAuthRoutes.includes(router.pathname);

	const redirect = (route: string, message: string) => {
		toast.error("Page access denied!", {
			description: message,
			id: "access-denied",
			duration: 1000,
		});

		setTimeout(() => {
			void router.push(route);
		}, 500);
	};
	if (isInaccessible && user) {
		const { redirect: nav } = router.query;
		if (typeof nav === "undefined" || nav === "true") {
			redirect("/", "You are already signed in");
			return <Loader message="You are already signed in" />;
		}
	}

	if (!isInaccessible && !user) {
		redirect("/signin", "You are not signed in");
		return <Loader message="You are not signed in" />;
	}

	if (user && (user as User).twoFA?.active) {
		if (
			!(user as User).twoFA?.isVerified &&
			router.pathname.includes("/2fa/authenticate")
		) {
			redirect(
				`/2fa/authenticate?type=${user.twoFA.type}&email=${user.email}`,
				"You need to verify your account"
			);
			return <Loader message="You need to verify your account" />;
		}

		if (
			router.pathname.includes("/2fa") &&
			(user as User).twoFA?.isVerified === true
		) {
			redirect("/", "2FA is already active or verified!");
			return <Loader message="2FA is already active or verified!" />;
		}
	}

	return children;
};

export default Auth;
