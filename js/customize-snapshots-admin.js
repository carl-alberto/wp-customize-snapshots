/* global jQuery */
/* exported CustomizeSnapshotsAdmin */
var CustomizeSnapshotsAdmin = (function( $ ) {
	'use strict';
	var component = {};

	/**
	 * Initialize component.
	 *
	 * @return {void}
	 */
	component.init = function() {
		$( function() {
			component.deleteSetting();
			component.conflict_setting();
		} );
	};

	/**
	 * Handles snapshot setting delete actions.
	 *
	 * @return {void}
	 */
	component.deleteSetting = function() {
		var $linkToRemoveOrRestore = $( '.snapshot-toggle-setting-removal' ),
			linkActions = ['remove', 'restore'],
			dataSlug = 'cs-action',
			inputName = 'customize_snapshot_remove_settings[]';

		$linkToRemoveOrRestore.data( dataSlug, linkActions[0] );

		component.isLinkSetToRemoveSetting = function( $link ) {
			return linkActions[ 0 ] === component.getClickedLinkAction( $link );
		};

		component.isLinkSetToRestoreSetting = function( $link ) {
			return linkActions[ 1 ] === component.getClickedLinkAction( $link );
		};

		component.getClickedLinkAction = function( $link ) {
			return $link.data( dataSlug );
		};

		component.hideSettingAndChangeLinkText = function( $link ) {
			var $settingDisplay, settingId;
			$settingDisplay = component.getSettingDisplay( $link );
			settingId = component.getSettingId( $link );

			$link.data( dataSlug, linkActions[ 1 ] )
				.after( component.constructHiddenInputWithValue( settingId ) );
			component.changeLinkText( $link );
			$settingDisplay.removeAttr( 'open' )
				.addClass( 'snapshot-setting-removed' );
		};

		component.getSettingDisplay = function( $link ) {
			return $link.parents( 'details' );
		};

		component.getSettingId = function( $link ) {
			return $link.attr( 'id' );
		};

		component.constructHiddenInputWithValue = function( settingId ) {
			return $( '<input>' ).attr( {
				'name': inputName,
				'type': 'hidden'
			} )
				.val( settingId );
		};

		component.changeLinkText = function( $link ) {
			var oldLinkText, newLinkText;
			oldLinkText = $link.text();
			newLinkText = $link.data( 'text-restore' );

			$link.data( 'text-restore', oldLinkText )
				.text( newLinkText );
		};

		component.showSettingAndChangeLinkText = function( $link ) {
			var $settingDisplay, settingId;
			$settingDisplay = component.getSettingDisplay( $link );
			settingId = component.getSettingId( $link );

			$link.data( dataSlug, linkActions[ 0 ] );
			component.changeLinkText( $link );
			component.removeHiddenInputWithValue( settingId );
			$settingDisplay.removeClass( 'snapshot-setting-removed' );
		};

		component.removeHiddenInputWithValue = function( settingId ) {
			$( 'input[name="' + inputName + '"][value="' + settingId + '"]' ).remove();
		};

		$linkToRemoveOrRestore.on( 'click', function( event ) {
			var $clickedLink = $( this );

			event.preventDefault();

			if ( component.isLinkSetToRemoveSetting( $clickedLink ) ) {
				component.hideSettingAndChangeLinkText( $clickedLink );
			} else if ( component.isLinkSetToRestoreSetting( $clickedLink ) ) {
				component.showSettingAndChangeLinkText( $clickedLink );
			}
		} );
	};

	/**
	 * Change setting value on change of conflict setting.
	 *
	 * @return {void}
	 */
	component.conflict_setting = function() {
		$( 'input.snapshot-resolved-settings' ).change( function() {
			var $this = $( this ),
				selector = '#' + $this.data( 'settingValueSelector' );
			$( selector ).html( $this.parents( 'details' ).find( '.snapshot-conflict-setting-data' ).html() );
		} );
	};
	return component;
} )( jQuery );
