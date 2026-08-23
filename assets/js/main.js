// satauna.com - small progressive enhancements; native audio remains as fallback
(function () {
  var yearEl = document.getElementById('copyright-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  var players = Array.prototype.slice.call(document.querySelectorAll('[data-audio-player]'));
  var siteVolume = 1;

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) {
      return '0:00';
    }
    var minutes = Math.floor(seconds / 60);
    var remainder = Math.floor(seconds % 60);
    return minutes + ':' + String(remainder).padStart(2, '0');
  }

  players.forEach(function (player) {
    var audio = player.querySelector('audio');
    var controls = player.querySelector('.audio-player__controls');
    var playButton = player.querySelector('.audio-player__play');
    var playIcon = playButton.querySelector('span');
    var seek = player.querySelector('.audio-player__seek');
    var volume = player.querySelector('.audio-player__volume');
    var time = player.querySelector('.audio-player__time');
    var name = player.getAttribute('data-demo-name');

    if (!audio || !controls || !playButton || !seek || !volume || !time) {
      return;
    }

    audio.muted = false;
    audio.volume = siteVolume;
    volume.value = Math.round(siteVolume * 100);
    volume.setAttribute('aria-valuetext', Math.round(siteVolume * 100) + ' percent');
    controls.hidden = false;

    function updateProgress() {
      var duration = Number.isFinite(audio.duration) ? audio.duration : 0;
      var current = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
      var percent = duration ? (current / duration) * 100 : 0;

      seek.max = duration;
      seek.value = current;
      seek.style.setProperty('--progress', percent + '%');
      seek.setAttribute('aria-valuetext', formatTime(current) + ' of ' + formatTime(duration));
      time.textContent = formatTime(current) + ' / ' + formatTime(duration);
    }

    function showPausedState() {
      playButton.setAttribute('aria-label', 'Play ' + name + ' demo');
      playIcon.innerHTML = '&#9654;';
    }

    function showPlayingState() {
      playButton.setAttribute('aria-label', 'Pause ' + name + ' demo');
      playIcon.innerHTML = '&#10074;&#10074;';
    }

    playButton.addEventListener('click', function () {
      if (audio.paused) {
        audio.play().catch(function () {
          showPausedState();
        });
      } else {
        audio.pause();
      }
    });

    seek.addEventListener('input', function () {
      audio.currentTime = Number(seek.value);
      updateProgress();
    });

    volume.addEventListener('input', function () {
      siteVolume = Number(volume.value) / 100;
      players.forEach(function (otherPlayer) {
        var otherAudio = otherPlayer.querySelector('audio');
        var otherVolume = otherPlayer.querySelector('.audio-player__volume');
        if (otherAudio) {
          otherAudio.muted = false;
          otherAudio.volume = siteVolume;
        }
        if (otherVolume) {
          otherVolume.value = Math.round(siteVolume * 100);
          otherVolume.setAttribute('aria-valuetext', Math.round(siteVolume * 100) + ' percent');
        }
      });
    });

    audio.addEventListener('loadedmetadata', updateProgress);
    audio.addEventListener('durationchange', updateProgress);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('play', function () {
      players.forEach(function (otherPlayer) {
        var otherAudio = otherPlayer.querySelector('audio');
        if (otherAudio && otherAudio !== audio && !otherAudio.paused) {
          otherAudio.pause();
        }
      });
      showPlayingState();
    });
    audio.addEventListener('pause', showPausedState);
    audio.addEventListener('ended', function () {
      audio.currentTime = 0;
      updateProgress();
      showPausedState();
    });

    updateProgress();
  });

  var contactForm = document.getElementById('contact-form');
  var formStatus = document.getElementById('form-status');

  if (contactForm && formStatus && window.fetch && window.FormData) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();

      var submitButton = contactForm.querySelector('button[type="submit"]');
      var originalButtonText = submitButton.textContent;

      formStatus.textContent = '';
      formStatus.className = 'form-status';
      contactForm.setAttribute('aria-busy', 'true');
      submitButton.disabled = true;
      submitButton.textContent = 'Sending\u2026';

      fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: {
          Accept: 'application/json'
        }
      }).then(function (response) {
        if (!response.ok) {
          throw new Error('Form submission failed');
        }

        contactForm.reset();
        formStatus.textContent = 'Thanks! Your message has been sent.';
        formStatus.className = 'form-status form-status--success';
        formStatus.focus();
      }).catch(function () {
        formStatus.textContent = 'We could not send your message. Please try again, or email info@satauna.com.';
        formStatus.className = 'form-status form-status--error';
        formStatus.focus();
      }).finally(function () {
        contactForm.removeAttribute('aria-busy');
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      });
    });
  }
})();
