function load_revisions() {

    var jqxhr = $.get("/api/get_revisions")
        .success(function (data) {
            var t = $('.revisions tbody');
            t.empty();//clean
            var i = 1;
            $.each(data, function (index, arr) {
                if(arr.id==undefined)
                    arr.id=0;
                var r = $('<tr></tr>');
                r.append('<td>' + i + '</td><td>' + arr.nick + '</td><td>' + arr.made + '</td><td>' + arr.comment + '</td>');
                r.append('<td><input type="radio" name="compare_from" value="' + arr.id + '"></td><td><input type="radio" name="compare_to" value="' + arr.id + '"></td>');
                r.append('<td><button type="button" class="btn btn-default" data-dismiss="modal" onclick="view_revision(' + arr.id + ')">View</button></td>');
                if (arr.id != 0)//not current
                {
                    r.append('<td><button type="button" class="btn btn-default" data-dismiss="modal" onclick="restore_revision(' + arr.id + ')">Restore</button></td>');
                }
                else
                    r.append('<td></td>');
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
function compare_revisions() {
    var compare_from = "";
    var compare_to = "";
    var selected = $("input[type='radio'][name='compare_from']:checked");
    if (selected.length > 0) {
        compare_from = selected.val();
    }

    selected = $("input[type='radio'][name='compare_to']:checked");
    if (selected.length > 0) {
        compare_to = selected.val();
    }
    //console.log('comparing ' + compare_from + ' to ' + compare_to);

    var data = {compare_from: compare_from,compare_to: compare_to};
    $.ajax({
        url: '/api/compare_revisions',
        type: 'post',
        data: data,
        type: 'POST',
        success: function (data) {
            if (data.error) {
                ErrorPannel.show('Please correct your input:<p>' + data.error + '</p>');
            }
            else {
                $('.compare_revisions').html(data.diff);
            }
        },
        error: function (data) {
            ErrorPannel.show("Error comparing revisions, error: " + data + "");
        }
    });
}
function restore_revision(revision_id) {
    var data = {revision_id: revision_id};
    $.ajax({
        url: '/api/restore_revision',
        type: 'post',
        data: data,
        type: 'POST',
        success: function (data) {
            if (data.error) {
                ErrorPannel.show('Please correct your input:<p>' + data.error + '</p>');
            }
            else {
                view_revision(0);
            }
        },
        error: function (data) {
            ErrorPannel.show("Error restoring revision, error: " + data + "");
        }
    });
}
function view_revision(id) {
    var pathname = window.location.pathname;
    var path = pathname.split('/');
    //alert (path.length);//4 for main
    if (id == 0) {
        window.location.replace('/' + path[1] + '/' + path[2] + '/' + path[3] + '/');
        return;
    }
    var revision = '/' + path[1] + '/' + path[2] + '/' + path[3] + '/' + id + '/';
    //console.log(revision);
    window.location.replace(revision);
}

$(document).ready(function () {
    load_revisions();
});

function save_revision() {
    var comment = $('input[name="revision_comment"]').val();
    if (comment == undefined || comment == "") {
        ErrorPannel.show('Please enter comment text');
        return;
    }
    var data = {comment: comment};
    $.ajax({
        url: '/api/add_revision',
        type: 'post',
        data: data,
        type: 'POST',
        success: function (data) {
            if (data.error) {
                ErrorPannel.show('Please correct your input:<p>' + data.error + '</p>');
            }
            else {
                load_revisions();
            }
        },
        error: function (data) {
            ErrorPannel.show("Error saving revision, error: " + data + "");
        }
    });
}