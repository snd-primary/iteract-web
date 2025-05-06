import Link from "next/link";
import "./globals.css";

export default function NotFound() {
	return (
		<div className="bg-black/95 text-amber-100  w-full h-dvh grid place-content-center place-items-center font-departure">
			<div className="grid grid-cols-1 gap-4">
				<h1 className="text-3xl ">404 - Page Not Found</h1>
				<p>Could not find the requested resource.</p>
				<Link
					href="/"
					className="underline text-blue-300 opacity-90 hover:opacity-100 transform-fill ease-in-out duration-200"
				>
					Back to IteractApp.
				</Link>
			</div>
		</div>
	);
}
