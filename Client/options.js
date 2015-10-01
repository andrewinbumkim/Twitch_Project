// Saves options to chrome.storage
function save_options() {
  var names = document.getElementById("names").value.split(" ");
  chrome.storage.sync.set({
    "names": names
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    names: ""
  }, function(items) {
    document.getElementById("names").value = items.names.join(" ");
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);