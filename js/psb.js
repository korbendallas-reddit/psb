// Initialize Page
$('document').ready(function(){

	// Hide everything except the header and footer
	$('#content').hide();

	// Empty contents
	$('#submission-nav').empty();
	$('#submission-pane').empty();


	// Get hot submissions
	$.getJSON("https://www.reddit.com/r/photoshopbattles.json?sort=hot&t=week&limit=21", function(json) {

		var oddEven = 'odd';

		// Loop through submissions and add them to the page
		for (var i = 2; i < 21; i++) {

			var post = json.data.children[i].data;

			var id = post.id;
			var url = tryConvertUrl(post.url);
			var author = post.author;
			var title = post.title.toUpperCase();
			var permalink = "https://www.reddit.com" + post.permalink;
			var score = post.score;
			var created = new Date(post.created_utc * 1000).toLocaleString();

			var submission = formatSubmissionSelector(id, url, author, title, permalink, score, created, oddEven);

			$('#submission-nav').append(submission);

			
			// Toggle odd/even
			if (oddEven == 'odd') {
				oddEven = 'even';
			} else {
				oddEven = 'odd';
			}


			// Load the top submission
			if (i == 2) {
				// Load base image pane
				var base = formatBase(id, url, author, title, permalink, score, created);

				$('#submission-pane').append(base);
				
				// Load comments
				var comments = loadComments(id);
				$('#submission-pane').append(comments);
			}

		}

	});


	// Show everything
	$('#content').fadeIn("slow");

});


// Format submission navigation selector
var formatSubmissionSelector = function(id, url, author, title, permalink, score, created, oddEven) {

	var selector = '<div class="submission-selector ' + oddEven;
	selector = selector + '" id="' + id;
	selector = selector + '"><div class="submission-selector-thumb" style="background-image:url(\'' + url;
	selector = selector + '\');"></div><div class="submission-selector-details" id="' + id;
	selector = selector + '" baseurl="' + url;
	selector = selector + '" author="' + author;
	selector = selector + '" title="' + title;
	selector = selector + '" perm="' + permalink;
	selector = selector + '" score="' + score;
	selector = selector + '" created="' + created + '"></div></div>';

	return selector;

}

// Format base image pane
var formatBase = function(id, url, author, title, permalink, score, created) {

	var base = '<div id="base"><img id="base-image" src="' + url;
	base = base + '" alt="' + title;
	base = base + '"><div id="base-details"><div id="base-title"><a href="' + permalink;
	base = base + '" target="_blank">' + title;
	base = base + '</a></div><div id="base-score">' + score;
	base = base + '</div><div id="base-author"><a href="https://www.reddit.com/user/' + author;
	base = base + '" target="_blank">by ' + author;
	base = base + '</a></div><div id="base-date">' + created + '</div></div></div>';

	return base;

}

// Retrieve and format comments for a submission
var loadComments = function(id) {

	var comments = '<div id="comments">';
	comments = comments + '</div>';

	return comments;

}

// Fix image urls
var tryConvertUrl = function(url) {

	if (url.indexOf('imgur.com') > 0 || url.indexOf('/gallery/') > 0) {
		if (url.indexOf('gifv') >= 0) {
			if (url.indexOf('i.') === 0) {
				url = url.replace('imgur.com', 'i.imgur.com');
			}
			return url.replace('.gifv', '.gif');
		}
		if (url.indexOf('/a/') > 0 || url.indexOf('/gallery/') > 0) {
			return '';
		}
		return url.replace(/r\/[^ \/]+\/(\w+)/, '$1') + '.jpg';
	}

	return url;

};
