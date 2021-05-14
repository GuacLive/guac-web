import PropTypes from 'prop-types';

import NextImage from 'next/image'

import React from 'react';

const BLANK_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=';

const t = typeof window !== 'undefined' && new window.Image;
export default class Image extends React.Component {
    static propTypes = { 
        src: PropTypes.string,
        sizes: PropTypes.string,
        width: PropTypes.number,
        height: PropTypes.number,
        className: PropTypes.string,
        alt: PropTypes.string,
        fit: PropTypes.oneOf(['contain', 'cover']),
        shape: PropTypes.oneOf(['rounded', 'circle', 'squircle']),
        //proxy: PropTypes.oneOf(h),
        crop: PropTypes.bool,
        lazyload: PropTypes.bool,
        flexible: PropTypes.bool,
        priority: PropTypes.bool
    };

    state = {
        error: false
    };

    constructor(props){
        super(props);
        this.state = {
            ...this.state,
            src: this.createImageUrl(this.props)
        };
        this.onEnter = this.onEnter.bind(this);
        this.onError = this.onError.bind(this);
        this.createImageUrl = this.createImageUrl.bind(this);
    }

    renderImage = function() {
        var e = 'browser' === this.title,
            isLoadingSupported = typeof HTMLImageElement !== 'undefined' && 'loading' in HTMLImageElement.prototype;
        return (this.props.flexible ?
            <div className={`GuacImage -flexible${this.props.shape ? ` -${this.props.shape}` : ''} ${this.state.error ? 'is-error' : ''}`} data-emote-code={this.props['data-emote-code']}            >
                <NextImage
                    key={this.state.src}
                    className={this.props.className}
                    objectFit={this.props.fit || 'contain'}
                    data-emote-code={this.props['data-emote-code']}
                    src={this.state.src}
                    sizes={this.state.sizes}
                    width={this.props.width}
                    height={this.props.height}
                    alt={this.props.alt}
                    title={this.props.title}
                    onError={this.onError}
                    className={`fit-${this.props.fit || 'contain'}`}
                    loading={isLoadingSupported ? (this.props.lazyload ? 'lazy' : 'eager') : undefined}
                    layout={!this.props.width && ! this.props.height ? 'fill' : this.props.layout}
                    unoptimized={this.props.unoptimized || (!this.state.src || this.state.src === BLANK_IMAGE)}
                    priority={this.props.priority}
                />
            </div> :
            <NextImage
                key={this.state.src}
                className={`GuacImage ${this.props.shape ? ` -${this.props.shape}` : ''} ${this.props.className}`}
                objectFit={this.props.fit || 'contain'}
                data-emote-code={this.props['data-emote-code']}
                src={this.state.src}
                sizes={this.state.sizes}
                width={this.props.width}
                height={this.props.height}
                alt={this.props.alt}
                title={this.props.title}
                onError={this.onError}
                loading={isLoadingSupported ? (this.props.lazyload ? 'lazy' : 'eager') : undefined}
                layout={!this.props.width && ! this.props.height ? 'fill' : this.props.layout}
                unoptimized={this.props.unoptimized || (!this.state.src || this.state.src === BLANK_IMAGE)}
                priority={this.props.priority}
                />
        );
    }

    createImageUrl(e) {
        var r = e.src,
            n = e.proxy;
        if(r !== BLANK_IMAGE && r.indexOf('//') === 0){
            if(typeof window !== 'undefined' && window.location && window.location.protocol){
                r = window.location.protocol + r;
            }else{
                r = 'https:' + r;
            }
        }
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