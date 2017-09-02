import "./global.css";

import Home from "pages/home.vue";

const run = () => {

  // 设置 .tdx-loading 的高度
  $("#app").css("height", $(window).height() - 20);
  $(".tdx-loading").css("height", $(window).height() - 20);

  setTimeout( () => {

    new Vue({
      el: "#app",
      data: {},
      computed: {

        ViewPage() {

          // 这里可以设置判断条件，来显示不同的 pages
          return Home;
        }
      },

      render(h) {
        return h(this.ViewPage);
      }
    });

  }, 2000);

}

run();