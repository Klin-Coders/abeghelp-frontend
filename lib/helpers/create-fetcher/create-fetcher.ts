import { isFormData, isObject } from "@/lib/type-helpers/typeof";
import type {
	AbegApiResult,
	AbegErrorResponse,
	AbegSuccessResponse,
	AbortSignalWithAny,
	BaseFetchConfig,
} from "./types";
import { getResponseData } from "./utils";

const createFetcher = <TBaseData, TBaseErrorData>(
	baseConfig: BaseFetchConfig<TBaseData, TBaseErrorData>
) => {
	const {
		baseURL,
		timeout,
		defaultErrorMessage = "Failed to fetch success response from server!",
		headers,
		onResponse,
		onResponseError,
		...restOfBaseConfig
	} = baseConfig as BaseFetchConfig;

	const abortControllerStore = new Map<`/${string}`, AbortController>();

	const callApi = async <TData = TBaseData, TErrorData = TBaseErrorData>(
		url: `/${string}`,
		bodyData?: Record<string, unknown> | FormData,
		signal?: AbortSignal
	): Promise<AbegApiResult<TData, TErrorData>> => {
		const prevController = abortControllerStore.get(url);

		if (prevController) {
			prevController.abort();
		}

		const fetchController = new AbortController();
		abortControllerStore.set(url, fetchController);

		const timeoutId = timeout
			? setTimeout(() => {
					fetchController.abort();
					throw new Error(`Request timed out after ${timeout}ms`, {
						cause: "Timeout",
					});
				}, timeout)
			: null;

		// FIXME - Remove this type cast once TS updates its lib-dom types for AbortSignal, to include the new any() method
		const combinedSignal = (AbortSignal as AbortSignalWithAny).any([
			fetchController.signal,
			signal ?? fetchController.signal,
		]);

		try {
			const response = await fetch(`${baseURL}${url}`, {
				signal: combinedSignal,

				method: bodyData ? "POST" : "GET",

				body: isObject(bodyData) ? JSON.stringify(bodyData) : bodyData,

				// == If the body is an object, then we automatically set the Content-Type and Accept headers appropriately.
				// == If the body is FormData, then we automatically set the Content-Type header appropriately.
				headers: {
					...(isObject(bodyData) && {
						"Content-Type": "application/json",
						Accept: "application/json",
					}),
					...(isFormData(bodyData) && {
						"Content-Type": "multipart/form-data",
					}),
					...headers,
				},

				...restOfBaseConfig,
			});

			// == Response has http errors at this point
			if (!response.ok) {
				const errorResponse = await getResponseData<AbegErrorResponse<TErrorData>>(response);

				await onResponseError?.({ ...response, errorData: errorResponse });

				// == Data must be explicitly set to null here, to honor the callApi return type
				return {
					data: null,
					error: errorResponse,
				};
			}

			const successResponse = await getResponseData<AbegSuccessResponse<TData>>(response);

			// == Response was successful, so await response interceptor and return the data
			await onResponse?.({ ...response, data: successResponse });

			// == Error must be explicitly set to null here, to honor the callApi return type
			return {
				data: successResponse,
				error: null,
			};

			// == Exhaustive error handling for request failures
		} catch (error) {
			if (
				error instanceof DOMException &&
				error.name === "AbortError" &&
				error.cause === "Timeout"
			) {
				const message = `Request was cancelled`;

				console.info(
					`%cAbortError: ${message}`,
					"color: red; font-weight: 500; font-size: 14px;"
				);
				console.trace("AbortError");

				return {
					data: null,
					error: {
						status: "Error",
						message,
					},
				};
			}

			return {
				data: null,
				error: {
					status: "Error",
					message: (error as { message?: string }).message ?? defaultErrorMessage,
				},
			};

			// == Clean up the timeout and remove the now unneeded AbortController from the store
		} finally {
			abortControllerStore.delete(url);
			timeoutId && clearTimeout(timeoutId);
		}
	};

	// == Quick abort method if one gets too lazy to pass in a custom signal
	callApi.abort = (url: `/${string}`) => abortControllerStore.get(url)?.abort();

	return callApi;
};

export { createFetcher };
