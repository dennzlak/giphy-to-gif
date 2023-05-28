document.getElementById("link").addEventListener("keyup", function(event) {
    if (event.key === 'Enter') {
     event.preventDefault();
     document.getElementById("but").click();
    }
  });
  
  function validate() {
      var url = document.getElementById('link').value;
      if (!url.startsWith('http') && url.includes('giphy.com')) {
          url = 'https://'+url
          console.log('hi')
      } else if (url.startsWith('http') && (url.includes('giphy.com/gifs') || url.includes('media.giphy.com')) && url.includes('://')) {
          if (url.endsWith('/giphy.gif')) {
              url = url.replace('/giphy.gif', '')
          }
          if (url.endsWith('#')) {
            url = url.replace(/#/g, '')
          }
      }
      else {
          console.log('[!] - URL appears to be invalid.')
          url = false;        
      }
      findGif(url)
  }
  
  function findGif(gif) {
      if (gif == false) {
          return
      }
      else {
          var linkarray = gif.split('/')
          if (gif.includes('-')) {
              var x = linkarray[4].split('-')
              linkarray[4] = x.slice(-1).toString()
          }
          
          var code = linkarray.slice(-1)
  
          if (code.includes('/')) {
              var temp = code.split('/')
              code = temp[0]
          }
          if (code.toString().includes('\r')) {
              var temp = code.toString().split('\r')
              code = temp[0]
          }
  
          var mp4 = "https://media4.giphy.com/media/"+code+"/giphy.gif"
          
          var xhr = new XMLHttpRequest();
          xhr.open('GET', mp4, true);
          xhr.responseType = 'blob';
          xhr.onload = function() {
              var a = document.createElement('a');
              a.href = window.URL.createObjectURL(this.response);;
              a.target = '_blank';
              a.download = code+'.gif';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
          };
          xhr.onerror = err => {
              alert('Failed!');
          };
          xhr.send();
              
      }
  }
  
  