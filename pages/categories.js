import React, {Component, Fragment, useRef, useEffect, useCallback, useState} from 'react';

import { connect } from 'react-redux';

import { Trans } from '@lingui/macro';

import Link from 'next/link';

import Spinner from 'react-svg-spinner';

import Image from '../components/Image';

import { debounce } from 'underscore';

const API_URL = process.env.API_URL;
function CategoriesPage(props) {
	var categories = props.cat;
	var currentPage = useRef(1);
	var lastPage = categories.pagination.lastPage;
	const [isFetching, setIsFetching] = useState(false);
	const nextCategories = useState([]);

    // Create ref to attach to the loader component
    const loader = useRef(null);

	const fetchCategories = useCallback(async () => {
		setIsFetching(true);
		currentPage.current = categories.pagination.currentPage + 1;
		if(currentPage.current > lastPage){
			return null;
		}
		await fetch(API_URL + '/categories?page=' + currentPage.current, {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		})
		.then(response => response.json())
		.then(r => {
			categories.pagination = r.pagination;
			r.data.forEach((c) => {
				categories.data.push(c);
			})
			setIsFetching(false);
		});
	}, [categories, lastPage]);

    const loadMore = useCallback((entries) => {
        const target = entries[0];
        if (target.isIntersecting && nextCategories) {
            !isFetching && debounce(fetchCategories, 700)()
        }
    }, [isFetching, fetchCategories, nextCategories]);

    useEffect(() => {
		const l = loader;
        const options = {
            root: null, // window by default
            rootMargin: '0px',
            threshold: 0.25
        };

        // Create observer
        const observer = new IntersectionObserver(loadMore, options);

        // observer the loader
        if (loader && loader.current) {
            observer.observe(loader.current);
        }

        // clean up on willUnMount
        return () => {if(l && l.current) observer.unobserve(l.current);}
    }, [loader, loadMore]);

	return (
		<Fragment>
			<div className="w-100 pv3 ph3-l">
				<h2 className="f2 tracked mt0 mb3"><Trans>Browse</Trans></h2>
				<div className="site-component-categories grid ga2 ga3-l flex-grow-1 overflow-hidden grid-columns-2 grid-columns-2-m grid-columns-4-l grid-columns-5-xl h-100" style={{flexGrow: 1}}>
					{categories.data && categories.data.map((category) => {
						return (
							<Link href={`/category/${category.category_id}`} key={`category_${category.category_id}`}>
								<a className="site-component-categories_category flex flex-column flex-grow-1 flex-shrink-0 overflow-hidden w-100 no-underline">
									<div className="item-preview aspect-ratio aspect-ratio--16x9 z-1">
										<Image alt={category.name} priority={currentPage.current == 1} src={category.cover ? category.cover : `/img/categories/${category.category_id}.jpg`} className="aspect-ratio--object" shape="rounded" fit="cover" />
									</div>
									<div className="flex flex-grow-1 flex-shrink-0 justify-between mt2">
										<span className="f4 db link primary b truncate">{category.name}</span>
									</div>
								</a>
							</Link>
						);
					})}
					{
						categories.pagination
						&&
						lastPage !== currentPage.current
						&&
						<div style={{
							'width': '100%',
							'height': '70px',
							'display': 'flex',
							'justify-content': 'center',
							'align-items': 'center',
						}} ref={loader}>{isFetching && <Spinner color="white" size="64px" thickness={2}/>}</div>
					}
				</div>
			</div>
		</Fragment>
	)
}
CategoriesPage.getInitialProps = async () => {
	let cat;
	await fetch(API_URL + '/categories?page=1', {
		Accept: 'application/json',
		'Content-Type': 'application/json'
	})
	.then(response => response.json())
	.then(r => {
		cat = r;
	});
	return {...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {}), cat};
};
export default connect(state => state)(CategoriesPage)