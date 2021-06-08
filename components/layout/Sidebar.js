
import Link from 'next/link'

import {Trans, t} from '@lingui/macro';

import SimpleBar from 'simplebar-react';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
	Tooltip,
} from 'react-tippy';
import Image from '../Image';

import ActiveLink from 'components/ActiveLink';

function Sidebar(props){
    const linkClassName  = 'items-center flex flex-nowrap pv2 hover-bg-dark-gray bg-animate link truncate white';
    const activeClassName = 'green';
    return (
        <aside className="fixed flex flex-column vh-100 flex-shrink-1 mv2-l site-component-sidebar bg-bar">
        <div className="flex flex-column h-100">
            <nav className="flex flex-column h-100 relative">
                <div className="flex flex-column flex-shrink-0 relative pv2">
                    <ActiveLink activeClassName={activeClassName} href="/">
                        <a className={linkClassName} title={i18n._(t`Home`)}>
                            <div className="w-100 truncate flex-grow-1 b lh-title">
                                <span title={i18n._(t`Home`)} className="inline-flex ml3" aria-hidden={true}><FontAwesomeIcon icon="home" /></span>
                                <span title={i18n._(t`Home`)} className="inline-flex ml3"><Trans>Home</Trans></span>
                            </div>
                        </a>
                    </ActiveLink>
                    <ActiveLink activeClassName={activeClassName} href="/channels">
                        <a className={linkClassName} title={i18n._(t`Channels`)}>
                            <div className="w-100 truncate flex-grow-1 b lh-title">
                                <span className="inline-flex ml3" aria-hidden={true}><FontAwesomeIcon icon="search" /></span>
                                <span className="inline-flex ml3"><Trans>Channels</Trans></span>
                            </div>
                        </a>
                    </ActiveLink>
                    <ActiveLink activeClassName={activeClassName} href="/categories">
                        <a className={linkClassName}>
                            <div className="w-100 truncate flex-grow-1 b lh-title" title={i18n._(t`Browse`)}>
                                <span className="inline-flex ml3" aria-hidden={true}><FontAwesomeIcon icon="gamepad" /></span>
                                <span className="inline-flex ml3"><Trans>Browse</Trans></span>
                            </div>
                        </a>
                    </ActiveLink>
                </div>
                <div className="flex f5 b ph3 light-gray">
                    <Trans>Followed Channels</Trans>
                </div>
                <div className="flex flex-column flex-grow-1 flex-nowrap overflow-hidden">
                    <SimpleBar className="flex-grow-1 h-100" style={{height: '0', flex: '1 1 auto'}}>
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
                                    if(a.live === b.live)
                                        return a.viewers-b.viewers;
                                    return !a.live ? -1 : 1;
                                })
                                .map((u) => {
                                    return (
                                        <Link key={'followed-' + u.username} href="/[channel]" as={`/${u.username}`}>
                                            <a className="site-component-fUser link white">
                                                <Tooltip
                                                    // options
                                                    title={u.title || i18n._(t`No stream title`)}
                                                    trigger="mouseenter"
                                                    theme="transparent"
                                                    unmountHTMLWhenHide={true}
                                                    className="flex items-center ph3 pv2 hover-bg-dark-gray bg-animate"
                                                    style={{'display': 'flex !important'}}
                                                >
                                                    <div className="items-center flex-shrink-0 relative w2 h2 mr2">
                                                        <Image
                                                            src={u.avatar || '//cdn.guac.live/profile-avatars/offline-avatar.png'}
                                                            alt={u.username}
                                                            width={70}
                                                            height={70}
                                                            shape="squircle"
                                                            fit="cover"
                                                            className={`ba ${+u.live ? 'b--red' : 'b--transparent'} v-mid`}
                                                        />
                                                    </div>
                                                    <div className="overflow-hidden" style={{
                                                        'WebkitBoxFlex': 1,
                                                        'msFlex': 'auto',
                                                        'flex': 'auto'
                                                    }}>
                                                        <span className="inline-flex items-center v-mid white b lh-title w-100 white">
                                                            <span className="truncate">{u.username}</span>
                                                        </span>
                                                        <div className="moon-gray f6 lh-copy truncate">{u.category_name}</div>
                                                    </div>
                                                    <div className="flex items-center justify-end">
                                                        {
                                                            +u.live
                                                                ?
                                                                <span className="ph2 f6 tc inline-flex truncate white flex-grow-1 lh-title">
                                                                    <span className="br-100 inline-flex f6 relative w1 h1 bg-red"></span>
                                                                    {u.viewers}
                                                                </span>
                                                                :
                                                                <span className="ph2 f6 tc inline-flex truncate white flex-grow-1 lh-title">Offline</span>
                                                        }
                                                    </div>
                                                </Tooltip>
                                            </a>
                                        </Link>
                                    )
                                })
                        }
                    </SimpleBar>
                </div>
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