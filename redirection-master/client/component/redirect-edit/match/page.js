/**
 * External dependencies
 */

import React from 'react';
import { translate as __ } from 'i18n-calypso';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */

import TableRow from '../table-row';

const MatchPage = () => {
	return (
		<TableRow title={ __( 'Page Type' ) } className="redirect-edit__match">
			<p>
				{ __( 'Only the 404 page type is currently supported.' ) }&nbsp;
				{ __( 'Please do not try and redirect all your 404s - this is not a good thing to do.' ) }
			</p>
		</TableRow>
	);
};

MatchPage.propTypes = {
	data: PropTypes.object.isRequired,
	onChange: PropTypes.func.isRequired,
};

export default MatchPage;
