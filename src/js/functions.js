var $=jQuery;

$.fn.loadGitInfos = function(username, gitpart, items) {
    //Credit: http://yonaba.github.io/2012/08/14/List-your-GitHub-projects-using-JavaScript-and-jQuery.md.html
    items = items || 3;

    var goyippi_user = new Gh3.User(username);

    if (gitpart == 'gists') {
        var profil_url = 'https://gist.github.com/' + username;
        var goyippi_gitinfo = new Gh3.Gists(goyippi_user);
    } else {
        var profil_url = 'https://github.com/' + username;
        var goyippi_gitinfo = new Gh3.Repositories(goyippi_user);
    }

    this.html("<p class='ie-hidden'>Querying GitHub for " + username + "'s " + gitpart + "...</p>");

    var target = this;
    var list = $('<dl/>');
    target.empty().append(list);

    goyippi_gitinfo.fetch({page:1, per_page:items, direction : "desc"}, "next", function (err, res) {
        if(err) { throw "outch ..." }

        if (gitpart == 'gists') {
            goyippi_gitinfo.eachGist(function (gist) {
                list.append('<dt><a href="'+ gist.html_url +'">Gist ID: ' + gist.id + '</a></dt>');
                list.append('<dd>' + gist.description + '</dd>');
            });
        } else {
            goyippi_gitinfo.eachRepository(function(repos) {
                var repo = new Gh3.Repository(repos.name, goyippi_user);

                repo.fetch(function (err, res) {
                    if(err) { throw "outch ..." }

                    list.append('<dt><a href="'+ (repo.html_url) +'">' + repo.name + '</a>'+(repo.language?(' <em>('+repo.language+')</em>'):'')+'</dt>');
                    list.append('<dd>' + repo.description + '</dd>');
                });
            });
        }
    });
};

$.fn.loadBlog = function(url, items) {
    //Credit: http://stackoverflow.com/questions/10943544/how-to-parse-an-rss-feed-using-javascript
    items = items || 3;

    this.html("<p class='ie-hidden'>Querying goYippi Blog for " + url + "...</p>");

    var target = this;

    $.ajax(url, {
        accepts:{
            xml:"application/rss+xml"
        },
        dataType:"xml",
        success:function(data) {
            var i = 0;
            var list = $('<dl/>');
            target.empty().append(list);
            $(data).find("item").each(function () {
                i++;
                if (i <= items) {
                    list.append('<dt><a href="'+ $(this).find("link").text() +'">' + $(this).find("title").text() + '</a></dt>');
                    list.append('<dd>' + $(this).find("description").text() + '</dd>');
                }
            });
        }
    });
}

$(document).ready(function($) {
	$('html').removeClass('no-js').addClass('js-active');

    $(".github-feed").each(function() {
        $(this).loadGitInfos($(this).data('username'),$(this).data('type'),$(this).data('items'));
    });

    $(".blog-feed").each(function() {
        $(this).loadBlog($(this).data('url'),$(this).data('items'));
    });
});
