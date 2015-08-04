function remove_image(type) {
    var data = new FormData();
    data.append('image_type', type);
    $.ajax({
        url: "/api/remove_image",
        type: "POST",
        data: data,
        processData: false,
        contentType: false,
        success: function (res) {
            if (res.error) {
                alert("Error removing image!" + res.error);
                return;
            }
            else//default image
                $('img[class="' + type + '"]').attr('src', 'img/' + type + '.jpg');
        },
        error: function (res) {
            alert("Error uploading image!" + res);
        }
    });
}

$("document").ready(function () {

    $("#group_chart").change(function () {
        //alert('changed!');
        readURL(this, 'group_chart');
    });

    $("#character_sketch").change(function () {
        //alert('changed!');
        readURL(this, 'character_sketch');
    });

    function readURL(input, to) {

        if (!(input.files && input.files[0]))
            return;
        var reader = new FileReader();
        var formdata = new FormData();

        /*reader.onload = function (e) {
         $('.' + to).attr('src', e.target.result);
         }*/

        reader.readAsDataURL(input.files[0]);
        formdata.append("images", input.files[0]);
        formdata.append('image_type', to);

        if (!formdata)
            return;
        $.ajax({
            url: "/api/upload_image",
            type: "POST",
            data: formdata,
            processData: false,
            contentType: false,
            success: function (res) {
                if (res.error) {
                    alert("Error uploading image!" + res.error);
                    return;
                }
                else if (res.uri)
                    $('img[class="' + to + '"]').attr('src', res.uri);
            },
            error: function (res) {
                alert("Error uploading image!" + res);
            }
        });


    }


});