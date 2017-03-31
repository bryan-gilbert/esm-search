'use strict';

angular.module('search').service('SearchService', searchService);

searchService.$inject = [ '$http', '$state', '$rootScope'];
/* @ngInject */
function searchService( $http, $state, $rootScope) {
	var self = this;
	self.searchResults = {};

	return {
		getSearchResults: getSearchResults,
		redirectSearchDocuments: redirectSearchDocuments,
		searchDocuments: searchDocuments
	};

	function getSearchResults () {
		return self.searchResults;
	}

	function redirectSearchDocuments(project, searchText, start, limit, orderBy, collection) {
		console.log("transition to search with searchtext", searchText, start, limit, orderBy);
		$state.go('p.search', {
			projectid: project.code,
			searchText: searchText,
			collection: collection,
			start: start,
			limit: limit,
			orderBy: orderBy
		});
	}

	function searchDocuments(project, searchText, start, limit, orderBy, collection) {
		start = start || 1;
		limit = limit || 10;
		orderBy = orderBy || '';
		collection = collection || 'documents';
		var url =  '/api/search?projectId=' + project._id.toString();
		url += '&searchText=' + searchText;
		url += '&orderBy=' + orderBy;
		url += '&start=' + start;
		url += '&limit=' + limit;
		url += '&collection=' + collection;
		//console.log("The url ", url);

		$http({method: 'GET', url: url})
			.then(function (results) {
				self.searchResults.searchText = searchText;
				self.searchResults.data = results.data.data;
				self.searchResults.count = results.data.count;
				self.searchResults.start = start;
				self.searchResults.limit = limit;
				self.searchResults.orderBy = orderBy;
				$rootScope.$broadcast('search-results-documents');
			});
	}

}
