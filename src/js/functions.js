// Based on http://yonaba.github.io/2012/08/14/List-your-GitHub-projects-using-JavaScript-and-jQuery.md.html

var $=jQuery;

$.githubUser = function(username, gitpart, callback) {
    $.getJSON('https://api.github.com/users/'+username+'/'+gitpart+'?callback=?',callback);
}

$.fn.loadGitInfos = function(username, gitpart) {
    this.html("<span>Querying GitHub for " + username + "'s " + gitpart + "...</span>");

    var target = this;
    $.githubUser(username, gitpart, function(data) {
        var gitparts = data.data; // JSON Parsing
        //sortByName(gitparts);

        var list = $('<dl/>');
        target.empty().append(list);
        $(gitparts).each(function() {
            if (gitpart == 'gists') {
                list.append('<dt><a href="'+ (this.homepage?this.homepage:this.html_url) +'">Gist ID: ' + this.id + '</a></dt>');
            } else {
                list.append('<dt><a href="'+ (this.homepage?this.homepage:this.html_url) +'">' + this.name + '</a> <em>'+(this.language?('('+this.language+')'):'')+'</em></dt>');
            }
            list.append('<dd>' + this.description + '</dd>');
            /*if (gitpart == 'gists') {
                $.each(this.files, function(i, item) {
                    list.append('<em>' + item.filename + '</em>');
                });
            }*/
        });
    });

    function sortByName(gitparts) {
        gitparts.sort(function(a,b) {
            return a.name - b.name;
        });
    }
};

$(document).ready(function($) {
	$('html').removeClass('no-js').addClass('js-active');

    $("#github-repos").loadGitInfos('goYippi-labs', 'repos');
    $("#github-gists").loadGitInfos('Christian-Roth', 'gists');
});
