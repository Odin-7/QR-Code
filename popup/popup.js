window.onload = function () {
  qr_show = document.getElementById('qr-show')
  qr_edit = document.getElementById('qr-edit')
  textarea = document.getElementsByTagName('textarea')[0]

  chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  }, function (tab) {
    let OwnIp
    getLocalIPs(function (ips) {
      OwnIp = ips && ips[1]
      if (tab[0].url.includes('localhost') || tab[0].url.includes('127.0.0.1')) {
        let url = tab[0].url.replace('localhost', OwnIp)
        url = url.replace('127.0.0.1', OwnIp)
        make(url)
      } else {
        make(tab[0].url)
      }
    });
  })

  function getLocalIPs(callback) {
    var ips = [];
    var RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection;
    var pc = new RTCPeerConnection({ iceServers: [] });

    pc.createDataChannel('');

    pc.onicecandidate = function (e) {
      if (!e.candidate) {
        pc.close();
        callback(ips);
        return;
      }
      var ip = /^candidate:.+ (\S+) \d+ typ/.exec(e.candidate.candidate)[1];
      if (ips.indexOf(ip) == -1) ips.push(ip);
    };

    pc.createOffer(function (sdp) {
      pc.setLocalDescription(sdp);
    }, function onerror() { });
  }


  function toggle(flag) {
    qr_show.style.display = flag ? 'block' : 'none'
    qr_edit.style.display = flag ? 'none' : 'block'
  }

  function make(url) {
    var str = url.trim()
    if (str) {
      var qr = qrcode(0, 'L')
      qr.addData(str)
      qr.make()
      document.getElementById('qr').innerHTML = qr.createImgTag(4, 2)
      textarea.value = str
    }
  }
  document.getElementById('confirm').addEventListener('click', function () {
    make(textarea.value)
    toggle(1)
  })
  document.getElementById('cancle').addEventListener('click', function () {
    toggle(1)
  })
  document.getElementById('qr').addEventListener('click', function () {
    toggle(0)
    textarea.focus()
    textarea.select()
  })
}
