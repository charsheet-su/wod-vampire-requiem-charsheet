function load_comments()
{

    var jqxhr = $.get("/api/get_comments")
        .success(function (data) {
            var t = $('.comments tbody');
            t.empty();//clean
            var i = 1;
            $.each(data, function (index, arr) {
                var r = $('<tr></tr>');
                r.append('<td>' + i + '</td><td>' + arr.nick + '</td><td>' + arr.added + '</td><td>' + arr.text + '</td>');
                t.append(r);
                i++;
            });
        }
    )
        .error(function () {
            ErrorPannel.show('Error getting comments');
        })
        .complete(function () {
        });
}

$(document).ready(function () {
    load_comments();
});

function add_comment()
{

    var comment = $('input[name="comment"]').val();
    if(comment== undefined || comment=="") {
        ErrorPannel.show('Please enter comment text');
        return;
    }
    var data = {comment: comment};
    $.ajax({
        url: '/api/add_comment',
        type: 'post',
        data: data,
        type: 'POST',
        success: function (data) {
            if (data.error) {
                ErrorPannel.show('Please correct your input:<p>' + data.error + '</p>');
            }
            else {
                load_comments();
            }
        },
        error: function (data) {
            ErrorPannel.show("Error saving sheet, error: " + data + "");
        }
    });
}