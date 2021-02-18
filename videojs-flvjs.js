(function(videojs, flvjs) {

  // nothing to do if loaded without videojs/flvjs
  if (!videojs || !flvjs) {
      console.error('Missing videojs/flvjs libraries');
      return;
  }

  /**
   *
   * @param source
   * @param tech
   * @constructor
   */
  function Html5FlvJS(source, tech) {
      var options = tech.options_;
      var el = tech.el();
      var duration = null;

      const mediaDataSource = options.mediaDataSource || {};
  
      mediaDataSource.type = mediaDataSource.type === undefined ? 'flv' : mediaDataSource.type;
      mediaDataSource.url = source.src;

      var flv = flvjs.createPlayer(mediaDataSource, options.flvjsConfig);

      /**
       * creates an error handler function
       * @returns {Function}
       */
      function errorHandlerFactory() {
          var _recoverDecodingErrorDate = null;
          var _recoverAudioCodecErrorDate = null;

          return function() {
              var now = Date.now();

              if (!_recoverDecodingErrorDate || (now - _recoverDecodingErrorDate) > 2000) {
                  _recoverDecodingErrorDate = now;
                  console.log('FLV: Error (video)?')
                  //hls.recoverMediaError();
              } else if (!_recoverAudioCodecErrorDate || (now - _recoverAudioCodecErrorDate) > 2000) {
                  _recoverAudioCodecErrorDate = now;
                  console.log('FLV: Error (audio)?')
                  //hls.swapAudioCodec();
                  //hls.recoverMediaError();
              } else {
                  console.error('Error loading media: File could not be played');
              }
          }
      }

      // create separate error handlers for hlsjs and the video tag
      var hlsjsErrorHandler = errorHandlerFactory();
      var videoTagErrorHandler = errorHandlerFactory();

      // listen to error events coming from the video tag
      el.addEventListener('error', function(e) {
          var mediaError = e.currentTarget.error;

          if (mediaError.code === mediaError.MEDIA_ERR_DECODE) {
              videoTagErrorHandler();
          } else {
              console.error('Error loading media: File could not be played');
          }
      });

      /**
       *
       */
      this.dispose = function() {
          flv.destroy();
      };

      /**
       * returns the duration of the stream, or Infinity if live video
       * @returns {Infinity|number}
       */
      this.duration = function() {
          return duration || el.duration || 0;
      };

      // update live status on meida info load
      flv.on(flvjs.Events.MEDIA_INFO, function(data) {
        duration = data.duration || Infinity;
      });

      // try to recover when live and then loading has started
      flv.on(flvjs.Events.LOADING_COMPLETE, function(data){
        //Only if live
        if(duration === Infinity){
          flv.unload();

          setTimeout(function(){
            flv.load();	
            flv.play();
          }, 500);
        }
      })


      // try to recover on fatal errors
      /*hls.on(Hls.Events.ERROR, function(event, data) {
          if (data.fatal) {
              switch (data.type) {
                  case Hls.ErrorTypes.NETWORK_ERROR:
                      hls.startLoad();
                      break;
                  case Hls.ErrorTypes.MEDIA_ERROR:
                      hlsjsErrorHandler();
                      break;
                  default:
                      console.error('Error loading media: File could not be played');
                      break;
              }
          }
      });*/

      Object.keys(flvjs.Events).forEach(function(key) {
          var eventName = flvjs.Events[key];
          flv.on(eventName, function(event, data) {
              tech.trigger(eventName, data);
          });
      });

      // attach flvjs to videotag
      flv.attachMediaElement(el);
      flv.load();
  }

  var FlvSourceHandler = {
      canHandleSource: function(source) {
          var flvTypeRE = /^video\/flv$/i;
          var flvExtRE = /\.flv/i;
          var flvProtoRE = /^((ws:\/\/)|(http:\/\/))/i;

          if (flvTypeRE.test(source.type)) {
              return 'probably';
          } else if (flvExtRE.test(source.src) || flvProtoRE.test(source.src)) {
              return 'maybe';
          } else {
              return '';
          }
      },
      handleSource: function(source, tech) {
          return new Html5FlvJS(source, tech);
      },
      canPlayType: function(type) {
          var flvTypeRE = /^video\/flv$/i;
          if (flvTypeRE.test(type)) {
              return 'probably';
          }

          return '';
      }
  };

  // only attach this source handler is its supported
  if (flvjs.isSupported()) {
      videojs.getTech('Html5').registerSourceHandler(FlvSourceHandler, 0);
  }
})(window.videojs, window.flvjs);
