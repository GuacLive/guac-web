
import Link from 'next/link'

import {Trans, t} from '@lingui/macro';

import SimpleBar from 'simplebar-react';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
	Tooltip,
} from 'react-tippy';
import Image from '../Image';
function Sidebar(props){
    return (
        <aside className="fixed flex flex-column vh-100 flex-shrink-1 mv2-l site-component-sidebar bg-bar">
        <div className="flex flex-column h-100">
            <nav className="flex flex-column h-100 relative">
                <div className="flex flex-column flex-shrink-0 relative pv2">
                    <Link href="/">
                        <a className="items-center flex flex-nowrap ph3 pv2 hover-bg-dark-gray bg-animate link truncate white hover-light-green">
                            <div className="w-100 truncate flex-grow-1 b lh-title">
                                <span title={i18n._(t`Home`)} className="inline-flex ml3" aria-hidden={true}><FontAwesomeIcon icon="home" /></span>
                                <span title={i18n._(t`Home`)} className="inline-flex ml3"><Trans>Home</Trans></span>
                            </div>
                        </a>
                    </Link>
                    <Link href="/channels">
                        <a className="items-center flex flex-nowrap ph3 pv2 hover-bg-dark-gray bg-animate link truncate white hover-light-green">
                            <div className="w-100 truncate flex-grow-1 b lh-title">
                                <span title={i18n._(t`Channels`)} className="inline-flex ml3" aria-hidden={true}><FontAwesomeIcon icon="search" /></span>
                                <span title={i18n._(t`Channels`)} className="inline-flex ml3"><Trans>Channels</Trans></span>
                            </div>
                        </a>
                    </Link>
                    <Link href="/categories">
                        <a className="items-center flex flex-nowrap ph3 pv2 hover-bg-dark-gray bg-animate link truncate white hover-light-green">
                            <div className="w-100 truncate flex-grow-1 b lh-title">
                                <span title={i18n._(t`Browse`)} className="inline-flex ml3" aria-hidden={true}><FontAwesomeIcon icon="gamepad" /></span>
                                <span title={i18n._(t`Browse`)} className="inline-flex ml3"><Trans>Browse</Trans></span>
                            </div>
                        </a>
                    </Link>
                </div>
                <div className="flex f5 b ph3 light-gray">
                    <Trans>Followed Channels</Trans>
                </div>
                <SimpleBar className="flex flex-grow-1 relative h-100">
                    {
                        (!props.followed ||
                            !props.followed.length)
                        &&
                        <div className="align-center flex-l dn flex-column relative ph4 pv2 white">
                            <Trans>Start following your favorite streamers to find them quickly!</Trans>
                        </div>
                    }
                    {
                        props.followed &&
                        [].concat(props.followed)
                            .sort((a, b) => {
                                if (a.live === b.live) {
                                    return 1;
                                } else if (a.live) {
                                    return 0;
                                } else {
                                    return -1;
                                }
                            })
                            .sort((a, b) => {
                                return b.viewers - a.viewers;
                            })
                            .map((u) => {
                                return (
                                    <Link key={'followed-' + u.username} href="/[channel]" as={`/${u.username}`}>
                                        <a className="site-component-fUser link white">
                                            <Tooltip
                                                // options
                                                title={u.title || i18n._(t`No stream title`)}
                                                position="right"
                                                trigger="mouseenter"
                                                theme="transparent"
                                                unmountHTMLWhenHide={true}
                                                className="items-center flex flex-nowrap ph3 pv2 hover-bg-dark-gray bg-animate"
                                                style={{'display': 'flex !important'}}
                                            >
                                                <div className="items-center flex-shrink-0 relative w2 h2">
                                                    <Image
                                                        src={u.avatar || 'https://api.guac.live/avatars/unknown.png'}
                                                        alt={u.username}
                                                        width={70}
                                                        height={70}
                                                        shape="squircle"
                                                        fit="cover"
                                                        className={`ba ${+u.live ? 'b--red' : 'b--transparent'} v-mid`}
                                                    />
                                                </div>
                                                <div className="flex justify-between truncate w-100">
                                                    <div className="site-component-fMetadata truncate w-100 ml3">
                                                        <div className="site-component-fUser__name flex items-center">
                                                            <span className="truncate white flex-grow-1 b lh-title">{u.username}</span>
                                                        </div>
                                                        <div className="site-component-fUser__category pr2">
                                                            <span className="f6 lh-title">{u.category_name}</span>
                                                        </div>
                                                    </div>
                                                    <div className="site-component-fLive flex-shrink-0 ml2">
                                                        <div className="flex items-center">
                                                            {
                                                                +u.live
                                                                    ?
                                                                    <span className="ph2 f6 tc inline-flex truncate white flex-grow-1 lh-title mh3">
                                                                        <span className="br-100 inline-flex f6 relative w1 h1 bg-red"></span>
                                                                        {u.viewers}
                                                                    </span>
                                                                    :
                                                                    <span className="ph2 f6 tc inline-flex truncate white flex-grow-1 lh-title mh3">Offline</span>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </Tooltip>
                                        </a>
                                    </Link>
                                )
                            })
                    }
                </SimpleBar>
            </nav>
            <footer className="flex white ph4 ph2-m mb5">
                <div className="f6 flex flex-column flex-grow-1" style={{flexFlow: 'row wrap'}}>
                    <span className="dib mr4 ttu tracked">© {(new Date()).getFullYear()} guac.live</span>
                    <span className="dib mr4 f7 silver">v{process.env.SENTRY_RELEASE}</span>
                    <div className="flex flex-row flex-grow-1">
                        <Link href="/terms">
                            <a className="link white hover-light-purple mr2"><Trans>Terms</Trans></a>
                        </Link>
                        <span className="white-80 mr2">&middot;</span>
                        <Link href="/privacy">
                            <a className="link white hover-gold mr2"> <Trans>Privacy</Trans> </a>
                        </Link>
                        <span className="white-80 mr2">&middot;</span>
                        <Link href="/dmca">
                            <a className="link white hover-red mr2"> <Trans>DMCA</Trans> </a>
                        </Link>
                    </div>
                    <a href="mailto:contact@guac.live" className="link white-80 hover-green"> contact@guac.live </a>
                    <iframe
                        src="https://www.patreon.com/platform/iframe?widget=become-patron-button&creatorID=19057109"
                        scrolling="no"
                        allowtransparency="true"
                        frameBorder="0"
                        className="patreon-widget"
                        title={i18n._(t`Support us on patreon!`)}
                        style={{display: 'flex', width: '11rem', height: '45px', verticalAlign: 'middle'}}
                    />
                </div>
            </footer>
        </div>
    </aside>
    );
}
export default Sidebar;