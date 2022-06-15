/**
 * External dependencies
 */

import React from 'react';
import { translate as __ } from 'i18n-calypso';

const getWWW = ( site ) => [
	{
		label: __( "Don't set a preferred domain - {{code}}%(site)s{{/code}}", {
			components: {
				code: <code />,
			},
			args: {
				site,
			},
		} ),
		value: '',
	},
	{
		label: __( 'Remove www from domain - {{code}}%(siteWWW)s{{/code}} ⇒ {{code}}%(site)s{{/code}}', {
			components: {
				code: <code />,
			},
			args: {
				site: site.replace( 'www.', '' ),
				siteWWW: site.replace( 'www.', '' ).replace( '://', '://www.' ),
			},
		} ),
		value: 'nowww',
	},
	{
		label: __( 'Add www to domain - {{code}}%(site)s{{/code}} ⇒ {{code}}%(siteWWW)s{{/code}}', {
			components: {
				code: <code />,
			},
			args: {
				site: site.replace( 'www.', '' ),
				siteWWW: site.replace( 'www.', '' ).replace( '://', '://www.' ),
			},
		} ),
		value: 'www',
	}
];

function showAlert( domain, https, preferred ) {
	if ( https && domain.indexOf( 'https:' ) == -1 ) {
		return true;
	}

	if ( preferred === 'www' && domain.indexOf( 'www.' ) == -1 ) {
		return true;
	}

	if ( preferred === 'nowww' && domain.indexOf( 'www.' ) !== -1 ) {
		return true;
	}

	return false;
}

function getCanonical( domain, https, preferred ) {
	domain = domain.replace( /https?:\/\//, '' );

	if ( preferred === 'www' ) {
		domain = 'www.' + domain.replace( 'www.', '' );
	} else if ( preferred === 'nowww' ) {
		domain = domain.replace( 'www.', '' );
	}

	return ( https ? 'https://' : 'http://' ) + domain;
}

function CanonicalSettings( { https, preferredDomain, siteDomain, onChange } ) {
	const alert = showAlert( siteDomain, https, preferredDomain );
	const changePreferred = ev => {
		onChange( { [ ev.target.name ]: ev.target.value } );
	};
	const changeHttps = ev => {
		onChange( { [ ev.target.name ]: ev.target.checked } );
	};

	return (
		<>
			<h3>{ __( 'Canonical Settings' ) }</h3>
			<p>
				<label>
					<input type="checkbox" name="https" onChange={ changeHttps } checked={ https } />&nbsp;
					{ __( 'Force a redirect from HTTP to HTTPS - {{code}}%(site)s{{/code}} ⇒ {{code}}%(siteHTTPS)s{{/code}}', {
						components: {
							code: <code />,
						},
						args: {
							site: siteDomain.replace( 'https', 'http' ),
							siteHTTPS: siteDomain.replace( 'http:', 'https:' ),
						},
					} ) }
				</label>
			</p>

			{ https && <div className="inline-notice inline-warning">
				<p>{ __( '{{strong}}Warning{{/strong}}: ensure your HTTPS is working before forcing a redirect.', {
					components: {
						strong: <strong />,
					},
				} ) }</p>
			</div> }

			<p>{ __( 'Preferred domain' ) }:</p>
			{ getWWW( siteDomain ).map( ( preferred ) => (
				<p key={ preferred.value }>
					<label>
					<input type="radio" name="preferred_domain" value={ preferred.value } onChange={ changePreferred } checked={ preferred.value === preferredDomain } /> { preferred.label }
					</label>
				</p>
			) ) }

			{ alert && <div className="inline-notice inline-error">
				<p>{ __( 'You should update your site URL to match your canonical settings: {{code}}%(current)s{{/code}} ⇒ {{code}}%(site)s{{/code}}', {
					components: {
						code: <code />,
					},
					args: {
						current: siteDomain,
						site: getCanonical( siteDomain, https, preferredDomain ),
					},
				} ) }</p>
			</div> }
		</>
	);
}

export default CanonicalSettings;
