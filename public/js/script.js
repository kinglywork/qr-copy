// Get the file input element and the source button
const fileInput = document.getElementById('file-input');
const sourceButton = document.getElementById('source-button');

// Add an event listener to the source button to show the file input element
sourceButton.addEventListener('click', () => {
  fileInput.click(); // Simulate a click on the file input element
});
// Move the event listener for the file input element to here
function handleFileInputChange(event) {
  const file = event.target.files[0];
  if (file) {
    // Output file name
    document.getElementById('file-name').textContent = `选择的文件：${file.name}`;

    // Read file content as ArrayBuffer
    const reader = new FileReader();
    reader.onload = handleFileRead;
    reader.readAsArrayBuffer(file); // Read file content as ArrayBuffer
  } else {
    document.getElementById('file-name').textContent = '未选择文件';
  }
}

function handleFileRead(e) {
  const fileBuffer = e.target.result;
  const chunks = [];
  for (let i = 0; i < fileBuffer.byteLength; i += 200) {
    const chunk = fileBuffer.slice(i, i + 200);
    const base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(chunk)));
    chunks.push(base64String);
  }

  // Generate QR code
  const qrcodeContainer = document.getElementById('qrcode-container');

  // Ensure QRCode is loaded
  if (typeof QRCode !== 'undefined') {
    let count = 0;
    const intervalId = setInterval(() => {
      if (count < chunks.length) {
        qrcodeContainer.innerHTML = ''; // Clear previous QR code
        new QRCode(qrcodeContainer, {
          text: chunks[count],
          width: 500,
          height: 500,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.L
        });
        count++;
      } else {
        clearInterval(intervalId);
      }
    }, 2000);
  } else {
    console.error('QRCode library is not loaded.');
  }
}

fileInput.addEventListener('change', handleFileInputChange);

function handleDestinationButtonClick() {
  var resultContainer = document.getElementById('qr-reader-results');
  var lastResult, countResults = 0;
  var chunks = [];

  function onScanSuccess(decodedText) {
    if (decodedText !== lastResult) {
      ++countResults;
      chunks.push(decodedText);
      lastResult = decodedText;
      // Handle on success condition with the decoded message.
      console.log(`Scan result ${decodedText}`);
      console.log(chunks.join(""));      
    }
  }

  var html5QrcodeScanner = new Html5QrcodeScanner(
    "qr-reader", { fps: 10, qrbox: 250 });
  html5QrcodeScanner.render(onScanSuccess);
}

document.getElementById('destination-button').addEventListener('click', handleDestinationButtonClick);
