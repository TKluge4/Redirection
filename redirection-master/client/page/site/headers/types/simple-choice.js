/**
 * External dependencies
 */

import React from 'react';

/**
 * Internal dependencies
 */
import { Select } from 'wp-plugin-components';

const HeaderSimpleChoice = ( { headerValue, options, onChange } ) => {
	return (
		<Select items={ options } name="headerValue" value={ headerValue } onChange={ ev => onChange( { [ ev.target.name ]: ev.target.value } ) } />
	);
};

export default HeaderSimpleChoice;
