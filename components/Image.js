import PropTypes from 'prop-types';

import NextImage from 'next/image'

const BLANK_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=';

const t = typeof window !== 'undefined' && new window.Image;
const isObjectFitSupported = t && 'object-fit' in t.style;
export default class Image extends React.Component {
    static propTypes = { 
        src: PropTypes.string,
        width: PropTypes.string,
        height: PropTypes.string,
        className: PropTypes.string,
        alt: PropTypes.string,
        fit: PropTypes.oneOf(['contain', 'cover']),
        shape: PropTypes.oneOf(['rounded', 'circle', 'squircle']),
        //proxy: PropTypes.oneOf(h),
        crop: PropTypes.bool,
        lazyload: PropTypes.bool,
        flexible: PropTypes.bool
    };

    state = {
        src: BLANK_IMAGE,
        error: false
    };

    constructor(props){
        super(props);
        if(!props.lazyload){
            this.state = {
                ...this.state,
                src: this.createImageUrl(this.props)
            };
        }
        this.onEnter = this.onEnter.bind(this);
        this.onError = this.onError.bind(this);
        this.createImageUrl = this.createImageUrl.bind(this);
    }

    renderImage = function() {
        var e = 'browser' === this.title,
            r = this.props.fit && e && isObjectFitSupported,
            isLoadingSupported = typeof HTMLImageElement !== 'undefined' && 'loading' in HTMLImageElement.prototype;

        return (this.props.flexible ?
            <div className={`GuacImage -flexible${this.props.shape ? ` -${this.props.shape}` : ''}`} data-emote-code={this.props['data-emote-code']}            >
                <NextImage
                    key={this.state.src}
                    className={this.props.className}
                    data-emote-code={this.props['data-emote-code']}
                    src={this.state.src}
                    width={this.props.width}
                    height={this.props.height}
                    alt={this.props.alt}
                    title={this.props.title}
                    fit={this.props.fit}
                    fitFallback={r}
                    flexible={this.props.flexible}
                    onError={this.onError}
                    loading={isLoadingSupported ? (this.props.lazyload ? 'lazy' : 'eager') : undefined}
                />
            </div> :
            <NextImage
                key={this.state.src}
                className={`GuacImage ${this.props.shape ? ` -${this.props.shape}` : ''} ${this.props.className}`}
                data-emote-code={this.props['data-emote-code']}
                src={this.state.src}
                width={this.props.width}
                height={this.props.height}
                alt={this.props.alt}
                title={this.props.title}
                fit={this.props.fit}
                fitFallback={r}
                flexible={this.props.flexible}
                onError={this.onError}
                loading={isLoadingSupported ? (this.props.lazyload ? 'lazy' : 'eager') : undefined}
            />
        );
    }

    createImageUrl(e) {
        var r = e.src,
            n = e.proxy;
        return r;
    }
    
    replaceImage() {
        this.setState({
            src: this.createImageUrl(this.props)
        })
    }

    onEnter(){
        return this.setState({
            src: this.createImageUrl(this.props)
        });
    }

    onError(){
        this.setState({
            src: BLANK_IMAGE,
            error: true
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.src !== prevProps.src){
            this.setState({
                src: this.createImageUrl(this.props)
            });
        }
    }

    render() {
        return this.renderImage()
    }
}