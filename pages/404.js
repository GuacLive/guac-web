import Head from "next/head";
import Link from 'next/link';
// pages/404.js
export default function Custom404() {
	return (
		<>
		<Head>
		<title>guac.live &middot; Page not found</title>
		</Head>
		<main className="g">
				<div className="u">
					<div className="a">
							<div className="c">
								<h2 className="f2">We could not find the page you were looking for.</h2>
								<p><Link className="link primary" href="/">Go to frontpage</Link></p>
							</div>
					</div>
				</div>
		</main>
		</>
	);
}