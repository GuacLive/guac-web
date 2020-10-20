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
	var currentPage = 1;
	var lastPage = categories.pagination.lastPage;
	const [isFetching, setIsFetching] = useState(false);
	const nextCategories = useState([]);

    // Create ref to attach to the loader component
    const loader = useRef(null);

	const fetchCategories = async () => {
		setIsFetching(true);
		currentPage = categories.pagination.currentPage + 1;
		if(currentPage > lastPage){
			return null;
		}
		await fetch(API_URL + '/categories?page=' + currentPage, {
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
	};

    const loadMore = useCallback((entries) => {
        const target = entries[0];
        if (target.isIntersecting && nextCategories) {
            !isFetching && debounce(fetchCategories, 700)()
        }
    }, [isFetching, categories.data, fetchCategories]);

    useEffect(() => {
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
        return () => observer.unobserve(loader.current);
    }, [loader, loadMore]);

	return (
		<Fragment>
			<div className="w-100 pv3 ph3-l">
				<h2 className="f2 tracked mt0 mb3"><Trans>Browse</Trans></h2>
				<div className="site-component-categories flex flex-row flex-wrap w-100" style={{flexGrow: 1}}>
					{categories.data && categories.data.map((category) => {
						return (
							<Link href={`/category/[id}`} href={`/category/${category.category_id}`} key={`category_${category.category_id}`}>
								<a className="site-component-categories_category flex flex-column flex-grow-0 flex-shrink-0 overflow-hidden w-20-l w-80-m w-100 pa2 no-underline">
									<div className="item-preview aspect-ratio aspect-ratio--16x9 z-1">
										<Image src={category.cover ? category.cover : `/img/categories/${category.category_id}.jpg`} className="aspect-ratio--object" shape="rounded" fit="cover" lazyload />
									</div>
									<div className="flex flex-grow-1 flex-shrink-1 pa2">
										<span className="f3 db link green truncate">{category.name}</span>
									</div>
								</a>
							</Link>
						);
					})}
					{
						categories.pagination
						&&
						lastPage !== currentPage
						&&
						<div style={{
							'width': '100%',
							'height': '70px',
							'textAlign': 'center'
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