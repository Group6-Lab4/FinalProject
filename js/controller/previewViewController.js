/* 
 * @author Gigi
 * @desc this is the controller for PreviewView
 */

var PreviewViewController = function(view, model) {



    $(view.thumbnailContainer).on("click", ".page_thumbnail, .btn-xs", function() {
//		alert("click thumbnail"+$(this).attr("pb-idx"));
        var pageIdx;
        if ($(this).hasClass("btn-xs")) {
            pageIdx = $(this).parent().attr("pb-idx");
            
            //click on Set cover button
//            alert("pageIdx"+ pageIdx);
            model.setCoverPage(pageIdx);
            
            //update cover thumbnail
            view.updateThumbnail(0);

        } else {
            //click on thumbnail
            pageIdx = $(this).attr("pb-idx");

            view.loadStoryPage(pageIdx);
        }

    });



};

