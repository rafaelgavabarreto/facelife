$(() => {
  $.ajax({
    method: "GET",
    url: "/post"
  }).done((post) => {
    console.log('hellooooooooo world',post)
    for(p of post) {
      $("<div>").text(p.header_picture).appendTo($("body"));
      $("<div>").text(p.Title).appendTo($("body"));
      $("<div>").text(p.Article).appendTo($("body"));
      $("<div>").text(p.Footer_picture).appendTo($("body"));
      $("<div>").text(p.Footer_image_tagnote).appendTo($("body"));
      $("<div>").text(p.Meta_data).appendTo($("body"));
    }
  });;
});