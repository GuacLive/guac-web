import 'intersection-observer';
import ViewportObserver from 'viewport-observer';
import PropTypes from 'prop-types';

import SuperImage from 'super-image';

const BLANK_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=';
const ROOT_MARGIN = '200px 0px';

const t = typeof window !== 'undefined' && new window.Image;
const isObjectFitSupported = t && 'object-fit' in t.style;
const isIntersectionObserverSupported = typeof window !== 'undefined' && 'IntersectionObserver' in window;
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
        flexible: PropTypes.bool,
        sources: PropTypes.arrayOf(PropTypes.shape({
            srcSet: PropTypes.string,
            sizes: PropTypes.string,
            media: PropTypes.string,
            type: PropTypes.string
        }))
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
            r = this.props.fit && e && isObjectFitSupported;

        return (this.props.flexible ?
            <div className={`GuacImage -flexible${this.props.shape ? ` -${this.props.shape}` : ''}`} data-emote-code={this.props['data-emote-code']}            >
                <SuperImage
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
                    sources={this.props.sources}
                    onError={this.onError}
                    loading={this.props.lazyload ? 'lazy' : 'eager'}
                />
            </div> :
            <SuperImage
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
                sources={this.props.sources}
                onError={this.onError}
                loading={this.props.lazyload ? 'lazy' : 'eager'}
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
        if(this.viewportObserver){
            this.viewportObserver.dispose();
        }
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

    componentDidMount() {
        if(!isIntersectionObserverSupported) this.replaceImage()
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.src !== prevProps.src){
            this.setState({
                src: this.createImageUrl(this.props)
            });
        }
    }

    componentWillUnmount() {
        if(this.viewportObserver){
            this.viewportObserver.unobserve(this.refs.img);
            this.viewportObserver = null;
        }
    }

    render() {
        return this.props.lazyload ? <ViewportObserver
            ref={this.viewportObserver}
            rootMargin={ROOT_MARGIN}
            onEnter={this.onEnter}
        >
        {this.renderImage()}
        </ViewportObserver>
        : this.renderImage()
    }
}