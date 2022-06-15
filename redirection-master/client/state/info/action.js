/**
 * Internal dependencies
 */
import {
	INFO_LOADING,
	INFO_LOADED_GEO,
	INFO_LOADED_AGENT,
	INFO_LOADED_HTTP,
	INFO_CLEAR_HTTP,
	INFO_FAILED,
} from './type';
import { RedirectLiApi } from 'lib/api-request';
import apiFetch from 'wp-plugin-lib/api-fetch';

export const getMap = ip => ( dispatch, getState ) => {
	const { maps } = getState().info;

	if ( maps[ ip ] ) {
		return;
	}

	apiFetch( RedirectLiApi.ip.getGeo( ip ) )
		.then( map => {
			dispatch( { type: INFO_LOADED_GEO, map } );
		} )
		.catch( error => {
			dispatch( { type: INFO_FAILED, error } );
		} );

	return dispatch( { type: INFO_LOADING } );
};

export const getAgent = ua => ( dispatch, getState ) => {
	const { agents } = getState().info;

	if ( agents[ ua ] ) {
		return;
	}

	apiFetch( RedirectLiApi.agent.get( ua ) )
		.then( agent => {
			dispatch( { type: INFO_LOADED_AGENT, agent } );
		} )
		.catch( error => {
			dispatch( { type: INFO_FAILED, error } );
		} );

	return dispatch( { type: INFO_LOADING } );
};

export const getHttp = url => dispatch => {
	apiFetch( RedirectLiApi.http.get( url ) )
		.then( http => {
			dispatch( { type: INFO_LOADED_HTTP, http } );
		} )
		.catch( error => {
			dispatch( { type: INFO_FAILED, error } );
		} );

	return dispatch( { type: INFO_LOADING } );
};

export const clearHttp = () => ( { type: INFO_CLEAR_HTTP } );
