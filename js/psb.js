var submissionSearch = "https://www.reddit.com/r/photoshopbattles.json?sort=hot&t=week&limit=50";

// Initialize Page
$('document').ready(function(){

	$('#content').append('<div id="loading"></div>');

	// Hide everything except the header and footer
	$('#content').hide();


	// Populate Submission Nav
	$.getJSON(submissionSearch, function(json) {
		loadSubmissionNav(json, true);
	});

	// Show everything
	$('#loading').fadeOut('slow');
	$('#loading').remove();
	$('#content').show();


	return;

});





/* -------------------- Load Objects -------------------- */

// Load submission nav
function loadSubmissionNav(json, pageLoad) {

	// Empty contents
	$('#submission-nav').fadeOut('slow');
	$('#submission-nav').hide();
	$('#submission-nav').empty();

	try {

		var submissions = '';
		var oddEven = 'odd';

		// Only load the top submission as the base
		var baseLoaded = false;

		// Loop through submissions and add them to the page
		for (var i = 0; i < json.data.children.length; i++) {

			var post = json.data.children[i].data;

			var id = post.id;
			var thingId = post.name;
			var url = post.url;
			var author = post.author;
			var title = post.title;
			var permalink = "https://www.reddit.com" + post.permalink;
			var score = post.score;
			var created = new Date(post.created_utc * 1000).toLocaleString();
			var selfPost = post.is_self;

			var submission = generateSubmissionSelector(id, thingId, url, author, title, permalink, score, created);

			// Handle links
			if (!selfPost) {
				
				if (oddEven == 'odd') {

					oddEven = 'even';
					submissions = submissions + submission;

				} else {

					oddEven = 'odd';
					submissions = submissions + submission;

				}

			}
			// Handle self posts
			//else {

				//

			//}


			// Load the top link submission as base
			//if (!selfPost && pageLoad && !baseLoaded) {

				//loadSubmission(id, thingId, url, author, title, permalink, score, created);
				//baseLoaded = true;

			//}

		}

		//if (oddEven == 'odd') {
			//submissions = submissions + '</div>';
		//}

		$('#submission-nav').append(submissions);

	}
	catch(err) {
		console.log(err.message);
	}

	
	$('#submission-nav').fadeIn('slow');


	return;

}


// Format submission navigation selector
var generateSubmissionSelector = function(id, thingId, url, author, title, permalink, score, created) {

	var selector = '<div class="submission-selector" id="' + id;
	selector = selector + '"><div class="submission-selector-thumb" style="background-image:url(\'' + url;
	selector = selector + '\');"><div class="submission-selector-details" id="' + id;
	selector = selector + '" thingId="' + thingId;
	selector = selector + '" baseurl="' + url;
	selector = selector + '" author="' + author;
	selector = selector + '" title="' + title;
	selector = selector + '" perm="' + permalink;
	selector = selector + '" score="' + score;
	selector = selector + '" created="' + created;
	selector = selector + '">' + title + '</div></div></div>';


	return selector;

}

// Format base image pane
function loadSubmission(id, thingId, url, author, title, permalink, score, created) {

	// Empty contents
	$('#base').fadeOut('slow');
	$('#base').empty();

	var base = '<div id="nav-display"></div><a href="' + url;
	base = base + '" target="_blank"><div id="base-image" style="background-image: url(\'' + url;
	base = base + '\');"></div></a><div id="base-details"><div id="base-title">' + title;
	base = base + '</div><div id="base-vote">' + generateVoteWidget(permalink, thingId, score);
	base = base + '</div><div id="base-author"><a href="https://www.reddit.com/user/' + author;
	base = base + '" target="_blank">by ' + author;
	base = base + '</a></div><div id="base-date">' + created + '</div></div>';

	$('#base').append(base);

	// Un-highlight previously selected submission
	$('.submission-selector').each(function(index, value) {

		if ($(this).hasClass('selected')) {

			$(this).removeClass('selected');

			var submissionDetails = $(this).find('.submission-selector-details');

			$(submissionDetails).each(function(index, value) {
			
				if ($(submissionDetails[index]).hasClass('selected')) {

					$(submissionDetails[index]).removeClass('selected');

				}
			
			});

		}

	});

	// Highlight selected submission in submission nav
	$('#' + id + ' > .submission-selector-details').each(function(index, value) {

		$(this).addClass('selected');

	});
	$('#' + id).addClass('selected');

	loadComments(id);

	$('#base').fadeIn('slow');


	return;

}

// Retrieve and format comments for a submission
function loadComments(id) {

	$('#comments').fadeOut('slow');
	$('#comments').empty();

	$.getJSON("https://www.reddit.com/r/photoshopbattles/comments/" + id + ".json?sort=hot&limit=None", function(json) {

		var submissionPermalink = "https://www.reddit.com" + json[0].data.children[0].data.permalink;

		var comments = '';
		var oddEven = 'odd';

		for (var i = 0; i < json[1].data.children.length; i++) {

			var commentData = json[1].data.children[i].data;

			var comment = generateComment(commentData, submissionPermalink, 'top', oddEven, '');

			if (comment != '') {

				comments = comments + comment;
			
				if (oddEven == 'odd') {
					oddEven = 'even';
				} else {
					oddEven = 'odd';
				}

			}

		}

		$('#comments').append(comments);

	});

	$('#comments').fadeIn('slow');


	return;

}


var generateComment = function(commentData, submissionPermalink, top, oddEven, expanded) {

	var id = commentData.id;
	var thingId = commentData.name;
	var author = commentData.author;
	var flair = commentData.author_flair_css_class;
	var permalink = "https://www.reddit.com" + submissionPermalink + commentData.id;
	var score = commentData.score;
	var created = new Date(commentData.created_utc * 1000).toLocaleString();
	var body_html = commentData.body_html;
	var body = htmlDecode(body_html);
	var removed = false;

	// Removals and errors
	if (typeof commentData.body == 'undefined') {
		return '';
	}
	if (commentData.body == '[removed]') {
		removed = true;
	}
	
	var comment = '<div id="' + id;
	comment = comment + '" class="comment ' + top + ' ' + oddEven + ' ' + expanded;
	if (removed) { comment = comment + ' removed'; }
	comment = comment + '"><div class="comment-container"><div class="comment-details"><div class="expand ' + expanded;
	comment = comment + '"></div>' + generateVoteWidget(permalink, thingId, score);
	comment = comment + '<div class="comment-author"><a href="https://www.reddit.com/user/' + author;
	comment = comment + '" target="_blank">by /u/' + author;
	comment = comment + '</a></div><div class="comment-date">' + created;
	comment = comment + '</div></div><div class="comment-text">' + body + '</div></div>';


	var children = '<div class="children">';

	if (commentData.replies != '' && typeof commentData.replies != 'undefined') {

		if (oddEven == 'odd') {
			oddEven = 'even';
		} else {
			oddEven = 'odd';
		}

		// Recurse through comment replies and append
		for (var i = 0; i < commentData.replies.data.children.length; i++) {

			try {

				var childComment = commentData.replies.data.children[i].data;

				expanded = commentInitialExpandState(childComment);
				
				var child = generateComment(childComment, submissionPermalink, 'child', oddEven, expanded);
			
				if (child != '') {

					children = children + child;

				}

			}
			catch(err) {
				console.log(err.message);
			}

		}

	}

	
	comment = comment + children + '</div></div>';

	
	return comment;

}



var generateVoteWidget = function(permalink, thingId, score) {

	var voteWidget = '<div class="vote"><div class="vote-inner"><a href="' + permalink;
	voteWidget = voteWidget + '" target="_blank"><div class="vote-link"></div></a><div class="vote-up" thingId="' + thingId;
	voteWidget = voteWidget + '"></div><div class="vote-down" thingId="' + thingId;
	voteWidget = voteWidget + '"></div><div class="vote-score">' + score + '</div></div></div>';


	return voteWidget;

}





/* -------------------- Event Handlers -------------------- */

// Attach master click event handler
$(document).off("click", "div").on("click", function(event) {


	var clickedElement = $(event.target);

	if ($(clickedElement).hasClass('expand')) {

		expandCollapse(event);

	} else if ($(clickedElement).hasClass('submission-selector-thumb')) {
		
		$('#submission-nav').fadeOut('slow');

		navClick(event);

		$('#base').fadeIn('slow');

	} else if ($(clickedElement).hasClass('vote-down') || $(clickedElement).hasClass('vote-up')) {

		castVote(event);

	} else if ($(clickedElement).attr('id') == 'nav-display') {

		$('#base').fadeOut('slow');
		$('#submission-nav').fadeIn('slow');

	}

	
	return;

});


// Handles click event to expand or collapse a comment
function expandCollapse(event) {

	try {

		var expandDiv = $(event.target);
	
		if ($(expandDiv).hasClass('collapsed')) {

			$(expandDiv).removeClass('collapsed');

			var details = $(expandDiv).parent();
			var parentContainer = $(details).parent();
			var parentComment = $(parentContainer).parent();
			$(parentComment).removeClass('collapsed');

		} else {

			$(expandDiv).addClass('collapsed');

			var details = $(expandDiv).parent();
			var parentContainer = $(details).parent();
			var parentComment = $(parentContainer).parent();
			$(parentComment).addClass('collapsed');

		}

	}
	catch(err) {
		console.log(err.message);
	}


	return;

}


// Handles click event on submission nav to load submission
function navClick(event) {

	try {

		var selectedSubmission = $(event.target);
		var submissionDetails = $(selectedSubmission).children(':first');

		if ($(submissionDetails).hasClass('selected')) {

			return;

		} else {

			var id = $(submissionDetails).attr('id');
			var thingId = $(submissionDetails).attr('thingid');
			var url = $(submissionDetails).attr('baseurl');
			var author = $(submissionDetails).attr('author');
			var title = $(submissionDetails).attr('title');
			var permalink = $(submissionDetails).attr('perm');
			var score = $(submissionDetails).attr('score');
			var created = $(submissionDetails).attr('created');
			console.log(id + ' ' + thingId + ' ' + url + ' ' + author + ' ' + title + ' ' + permalink + ' ' + score + ' ' + created);

			loadSubmission(id, thingId, url, author, title, permalink, score, created);

		}

	}
	catch(err) {
		console.log(err.message);
	}


	return;

}



// Handles voting
function castVote(event) {

	// Check if user is authenticated
	//if () {

		//

	//}

	try {

		var voteButton = $(event.target);
		var thingId = voteButton.attr('thingId');
		var voteDirection = 0;
		
		// Change css class and get vote value

		// No vote
		if ($(voteButton).hasClass('voted')) {

			voteDirection = 0;

			$(voteButton).removeClass('voted');

		} else {

			
			$(voteButton).addClass('voted');

			// Up vote
			if ($(voteButton).hasClass('vote-up')) {

				voteDirection = 1;

				var downVote = $(voteButton).next();
				$(downVote).removeClass('voted');

			}
			// Down vote
			else {

				voteDirection = -1;

				var upVote = $(voteButton).prev();
				$(upVote).removeClass('voted');

			}

		}

		var voteUrl = '' + voteDirection;
		//cast

	}
	catch(err) {
		console.log(err.message);
	}


	return;

}







/* -------------------- Helper Functions -------------------- */

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

// Convert HTML special characters to HTML
var htmlDecode = function(html) {

	var htmlElement = document.createElement("div");
	htmlElement.innerHTML = html;
	var raw = htmlElement.innerText.toString();
	$(htmlElement).remove();

	raw = raw.replace('<a href=', '<a target="_blank" href=');
	raw = raw.replace('<a href="/r/', '<a target="_blank" href="https://www.reddit.com/r/');
	raw = raw.replace('<a href="/u/', '<a target="_blank" href="https://www.reddit.com/u/');
	raw = raw.replace('<a href="/user/', '<a target="_blank" href="https://www.reddit.com/user/');
	raw = raw.replace('<p>', ' ');
	raw = raw.replace('</p>', '<br/>');


	return raw;

}

// Determine whether to initially expand the comment or any child comments based on whether there is an image in the comment or children
var commentInitialExpandState = function(commentData) {
	
	try {

		// Check the comment for a link
		if (htmlDecode(commentData.body_html).indexOf('<a href="') > -1) {

			return '';

		}

		// Check the replies for a link via recursion
		if (commentData.replies != '' && typeof commentData.replies != 'undefined') {

			for (var i = 0; i < commentData.replies.data.children.length; i++) {

				var childComment = commentData.replies.data.children[i].data;

				var expandChild = commentInitialExpandState(childComment);
				
				if (expandChild == '') {

					return '';

				}

			}

		}

	}

	catch(err) {
		console.log(err.message);
	}


	return 'collapsed';

}
