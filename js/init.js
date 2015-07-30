// To be able to pass an array of promises
if (jQuery.when.all === undefined) {
    jQuery.when.all = function (deferreds) {
        var deferred = new jQuery.Deferred();
        $.when.apply(jQuery, deferreds).then(
            function () {
                deferred.resolve(Array.prototype.slice.call(arguments));
            },
            function () {
                deferred.fail(Array.prototype.slice.call(arguments));
            });

        return deferred;
    }
}

var loadingPannel;
loadingPannel = loadingPannel || (function () {
    var lpDialog = $("" +
    "<div class='modal' id='lpDialog' data-backdrop='static' data-keyboard='false'>" +
    "<div class='modal-dialog' >" +
    "<div class='modal-content'>" +
    "<div class='modal-header'><b>Loading...</b></div>" +
    "<div class='modal-body'>" +
    "<div class='progress'>" +
    "<div class='progress-bar progress-bar-striped active' role='progressbar' aria-valuenow='100' aria-valuemin='100' aria-valuemax='100' style='width:100%'> " +
    "Please Wait..." +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>");
    return {
        show: function () {
            lpDialog.modal('show');
        },
        hide: function () {
            lpDialog.modal('hide');
        }
    };
})();

function send_dots(attr, value) {
    //var data = {};
    //attr=attr.replace('[','%5B').replace(']','%5D');
    //data[attr] = value;

    var data = new FormData();
    data.append('name', attr);
    data.append('value', value);
    $.ajax({
        url: '/api/save/',
        type: 'post',
        data: data,
        contentType: false,
        processData: false,
        type: 'POST',
        success: function (data) {
            console.info(data);
        },
        error: function (data) {
            alert("Error saving " + attr + "!");
        }
    });
}

function create_dots(main_container, name, el_class, caption) {
    el_class = el_class || 'attr';
    //name near the select
    if (caption != undefined && caption != '') {
        var div1 = $('<div>' + caption + '</div>');
        div1.attr('class', el_class);
        main_container.append(div1);
    }
    var select = $('<select><option value=""></option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select>');
    var div2 = $('<div></div>');
    div2.attr('class', el_class + '_value');
    div2.append(select);

    div2.find('select').barrating('show', {
        wrapperClass: 'br-wrapper-f',
        showSelectedRating: false,
        onSelect: function (value, text) {
            send_dots(name, value);
        }
    })
        .attr('name', name);
    main_container.append(div2);
}

function set_data(list, el_class, main_container, complete) {
    var data = {};
    //function get_data(deferred, path) {
    //}
    var deferreds = [];
    $.each(list, function (i, path) {
        var deferred = new $.Deferred();
        deferreds.push(deferred);
        //get_data(deferred, item);

        var jqxhr = $.get("get/" + path)
            .success(function (res) {
                data[path] = res;
            })
            .error(function () {
                alert("Error getting " + path + "!");
            })
            .complete(function () {
                deferred.resolve();
            });
    });
    $.when.all(deferreds).then(function () {
        $.each(data[list[0]], function (i) {//only take item index. could be a simple loop
            $.each(list, function (index, arr) {
                var item = data[arr][i];
                //var id = item.replace(/ /g, '_');
                $(main_container).append(create_dots($(main_container), item, el_class, item));
            });
        })
        complete.resolve();
    })
}


$(document).ready(function () {
    load_all();
});

function load_numina(complete) {
    var sp = $('<span></span>');
    sp.attr('data-title', 'Select numina')
        .attr('data-type', 'select')
        .attr('data-pk', '1')
        .attr('data-prepend', 'None')
        .attr('data-emptytext', 'None')
        .attr('data-emptyclass', '')
        .attr('data-source', 'get/advantages/numina.json');
    var div = $('<div></div>');
    div.attr('class', 'numina_name');
    div.append(sp);
    for (i = 0; i < 6; i++) {
        var div2 = div.clone();
        div2.find('span')
            .attr('data-name', 'numina_name[' + i + ']')
            .editable();
        $('.numina').append(div2);
        create_dots($('.numina'), 'numina_value[' + i + ']', 'numina');
    }
    complete.resolve();
}

function load_backgrounds(complete) {
    var sp = $('<span></span>');
    sp.attr('data-title', 'Select background')
        .attr('data-type', 'select')
        .attr('data-pk', '1')
        .attr('data-prepend', 'None')
        .attr('data-emptytext', 'None')
        .attr('data-emptyclass', '')
        .attr('data-source', 'get/advantages/backgrounds.json');

    var div = $('<div></div>');
    div.attr('class', 'background_name');
    div.append(sp);
    for (i = 0; i < 6; i++) {
        var div2 = div.clone();
        div2.find('span')
            .attr('data-name', 'background_name[' + i + ']')
            .editable();

        $('.backgrounds').append(div2);
        create_dots($('.backgrounds'), 'background_value[' + i + ']', 'background');
    }
    complete.resolve();
}

function set_traits(secondary, complete) {
    var sp = $('<span></span>');
    sp.attr('data-title', 'Select trait')
        .attr('data-type', 'select')
        .attr('data-pk', '1')
        .attr('data-prepend', 'None')
        .attr('data-emptytext', 'None')
        .attr('data-emptyclass', '');
    var div = $('<div></div>');
    div.attr('class', 'trait_name');
    div.append(sp);
    for (i = 0; i < 12; i++) {
        var div2 = div.clone();
        div2.find('span')
            .attr('data-name', 'trait_name[' + i + ']')
            .editable({'source': secondary});
        $('.other_traits').append(div2);
        create_dots($('.other_traits'), 'trait_value[' + i + ']', 'trait');
    }
    complete.resolve();
}
function load_traits(complete) {
    var list = ['secondary/talents.json', 'secondary/skills.json', 'secondary/knowledges.json'];
    var data = {};
    //function get_data(deferred, path) {
    //}
    var deferreds = [];
    $.each(list, function (i, path) {
        var deferred = new $.Deferred();
        deferreds.push(deferred);
        //get_data(deferred, item);

        var jqxhr = $.get("get/" + path)
            .success(function (res) {
                data[path] = res;
            })
            .error(function () {
                alert("Error getting " + path + "!");
            })
            .complete(function () {
                deferred.resolve();
            });
    });
    $.when.all(deferreds).then(function () {
        var res = [];
        $.each(list, function (index, arr) {
            res.push({text: '---'});
            $.each(data[list[index]], function (i) { //only take item index. could be a simple loop
                var item = data[arr][i];
                res.push({text: item, value: item})
                //console.log(item);
            });
        });
        return res;
    }).then(function (res) {
        //console.log(res);
        //return res;
        set_traits(res, complete);
    })

}
function load_all() {
    loadingPannel.show();
    var deferreds = [];
    //set abilities
    var a = new $.Deferred();
    deferreds.push(a);
    set_data(['abilities/talents.json', 'abilities/skills.json', 'abilities/knowledges.json'], 'abl', '.abilities', a);
    //set attributes
    a = new $.Deferred();
    deferreds.push(a);
    set_data(['attributes/physical.json', 'attributes/social.json', 'attributes/mental.json'], 'attr', '.attributes', a);
    //set virtues
    a = new $.Deferred();
    deferreds.push(a);
    set_data(['advantages/virtues.json'], 'virtue', '.virtues', a);

    a = new $.Deferred();
    deferreds.push(a);
    load_numina(a);


    a = new $.Deferred();
    deferreds.push(a);
    load_backgrounds(a);


    a = new $.Deferred();
    deferreds.push(a);
    load_traits(a);

    $('select[name="Humanity"]').barrating('show', {
        wrapperClass: 'br-wrapper-f',
        showSelectedRating: false,
        onSelect: function (value, text) {
            send_dots('Humanity', value);
        }
    });


    $('select[name="Willpower"]').barrating('show', {
        wrapperClass: 'br-wrapper-f',
        showSelectedRating: false,
        onSelect: function (value, text) {
            send_dots('Willpower', value);
        }
    });

    $('select[name="Willpower_current"]').barrating('show', {
        wrapperClass: 'br-wrapper-f2',
        showSelectedRating: false,
        onSelect: function (value, text) {
            send_dots('Willpower_current', value);
        }
    });

    //when all settings are loaded, we load charsheet data:
    $.when.all(deferreds).then(function () {
        load_saved();
        loadingPannel.hide();
    });
}
function load_saved() {
    var jqxhr = $.get("/api/load")
        .success(function (data) {
            $.each(data, function (index, val) {
                //console.log(index);
                //console.log(val);
                //load editables

                var a = $('span[data-name="' + index + '"]');
                if (a != undefined && val) {
                    a.editable('setValue', val);
                }
                // a.attr('value',val)
                //try to set dots
                a = $('select[name="' + index + '"]');
                //console.log(a);

                //if (!a.is('select')) {
                //    $.error('select is not select!');
                //}
                if (a != undefined) {
                    //console.log('setting dots: ' + index + ' = ' + val);
                    a.barrating('set', val);
                }
            })
        }
    )

}