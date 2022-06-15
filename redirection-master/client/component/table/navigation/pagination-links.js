/**
 * External dependencies
 */

import React, { useEffect, useState } from 'react';
import { translate as __, numberFormat } from 'i18n-calypso';

/**
 * Internal dependencies
 */

import NavigationButton from './navigation-button';

/**
 * @param {number} total
 * @param {number} perPage
 */
function getTotalPages( total, perPage ) {
	return Math.ceil( total / perPage );
}

function PaginationLinks( props ) {
	const { page, total, perPage, onChangePage } = props;
	const [ currentPage, setPage ] = useState( page + 1 );
	const max = getTotalPages( total, perPage );
	const onePage = total <= perPage;

	useEffect( () => {
		setPage( page + 1 );
	}, [ page ] );

	if ( onePage ) {
		return null;
	}

	return (
		<>
			<NavigationButton
				title={ __( 'First page' ) }
				button="«"
				className="first-page"
				disabled={ page <= 0 }
				onClick={ () => onChangePage( 0 ) }
			/>

			<NavigationButton
				title={ __( 'Prev page' ) }
				button="‹"
				className="prev-page"
				disabled={ page <= 0 }
				onClick={ () => onChangePage( page - 1 ) }
			/>
			<span className="paging-input">
				<label htmlFor="current-page-selector" className="screen-reader-text">
					{ __( 'Current Page' ) }
				</label>

				<input
					className="current-page"
					type="number"
					min="1"
					max={ max }
					name="paged"
					value={ currentPage }
					size={ 2 }
					aria-describedby="table-paging"
					onBlur={ () => onChangePage( Math.min( max - 1, Math.max( 0, currentPage - 1 ) ) ) }
					onChange={ ( ev ) => setPage( ev.target.value ) }
				/>

				<span className="tablenav-paging-text">
					{ __( 'of %(page)s', {
						components: {
							total: <span className="total-pages" />,
						},
						args: {
							page: numberFormat( max, 0 ),
						},
					} ) }
				</span>
			</span>

			<NavigationButton
				title={ __( 'Next page' ) }
				button="›"
				className="next-page"
				disabled={ page >= max - 1 }
				onClick={ () => onChangePage( page + 1 ) }
			/>

			<NavigationButton
				title={ __( 'Last page' ) }
				button="»"
				className="last-page"
				disabled={ page >= max - 1 }
				onClick={ () => onChangePage( max - 1 ) }
			/>
		</>
	);
}

export default PaginationLinks;
