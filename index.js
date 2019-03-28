(function($) {
  console.log("index.js loaded");

  // write content out to the .content div as append
  function writeContent(content) {
    $(".content").append(`
    ${content}
    `);
  }

  // get the form field value and append the required text to make rest enpoint url
  function getRestUrl() {
    let url_val = $("#url").val();
    url_val += "/wp-json/wp/v2/posts";
    console.log(url_val);
    return url_val;
  }

  // use ajax response and iterate over all returned post object to get title, date, and post
  function iterateResponse(resp) {
    for (let key in resp) {
      let title, date, post;
      for (let o_key in resp[key]) {
        console.log(o_key);
        switch (o_key) {
          case "title":
            title = `<h3>${resp[key][o_key]["rendered"]}</h3>`;
            break;
          case "date":
            date = resp[key][o_key];
            break;
          case "content":
            post = `${resp[key][o_key]["rendered"]} <hr><hr><hr>`;
            break;
        }
      }
      writeContent(title);
      writeContent(date);
      writeContent(post);
    }
  }

  // ajax call to the site to get posts response
  function getAjaxResponse(url_val) {
    let content = $(".content");
    $.ajax({
      url: url_val,
      context: content,
      statusCode: {
        404: function() {
          alert("page not found: 404 error");
        }
      }
    }).done(function(resp) {
      $(this).addClass("done");
      console.log(resp);
      iterateResponse(resp);
    });
  }

  function start() {
    $(".content").html("");
    const url_val = getRestUrl();
    writeContent(`<h2>Content from: ${url_val}</h2><hr>`);
    getAjaxResponse(url_val);
  }

  function getUniqueUrl(url) {
    $("#url").val(url);
    start();
  }

  $(".otherUrl").click(function() {
    console.log("otherUrl");
    getUniqueUrl($(this).data("url"));
  });

  // when button is clicked get rest url, write top content, and fire off ajax
  $("#url_submit").click(() => {
    console.log("submit clicked");
    start();
  });
})(jQuery);
