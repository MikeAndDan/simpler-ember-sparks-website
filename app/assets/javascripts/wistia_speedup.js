var Video,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Video = (function() {
  function Video(wistia) {
    this.skipBackward = bind(this.skipBackward, this);
    this.skipForward = bind(this.skipForward, this);
    this.wistia = wistia;
    this.speed = 1.0;
    this.wistia.ready((function(_this) {
      return function() {
        _this.setEvents();
        if (_this.html5_player()) {
          _this.setDefaultSpeed();
          _this.setupPlaybackSpeedLinks();
          return _this.setupPlayerSpeed();
        } else {
          return _this.hidePlaybackSpeedControls();
        }
      };
    })(this));
  }

  Video.prototype.flash_player = function() {
    return this.wistia.data.embedType === "flash";
  };

  Video.prototype.html5_player = function() {
    return !this.flash_player();
  };

  Video.prototype.hideControls = function() {
    return $("[data-behavior='video-controls']").hide();
  };

  Video.prototype.setEvents = function() {
    $("[data-behavior='skip-forward']").on("click", this.skipForward);
    return $("[data-behavior='skip-backward']").on("click", this.skipBackward);
  };

  Video.prototype.skipForward = function() {
    return this.wistia.time(this.wistia.time() + 30);
  };

  Video.prototype.skipBackward = function() {
    return this.wistia.time(this.wistia.time() - 30);
  };

  Video.prototype.setupPlayerSpeed = function() {
    return this.wistia.bind("play", (function(_this) {
      return function() {
        return _this.wistia.playbackRate(_this.speed);
      };
    })(this));
  };

  Video.prototype.setDefaultSpeed = function() {
    var $default;
    $default = $("[data-behavior='video-controls']");
    return this.setSpeed($default.data("speed"), $default.data("name"));
  };

  Video.prototype.setupPlaybackSpeedLinks = function() {
    var dropdown;
    dropdown = $("[data-behavior='video-speed-dropdown']");
    return dropdown.find("a").on("click", (function(_this) {
      return function(e) {
        var $target, label, speed;
        e.preventDefault();
        $target = $(e.currentTarget);
        speed = $target.data("speed");
        label = $target.data("name");
        _this.setSpeed(speed, label);
        return _this.saveSpeedDefault(speed);
      };
    })(this));
  };

  Video.prototype.setSpeed = function(speed, label) {
    var dropdown;
    this.speed = parseFloat(speed);
    this.wistia.playbackRate(this.speed);
    if (label) {
      $("[data-behavior='video-speed-button']").text("Speed " + label);
    }
    dropdown = $("[data-behavior='video-speed-dropdown']");
    dropdown.find("li a span").remove();
    return dropdown.find("li a[data-speed='" + speed + "']").prepend("<span class='pull-right'><i class='fa fa-check'></i></span>");
  };

  Video.prototype.saveSpeedDefault = function(speed) {
    if ($("meta[name='user']").length === 0) {
      return;
    }
    return $.ajax({
      url: "/users",
      data: {
        user: {
          playback_speed: speed
        }
      },
      dataType: "JSON",
      method: "PATCH"
    });
  };

  return Video;

})();

jQuery(function() {
  var video;
  if (typeof wistiaEmbed !== "undefined" && wistiaEmbed !== null) {
    return video = new Video(wistiaEmbed);
  }
});