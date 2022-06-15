/**
 * External dependencies
 */

import React from 'react';
import { translate as __ } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import { MultiOptionDropdown } from 'wp-plugin-components';

const HeaderMultiChoice = ( { headerValue, options, onChange } ) => {
	const { choices, implode, wildCard } = options;
	const selected = headerValue.split( implode );
	const applyItem = ( items, added ) => {
		if ( added === wildCard ) {
			onChange( { headerValue: selected.length === 1 && selected[ 0 ] === wildCard ? '' : wildCard } );
		} else {
			onChange( { headerValue: items.filter( item => item !== wildCard ).filter( item => item ).join( implode ) } );
		}
	};

	return (
		<MultiOptionDropdown
			options={ wildCard ? choices.concat( [ { value: wildCard, label: __( 'All' ) } ] ) : choices }
			selected={ selected }
			onApply={ applyItem }
			title={ __( 'Values' ) }
			hideTitle
			multiple
			badges
		/>
	);
};

export default HeaderMultiChoice;
