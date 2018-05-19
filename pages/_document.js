import Document, { Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
	render() {
		const {buildManifest, pathname} = this.props
		const {css} = buildManifest
		return (
		<html data-cast-api-enabled="true">
			<Head>
			{css.map((file) => {
				return <link rel="stylesheet" href={`/_next/${file}`} key={file} />
			})}
			<link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick-theme.min.css" />
			<script type="text/javascript" src="//www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1"></script>
			</Head>
			<body className="sans-serif h-100 w-100">
				<Main />
				<NextScript />
			</body>
		</html>
		)
	}
}